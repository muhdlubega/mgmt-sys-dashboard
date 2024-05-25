import React from "react";
import { RandomAvatar } from "react-random-avatars";
import { Link } from "react-router-dom";

import "./User.scss";

const User = ({ user }) => {
  return (
    <li className="user" key={user.id}>
      <Link to={`/user/${user.id}`}>
        <RandomAvatar name={user.name || user.email?.split("@")[0]} size={40} />
        <p>{user.name || user.email?.split("@")[0]}</p>
      </Link>
      <p>{user.username}</p>
      <p>{user.email}</p>
    </li>
  );
};

export default User;
