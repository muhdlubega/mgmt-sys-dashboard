import React from "react";
import { RandomAvatar } from "react-random-avatars";
import { Link } from "react-router-dom";

import "./User.scss";

const User = ({ user }) => {
  return (
    <Link to={`/user/${user.id}`} className="user" key={user.id}>
      <RandomAvatar
        name={user.name || user.email?.split("@")[0]}
        size={window.innerWidth < 768 ? 60 : 100}
      />
      <div className="user-content">
        <h4>{user.name || user.email?.split("@")[0]}</h4>
        <p>{user.username}</p>
        <p>{user.email}</p>
      </div>
    </Link>
  );
};

export default User;
