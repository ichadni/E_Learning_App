import React from "react";
import { MdDashboard, MdAdminPanelSettings } from "react-icons/md";
import "./account.css";
import { IoMdLogOut } from "react-icons/io";
import { FaUser, FaEnvelope, FaUserTag } from "react-icons/fa";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Account = ({ user }) => {
  const { setIsAuth, setUser } = UserData();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    setUser([]);
    setIsAuth(false);
    toast.success("Logged Out Successfully");
    navigate("/login");
  };

  return (
    <div>
      {user && (
        <div className="profile">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-title">
              <h2>{user.name}</h2>
              <span className={`role-badge ${user.role || 'user'}`}>
                {user.role || 'User'}
              </span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="profile-info">
            <div className="info-item">
              <div className="icon"><FaUser /></div>
              <div>
                <span className="label">Full Name</span>
                <div className="value">{user.name}</div>
              </div>
            </div>
            <div className="info-item">
              <div className="icon"><FaEnvelope /></div>
              <div>
                <span className="label">Email Address</span>
                <div className="value">{user.email}</div>
              </div>
            </div>
            <div className="info-item">
              <div className="icon"><FaUserTag /></div>
              <div>
                <span className="label">Role</span>
                <div className="value" style={{ textTransform: 'capitalize' }}>
                  {user.role || 'User'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            {user.role !== "admin" && user.role !== "superadmin" && (
              <button
                onClick={() => navigate(`/${user._id}/dashboard`)}
                className="common-btn dashboard"
              >
                <MdDashboard /> My Dashboard
              </button>
            )}

            {user.role === "admin" || user.role === "superadmin" ? (
              <button
                onClick={() => navigate(`/admin/dashboard`)}
                className="common-btn admin"
              >
                <MdAdminPanelSettings /> Admin Dashboard
              </button>
            ) : null}

            <button
              onClick={logoutHandler}
              className="common-btn logout"
            >
              <IoMdLogOut /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;