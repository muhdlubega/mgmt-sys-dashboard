import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { auth, db } from "../firebaseConfig";

const AuthContext = createContext();

const googleProvider = new GoogleAuthProvider();

const mockInitialSalesData = {
  "Q1 2023": { revenue: 335000, profit: 150750 },
  "Q2 2023": { revenue: 518000, profit: 233100 },
  "Q3 2023": { revenue: 842100, profit: 378950 },
  "Q4 2023": { revenue: 462300, profit: 208030 },
  "Q1 2024": { revenue: 776300, profit: 349330 },
  "Q2 2024": { revenue: 920000, profit: 414000 },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState({});
  const [salesData, setSalesData] = useState({});
  const [pendingOrders, setPendingOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [todos, setTodos] = useState([]);

  const firestore = getFirestore();
  const users = collection(firestore, "users");

  const fetchInventory = useCallback(async () => {
    const q = query(collection(db, "inventory"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const inventoryArray = [];
      querySnapshot.forEach((doc) => {
        const inventoryData = doc.data();
        inventoryArray.push({
          ...inventoryData,
          date: inventoryData.date ? inventoryData.date.toDate() : null,
        });
      });
      setInventory(inventoryArray);
    });
    return unsubscribe;
  }, []);

  const fetchTodos = useCallback(async (userId) => {
    const q = query(collection(db, "users", userId, "todos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todosArray = [];
      querySnapshot.forEach((doc) => {
        const todoData = doc.data();
        todosArray.push({
          ...todoData,
          id: doc.id,
        });
      });
      setTodos((prevTodos) => [...prevTodos, ...todosArray]);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        fetchPendingOrders(user.uid);
        fetchTransactions(user.uid);
        await fetchTodos(user.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          let userExists = false;
          const checkUser = async () => {
            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc) => {
              if (doc.id === auth.currentUser.uid) {
                userExists = true;
              }
            });

            if (!userExists) {
              initializeUser(
                result.user.displayName,
                result.user.email,
                result.user.photoURL
              );
            } else {
              setUser({ ...user });
            }
          };
          checkUser();
          setAlert({
            open: true,
            message: `Sign In Successful. Welcome ${result.user.email}`,
            type: "success",
          });
        }
      })
      .catch((error) => {
        setAlert({
          open: true,
          message: error.message,
          type: "error",
        });
      });

    return () => unsubscribe();
  }, [fetchTodos, user]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setAlert({
        open: true,
        message: "Logged out successfully",
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeUser = async (displayName, email, photoURL) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await setDoc(doc(db, "users", currentUser.uid), {
        displayName,
        email,
        photoURL,
      });

      const transactionsRef = doc(db, "transactions", currentUser.uid);
      const pendingOrdersRef = doc(db, "pendingOrders", currentUser.uid);
      const todosRef = collection(db, "users", currentUser.uid, "todos");

      await setDoc(transactionsRef, {
        userId: currentUser.uid,
        transactions: [],
      });
      await setDoc(pendingOrdersRef, { userId: currentUser.uid, orders: [] });
      await addDoc(todosRef, {});

      setUser({ displayName, email, photoURL });
    }
  };

  const updateUserDetails = async (uid, values) => {
    setLoading(true);
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        await updateDoc(userDocRef, values);
      } else {
        await setDoc(userDocRef, values);
      }

      if (values.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: values.displayName,
        });
      }

      setUser({ ...user, ...values });
      setAlert({
        open: true,
        message: "Profile updated successfully",
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingOrders = async (userId) => {
    const q = query(
      collection(db, "pendingOrders"),
      where("userId", "==", userId)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersArray = [];
      querySnapshot.forEach((doc) => {
        const orderData = doc.data().orders.map((order) => ({
          ...order,
          date: order.date.toDate(),
        }));
        ordersArray.push(...orderData);
      });
      setPendingOrders(ordersArray);
    });
    return unsubscribe;
  };

  const fetchTransactions = async (userId) => {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactionsArray = [];
      querySnapshot.forEach((doc) => {
        const transactionData = doc.data().transactions.map((transaction) => ({
          ...transaction,
          date: transaction.date.toDate(),
        }));
        transactionsArray.push(...transactionData);
      });
      setTransactions(transactionsArray);
    });
    return unsubscribe;
  };

  const fetchSalesData = useCallback(async () => {
    const salesDocRef = doc(db, "sales", "mockSalesData");
    const salesDoc = await getDoc(salesDocRef);

    if (salesDoc.exists()) {
      setSalesData(salesDoc.data());
    } else {
      console.error("Sales data not found!");
    }
  }, []);

  const addTransaction = async (transaction) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const transactionsCollection = collection(db, "transactions");
      const q = query(
        transactionsCollection,
        where("userId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          transactions: [
            ...querySnapshot.docs[0].data().transactions,
            transaction,
          ],
        });
      } else {
        await addDoc(transactionsCollection, {
          userId: currentUser.uid,
          transactions: [transaction],
        });
      }
      await updateSalesData(transaction);
      fetchSalesData();
    }
  };

  const updateSalesData = async (transaction) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const salesDocRef = doc(db, "sales", "mockSalesData");
      const salesDoc = await getDoc(salesDocRef);
      const salesData = salesDoc.exists()
        ? salesDoc.data()
        : mockInitialSalesData;
      const currentQuarter = `Q${Math.floor(
        (new Date().getMonth() + 3) / 3
      )} ${new Date().getFullYear()}`;
      const revenue = transaction.amount;
      const profit = revenue * 0.45;

      if (salesData[currentQuarter]) {
        salesData[currentQuarter].revenue += revenue;
        salesData[currentQuarter].profit += profit;
      } else {
        salesData[currentQuarter] = { revenue, profit };
      }

      await setDoc(salesDocRef, salesData);
    }
  };

  const addPendingOrder = async (order) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const ordersCollection = collection(db, "pendingOrders");
      const q = query(ordersCollection, where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        const existingOrders = querySnapshot.docs[0].data().orders || [];
        await updateDoc(docRef, {
          orders: [...existingOrders, order],
        });
      } else {
        await addDoc(ordersCollection, {
          userId: currentUser.uid,
          orders: [order],
        });
      }
    }
  };

  const addInventory = async (inventoryData) => {
    const userRef = collection(db, "inventory");
    const newInventory = {
      ...inventoryData,
      date: inventoryData.date || Timestamp.now(),
    };
    await addDoc(userRef, newInventory);
  };

  const deleteTransaction = async (transactionId) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const transactionsCollection = collection(db, "transactions");
      const q = query(
        transactionsCollection,
        where("userId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        const transactionData = querySnapshot.docs[0].data().transactions;
        const transactionToDelete = transactionData.find(
          (transaction) => transaction.id === transactionId
        );

        await updateDoc(docRef, {
          transactions: arrayRemove(transactionToDelete),
        });

        await updateSalesDataOnDelete(transactionToDelete);
        fetchSalesData();
      }
    }
  };

  const addTodo = async (todo) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const todosCollection = collection(db, "users", currentUser.uid, "todos");
      await addDoc(todosCollection, todo);
    }
  };

  const updateSalesDataOnDelete = async (transaction) => {
    const salesDocRef = doc(db, "sales", "mockSalesData");
    const salesDoc = await getDoc(salesDocRef);
    const salesData = salesDoc.exists()
      ? salesDoc.data()
      : mockInitialSalesData;
    const currentQuarter = `Q${Math.floor(
      (new Date().getMonth() + 3) / 3
    )} ${new Date().getFullYear()}`;
    const revenue = transaction.amount;
    const profit = revenue * 0.45;

    if (salesData[currentQuarter]) {
      salesData[currentQuarter].revenue -= revenue;
      salesData[currentQuarter].profit -= profit;
    }

    await setDoc(salesDocRef, salesData);
  };

  const deletePendingOrder = async (orderId) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const ordersCollection = collection(db, "pendingOrders");
      const q = query(ordersCollection, where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        const orderData = querySnapshot.docs[0].data().orders;
        const orderToDelete = orderData.find((order) => order.id === orderId);

        await updateDoc(docRef, {
          orders: arrayRemove(orderToDelete),
        });
      }
    }
  };

  const updateTodo = async (todoId, completed) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const todoDocRef = doc(db, "users", currentUser.uid, "todos", todoId);
      await updateDoc(todoDocRef, { completed });
    }
  };

  const deleteTodo = async (todoId) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const todosCollection = collection(db, "users", currentUser.uid, "todos");
      const todoDocRef = doc(todosCollection, todoId);
      await deleteDoc(todoDocRef);
    }
  };

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <AuthContext.Provider
      value={{
        alert,
        user,
        users,
        loading,
        open,
        email,
        password,
        confirmPassword,
        setEmail,
        setPassword,
        setConfirmPassword,
        signInWithGoogle,
        handleLogout,
        handleClose,
        handleOpen,
        updateUserDetails,
        addTransaction,
        addPendingOrder,
        addInventory,
        userTodos: todos,
        addTodo,
        salesData,
        fetchSalesData,
        pendingOrders,
        inventory,
        transactions,
        updateTodo,
        deleteTransaction,
        deletePendingOrder,
        deleteTodo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
