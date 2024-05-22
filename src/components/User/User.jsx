import React from "react";
import "./User.scss";
import { Link } from "react-router-dom";
import { RandomAvatar } from "react-random-avatars";

const User = ({ user }) => {
  return (
    <li className="user" key={user.id}>
      <Link to={`/user/${user.id}`}>
        <RandomAvatar name={user.name} size={40} />
        <p>{user.name}</p>
      </Link>
      <p>{user.username}</p>
      <p>{user.email}</p>
    </li>
  );
};

export default User;
