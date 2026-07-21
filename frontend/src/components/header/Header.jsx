import React from "react";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import { FaSignOutAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import NotificationBell from "../notification/NotificationBell";

const Header = ({ isAuth }) => {
  const { user, setIsAuth, setUser } = UserData();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    setUser([]);
    setIsAuth(false);
    toast.success("Logged Out");
    navigate("/login");
  };

  return (
    <header>
      <div className="logo">
        <Link to="/">📚 E-Learning</Link>
      </div>

      <div className="link">
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/about">About</Link>

        {/* Notification Bell - Only for logged in users */}
        {isAuth && <NotificationBell />}

        {isAuth && user ? (
          <div className="user-menu">
            <Link to="/account" className="user-profile">
              <div className="user-avatar">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="user-name">Account</span>  {/* ✅ Changed to "Account" */}
            </Link>
            <button onClick={logoutHandler} className="logout-btn" title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <Link to="/login" className="login-btn-nav">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;