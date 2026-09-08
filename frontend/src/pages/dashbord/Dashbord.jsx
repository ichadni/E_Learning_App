import React from "react";
import "./dashbord.css";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import { useNavigate } from "react-router-dom";

const Dashbord = () => {
  const { mycourse } = CourseData();
  const navigate = useNavigate();

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div>
          <h2>My Enrolled Courses</h2>
          <p className="subtitle">Continue your learning journey</p>
        </div>
        <div className="course-count">
          📚 <span className="number">{mycourse?.length || 0}</span> Courses
        </div>
      </div>

      <div className="dashboard-content">
        {mycourse && mycourse.length > 0 ? (
          mycourse.map((e) => <CourseCard key={e._id} course={e} />)
        ) : (
          <div className="empty-state">
            <span className="icon">📚</span>
            <h3>No Courses Enrolled Yet</h3>
            <p>Start your learning journey by enrolling in a course today!</p>
            <button 
              className="browse-btn"
              onClick={() => navigate("/courses")}
            >
              Browse Courses →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashbord;