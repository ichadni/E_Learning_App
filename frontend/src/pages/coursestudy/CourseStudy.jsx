import React, { useEffect } from "react";
import "./coursestudy.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { assetUrl, server } from "../../main";
import { FaUser, FaClock, FaBookOpen, FaArrowRight } from "react-icons/fa";

const CourseStudy = ({ user }) => {
  const params = useParams();
  const { fetchCourse, course } = CourseData();
  const navigate = useNavigate();

  // ✅ Allow Admin & Superadmin to access ANY course
  useEffect(() => {
    // If user is admin or superadmin, allow access
    if (user && (user.role === "admin" || user.role === "superadmin")) {
      fetchCourse(params.id);
      return;
    }

    // For regular users, check if enrolled
    if (user && !user.subscription?.includes(params.id)) {
      navigate("/");
      return;
    }

    fetchCourse(params.id);
  }, [params.id, user]);

  if (!course) {
    return (
      <div className="course-study-page">
        <div className="image-placeholder">📚</div>
        <h2>Loading Course...</h2>
      </div>
    );
  }

  return (
    <div className="course-study-page">
      {/* Course Image */}
      {course.image ? (
        <img
          src={assetUrl(course.image)}
          alt={course.title}
          className="course-image"
        />
      ) : (
        <div className="image-placeholder">📚</div>
      )}

      {/* Title */}
      <h2>{course.title}</h2>

      {/* Description */}
      <p className="description">{course.description}</p>

      {/* Meta Info */}
      <div className="course-meta">
        <div className="meta-item">
          <span className="icon">👨‍🏫</span>
          <span>Instructor: <strong>{course.createdBy}</strong></span>
        </div>
        <div className="meta-item">
          <span className="icon">⏱️</span>
          <span>Duration: <strong>{course.duration} weeks</strong></span>
        </div>
        <div className="meta-item">
          <span className="icon">📚</span>
          <span>Category: <strong>{course.category || "General"}</strong></span>
        </div>
        <div className="meta-item">
          <span className="icon">💰</span>
          <span>Price: <strong>₹{course.price}</strong></span>
        </div>
      </div>

      {/* Lectures Link */}
      <Link to={`/lectures/${course._id}`} className="lectures-link">
        <FaBookOpen /> View Lectures <FaArrowRight className="arrow" />
      </Link>
    </div>
  );
};

export default CourseStudy;