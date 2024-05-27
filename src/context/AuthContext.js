import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
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

  const handleClose = useCallback(() => setOpen(false), []);
  const handleOpen = useCallback(() => setOpen(true), []);

  // Functions to create, sign in and log out firebase user
  const initializeUser = useCallback(async (displayName, email, photoURL) => {
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
  }, []);

  const signInWithGoogle = useCallback(async () => {
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
  }, []);

  const handleLogout = useCallback(async () => {
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
  }, []);

  // Function to update firebase user details in the user settings page
  const updateUserDetails = useCallback(async (uid, values) => {
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

      setUser((prevUser) => ({ ...prevUser, ...values }));
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
  }, []);

  // Functions to manage sales data for sales analysis
  const fetchSalesData = useCallback(async () => {
    const salesDocRef = doc(db, "sales", "mockSalesData");
    const salesDoc = await getDoc(salesDocRef);

    if (salesDoc.exists()) {
      setSalesData(salesDoc.data());
    } else {
      console.error("Sales data not found!");
    }
  }, []);

  const updateSalesData = useCallback(async (transaction) => {
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
  }, []);

  const updateSalesDataOnDelete = useCallback(async (transaction) => {
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
  }, []);

  //Functions to fetch and manage pending transactions
  const fetchTransactions = useCallback(async (userId) => {
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
  }, []);

  const addTransaction = useCallback(
    async (transaction) => {
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
    },
    [fetchSalesData, updateSalesData]
  );

  const deleteTransaction = useCallback(
    async (transactionId) => {
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
    },
    [fetchSalesData, updateSalesDataOnDelete]
  );

  // Functions to fetch and manage inventory
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

  const addInventory = useCallback(async (inventoryData) => {
    const userRef = collection(db, "inventory");
    const newInventory = {
      ...inventoryData,
      date: inventoryData.date || Timestamp.now(),
    };
    await addDoc(userRef, newInventory);
  }, []);

  // Functions to fetch and manage pending orders
  const fetchPendingOrders = useCallback(async (userId) => {
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
  }, []);

  const addPendingOrder = useCallback(async (order) => {
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
  }, []);

  const deletePendingOrder = useCallback(async (orderId) => {
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
  }, []);

  // Functions to manage todos
  const addTodo = useCallback(async (todo) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const todosCollection = collection(db, "users", currentUser.uid, "todos");
      await addDoc(todosCollection, todo);
    }
  }, []);

  const updateTodo = useCallback(async (todoId, completed) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const todoDocRef = doc(db, "users", currentUser.uid, "todos", todoId);
      await updateDoc(todoDocRef, { completed });
    }
  }, []);

  const deleteTodo = useCallback(async (todoId) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const todosCollection = collection(db, "users", currentUser.uid, "todos");
      const todoDocRef = doc(todosCollection, todoId);
      await deleteDoc(todoDocRef);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Hook to fetch latest data of user when update is needed or fetched
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        fetchPendingOrders(user.uid);
        fetchTransactions(user.uid);
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
  }, [fetchPendingOrders, fetchTransactions, initializeUser, user]);

  const value = useMemo(
    () => ({
      alert,
      firestoreUser: user,
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
    }),
    [
      alert,
      user,
      loading,
      open,
      email,
      password,
      confirmPassword,
      signInWithGoogle,
      handleLogout,
      handleClose,
      handleOpen,
      updateUserDetails,
      addTransaction,
      addPendingOrder,
      addInventory,
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
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
