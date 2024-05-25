import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  Timestamp,
} from "firebase/firestore";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FaTrash } from "react-icons/fa6";
import { TiTickOutline, TiTimesOutline } from "react-icons/ti";
import { RandomAvatar } from "react-random-avatars";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Loader } from "../../components";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { db } from "../../firebaseConfig";
import { Error404 } from "../Error404";

import { todoSchema } from "../../utils/validationSchema";

import "./UserProfile.scss";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading: dataLoading, posts, users, todos } = useData();
  const { addTodo, updateTodo, user, deleteTodo } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userTodos, setUserTodos] = useState([]);
  const isApiUser = /^\d+$/.test(id);
  const userId = isApiUser ? parseInt(id) : id;

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (isApiUser) {
        const userFromData = users.find((user) => user.id === userId);
        if (userFromData) {
          setUserProfile(userFromData);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } else {
        try {
          const userDocRef = doc(db, "users", id);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            setUserProfile(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserProfile(null);
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchUserTodos = () => {
      if (isApiUser) {
        setUserTodos(todos);
      } else {
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
          setUserTodos(todosArray);
        });
        return unsubscribe;
      }
    };

    fetchUserData();
    fetchUserTodos();
  }, [id, isApiUser, todos, userId, users]);

  const todoList = userTodos.filter((todo) => todo.userId === userId);
  const userPosts = posts.filter((post) => post.userId === userId);

  const handleSubmit = async (values, { resetForm }) => {
    if (user && user.email === userProfile.email) {
      try {
        await addTodo({
          ...values,
          userId: user.uid,
          completed: false,
          date: Timestamp.now(),
        });
        resetForm();
      } catch (error) {
        console.error("Error adding todo: ", error);
      }
    }
  };

  const handleToggleCompletion = async (todoId, currentStatus) => {
    try {
      await updateTodo(todoId, !currentStatus);
    } catch (error) {
      console.error("Error updating todo: ", error);
    }
  };

  if (loading || dataLoading) {
    return <Loader />;
  }

  if (!userProfile) {
    return <Error404 />;
  }

  return (
    <div className="user-profile">
      <button onClick={handleBackClick} className="back-button">
        Back
      </button>
      <RandomAvatar
        name={userProfile.name || userProfile.email?.split("@")[0]}
        size={96}
      />
      <h1>{userProfile.name || userProfile.email?.split("@")[0]}</h1>
      <p>Username: {userProfile.username}</p>
      <p>Email: {userProfile.email}</p>
      <p>Phone: {userProfile.phone}</p>
      <p>Website: {userProfile.website}</p>
      <p>Company: {userProfile.company?.name}</p>
      <p>
        Address: {userProfile.address?.street}, {userProfile.address?.city}
      </p>
      <div className="user-todos">
        <h3>Todos:</h3>
        {user && user.email === userProfile.email && (
          <Formik
            initialValues={{ title: "" }}
            validationSchema={todoSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form>
                <div>
                  <Field type="text" name="title" placeholder="Todo title" />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="error"
                  />
                </div>
                <button type="submit" disabled={isSubmitting || !isValid}>
                  {isSubmitting ? "Adding..." : "Add Todo"}
                </button>
              </Form>
            )}
          </Formik>
        )}
        {todoList.length > 0 ? (
          <ul>
            {todoList.map((todo) => (
              <li key={todo.id} className="todo-item">
                {todo.completed ? (
                  <TiTickOutline
                    className="icon-completed"
                    onClick={() =>
                      handleToggleCompletion(todo.id, todo.completed)
                    }
                  />
                ) : (
                  <TiTimesOutline
                    className="icon-not-completed"
                    onClick={() =>
                      handleToggleCompletion(todo.id, todo.completed)
                    }
                  />
                )}
                <span className={todo.completed ? "completed" : ""}>
                  {todo.title}
                </span>
                {user && user.email === userProfile.email && (
                  <FaTrash onClick={() => deleteTodo(todo.id)} />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No todos found.</p>
        )}
      </div>
      {isApiUser && (
        <div className="user-posts">
          <h3>Posts:</h3>
          {userPosts.length > 0 ? (
            userPosts.map((post, index) => (
              <Link key={index} to={`/post/${post.id}`}>
                <p>{post.title}</p>
                <p>{post.body}</p>
              </Link>
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
