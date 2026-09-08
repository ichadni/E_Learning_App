import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import "./dashboard.css";

const AdminDashbord = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.role !== "admin" && user.role !== "superadmin") return navigate("/");
  
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLectures: 0,
    totalUsers: 0,
    totalEnrollments: 0,
    topCourses: [],
    recentEnrollments: []
  });
  const [loading, setLoading] = useState(true);

  // ✅ Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // ✅ Get relative time (e.g., "2 hours ago")
  const getTimeAgo = (dateString) => {
    if (!dateString) return "N/A";
    const now = new Date();
    const past = new Date(dateString);
    const diff = Math.floor((now - past) / 1000);
    
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return formatDate(dateString);
  };

  async function fetchStats() {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: {
          token: token,
        },
      });

      console.log("📊 Stats received:", data.stats);
      setStats(data.stats || { 
        totalCourses: 0, 
        totalLectures: 0, 
        totalUsers: 0,
        totalEnrollments: 0,
        topCourses: [],
        recentEnrollments: []
      });
      setLoading(false);
    } catch (error) {
      console.log("❌ Error fetching stats:", error);
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
        {/* Stats Cards */}
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

        <div className="box">
          <span className="icon">📊</span>
          <div className="box-content">
            <p>Total Enrollments</p>
            <p>{stats.totalEnrollments || 0}</p>
          </div>
        </div>

        {/* Top Courses */}
        {stats.topCourses && stats.topCourses.length > 0 && (
          <div className="box full-width">
            <span className="icon">🏆</span>
            <div className="box-content">
              <p>Top Enrolled Courses</p>
              <div className="top-courses">
                {stats.topCourses.map((course, index) => (
                  <div key={index} className="top-course-item">
                    <span className="rank">#{index + 1}</span>
                    <span className="course-name">{course.title}</span>
                    <span className="course-count">{course.count} students</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Enrollments */}
        {stats.recentEnrollments && stats.recentEnrollments.length > 0 && (
          <div className="box full-width enrollments">
            <span className="icon">📋</span>
            <div className="box-content">
              <p>Recent Enrollments</p>
              <div className="enrollments-list">
                <table className="enrollments-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>User</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>Enrolled At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentEnrollments.map((enrollment, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{enrollment.userName}</td>
                        <td>{enrollment.userEmail}</td>
                        <td>
                          <span className="course-tag">
                            {enrollment.courseTitle}
                          </span>
                        </td>
                        <td>
                          <span className="date-tag">
                            {getTimeAgo(enrollment.enrolledAt)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashbord;