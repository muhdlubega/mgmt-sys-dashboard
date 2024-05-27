import React, { useState } from "react";
import {
  FaBars,
  FaClipboard,
  FaGoogle,
  FaTachometerAlt,
  FaUsers,
} from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { RiLogoutCircleFill } from "react-icons/ri";
import { RandomAvatar } from "react-random-avatars";
import { useLocation, Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { SearchBar } from "../SearchBar";

import "./Sidebar.scss";

const Sidebar = ({ children }) => {
  const { firestoreUser, loading, signInWithGoogle, handleLogout, onClose } =
    useAuth();
  const [isOpen, setIsOpen] = useState(window.innerWidth > 992 ? true : false);
  const location = useLocation();

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
    onClose();
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
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
          <FaBars
            size={24}
            className="hamburger"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
        {firestoreUser && (
          <Link to={`/user/${firestoreUser.uid}`} className="user-email">
            <RandomAvatar
              name={firestoreUser.name || firestoreUser.email?.split("@")[0]}
              size={24}
            />
            {isOpen && (
              <span>
                {firestoreUser.name || firestoreUser.email?.split("@")[0]}
              </span>
            )}
          </Link>
        )}
        <SearchBar isOpen={isOpen} setIsOpen={setIsOpen} />
        <ul className="sidebar-menu">
          <li className={isActive("/")}>
            <Link to="/">
              <FaTachometerAlt className="menu-icon" size={24} />
              {isOpen && <span>Dashboard</span>}
            </Link>
          </li>
          <li className={isActive("/users")}>
            <Link to="/users">
              <FaUsers className="menu-icon" size={24} />
              {isOpen && <span>Users</span>}
            </Link>
          </li>
          <li className={isActive("/posts")}>
            <Link to="/posts">
              <FaClipboard className="menu-icon" size={24} />
              {isOpen && <span>Posts</span>}
            </Link>
          </li>
          {firestoreUser && (
            <li className={isActive("/settings")}>
              <Link to="/settings">
                <FaGear className="menu-icon" size={24} />
                {isOpen && <span>Settings</span>}
              </Link>
            </li>
          )}
        </ul>
        {firestoreUser ? (
          <button className="sidebar-logout" onClick={handleLogout}>
            <RiLogoutCircleFill color="white" size={26} />
            {isOpen && <span className="sidebar-logout__text">Logout</span>}
          </button>
        ) : (
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="google-login-button"
          >
            <FaGoogle size={22} />
            {isOpen && (
              <p className="google-login-button__text">
                {loading ? "Loading..." : "Login with Google"}
              </p>
            )}
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
