import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import "./dashboard.css";

const AdminDashbord = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.role !== "admin" && user.role !== "superadmin") return navigate("/");
  const [stats, setStats] = useState({ totalCourses: 0, totalLectures: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  async function fetchStats() {
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setStats(data.stats || { totalCourses: 0, totalLectures: 0, totalUsers: 0 });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="main-content loading">
          <div className="spinner"></div>
          <p>Loading stats...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="main-content">
        <div className="box">
          <span className="icon">📚</span>
          <div className="box-content">
            <p>Total Courses</p>
            <p>{stats.totalCourses || 0}</p>
          </div>
        </div>
        <div className="box">
          <span className="icon">🎥</span>
          <div className="box-content">
            <p>Total Lectures</p>
            <p>{stats.totalLectures || 0}</p>
          </div>
        </div>
        <div className="box">
          <span className="icon">👥</span>
          <div className="box-content">
            <p>Total Users</p>
            <p>{stats.totalUsers || 0}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashbord;