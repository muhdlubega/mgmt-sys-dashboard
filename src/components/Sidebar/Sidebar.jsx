import React, { useState } from "react";
import {
  FaBars,
  FaClipboard,
  FaGoogle,
  FaTachometerAlt,
  FaUsers,
} from "react-icons/fa";
import { RiLogoutCircleFill } from "react-icons/ri";
import { RandomAvatar } from "react-random-avatars";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { SearchBar } from "../SearchBar";

import "./Sidebar.scss";

const Sidebar = ({ children }) => {
  const { user, loading, signInWithGoogle, handleLogout, onClose } = useAuth();
  const [isOpen, setIsOpen] = useState(window.innerWidth > 992 ? true : false);

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
    onClose();
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            {isOpen && (
              <p className="sidebar-logo__title">
                Mgmt<strong>Sys</strong>
              </p>
            )}
          </Link>
          <FaBars className="hamburger" onClick={() => setIsOpen(!isOpen)} />
        </div>
        {user && (
          <Link to={`/user/${user.uid}`} className="user-email">
            <RandomAvatar
              name={user.name || user.email?.split("@")[0]}
              size={24}
            />
            {isOpen && <span>{user.name || user.email?.split("@")[0]}</span>}
          </Link>
        )}
        <SearchBar />
        <ul className="sidebar-menu">
          <li>
            <Link to="/">
              <FaTachometerAlt className="menu-icon" />
              {isOpen && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link to="/users">
              <FaUsers className="menu-icon" />
              {isOpen && <span>Users</span>}
            </Link>
          </li>
          <li>
            <Link to="/posts">
              <FaClipboard className="menu-icon" />
              {isOpen && <span>Posts</span>}
            </Link>
          </li>
          {user && (
            <li>
              <Link to="/settings">
                <FaClipboard className="menu-icon" />
                {isOpen && <span>Settings</span>}
              </Link>
            </li>
          )}
        </ul>
        {user ? (
          <button onClick={handleLogout}>
            <RiLogoutCircleFill color="blue" size={24} />
            {isOpen && <span>Logout</span>}
          </button>
        ) : (
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="google-login-button"
          >
            <FaGoogle />
            {isOpen && (loading ? "Loading..." : "Login with Google")}
          </button>
        )}
      </div>
      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
        {children}
      </div>
    </>
  );
};

export default Sidebar;
