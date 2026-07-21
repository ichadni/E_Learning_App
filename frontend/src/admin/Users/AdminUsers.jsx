import React, { useEffect, useState } from "react";
import "./users.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Layout from "../Utils/Layout";
import toast from "react-hot-toast";

const AdminUsers = ({ user }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FIX 1: Move navigation to useEffect
  useEffect(() => {
    if (user && user.mainrole !== "superadmin") {
      navigate("/");
    }
  }, [user, navigate]);

  async function fetchUsers() {
    try {
      const { data } = await axios.get(`${server}/api/users`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setUsers(data.users || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id) => {
    if (window.confirm("Are you sure you want to update this user's role?")) {
      try {
        const { data } = await axios.put(
          `${server}/api/user/${id}`,
          {},
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        toast.success(data.message);
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update role");
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="users">
          <h1>All Users</h1>
          <p>Loading users...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="users">
        <h1>All Users</h1>
        
        <table border="black">
          <thead>
            <tr>
              <td>#</td>
              <td>Name</td>
              <td>Email</td>
              <td>Role</td>
              <td>Update Role</td>
            </tr>
          </thead>
          
          {/* ✅ FIX 2: Single tbody with unique keys */}
          <tbody>
            {users && users.length > 0 ? (
              users.map((e, i) => (
                <tr key={e._id || i}>
                  <td>{i + 1}</td>
                  <td>{e.name}</td>
                  <td>{e.email}</td>
                  <td>{e.role || "user"}</td>
                  <td>
                    <button
                      onClick={() => updateRole(e._id)}
                      className="common-btn"
                    >
                      Update Role
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default AdminUsers;