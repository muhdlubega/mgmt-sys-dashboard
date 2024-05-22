import React from "react";
import { Link, useParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { Loader } from "../../components";
import { Error404 } from "../Error404";
import { RandomAvatar } from "react-random-avatars";
import { TiTickOutline, TiTimesOutline } from "react-icons/ti";
import "./UserProfile.scss";

const UserProfile = () => {
  const { id } = useParams();
  const { loading, posts, users, todos } = useData();
  const userId = parseInt(id, 10);

  const user = users.find((user) => user.id === userId);
  const todoList = todos.filter((todo) => todo.userId === userId);
  const userPosts = posts.filter((post) => post.userId === userId);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Error404 />;
  }

  return (
    <div className="user-profile">
      <RandomAvatar name={user.name} size={96} />
      <h1>{user.name}</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Website: {user.website}</p>
      <p>Company: {user.company.name}</p>
      <p>
        Address: {user.address.street}, {user.address.city}
      </p>
      <div className="user-todos">
        <h3>Todos:</h3>
        {todoList.length > 0 ? (
          <ul>
            {todoList.map((todo) => (
              <li key={todo.id} className="todo-item">
                {todo.completed ? (
                  <TiTickOutline className="icon-completed" />
                ) : (
                  <TiTimesOutline className="icon-not-completed" />
                )}
                <span className={todo.completed ? "completed" : ""}>
                  {todo.title}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No todos found.</p>
        )}
      </div>
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
    </div>
  );
};

export default UserProfile;
