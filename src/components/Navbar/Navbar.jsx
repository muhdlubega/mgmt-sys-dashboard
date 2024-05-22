import React, { useEffect, useState } from "react";
import "./Navbar.scss";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");

    if (category) {
      setMenu(category);
    } else {
      const path = location.pathname.split("/")[1];
      setMenu(path || "home");
    }
  }, [location]);

  return (
    <div className="navbar">
      <Link onClick={() => setMenu("home")} to="/" className="navbar-logo">
        <p className="navbar-logo__title">
          Mgmt<strong>Sys</strong>
        </p>
      </Link>
      <ul className="navbar-menu">
        <li
          onClick={() => {
            setMenu("dashboard");
          }}
        >
          <Link to="/dashboard">Dashboard</Link>
          <hr
            className={
              menu === "dashboard"
                ? "navbar-dashline--active"
                : "navbar-dashline"
            }
          />
        </li>
        <li
          onClick={() => {
            setMenu("users");
          }}
        >
          <Link to="/users">Users</Link>
          <hr
            className={
              menu === "users" ? "navbar-dashline--active" : "navbar-dashline"
            }
          />
        </li>
        <li
          onClick={() => {
            setMenu("posts");
          }}
        >
          <Link to="/posts">Posts</Link>
          <hr
            className={
              menu === "posts" ? "navbar-dashline--active" : "navbar-dashline"
            }
          />
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
