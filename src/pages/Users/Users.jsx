import React from "react";

import { Loader, User } from "../../components";
import { useData } from "../../context/DataContext";

import "./Users.scss";

const Users = () => {
  const { users, loading } = useData();

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="users">
      {users.map((user, index) => (
        <User key={index} user={user} />
      ))}
    </div>
  );
};

export default Users;
