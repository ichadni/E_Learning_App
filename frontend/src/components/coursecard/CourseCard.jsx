import React from "react";
import "./courseCard.css";
import { server } from "../../main";
import { UserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { CourseData } from "../../context/CourseContext";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();
  const { fetchCourses } = CourseData();

  // Check if user is enrolled
  const isEnrolled = user?.subscription?.includes(course._id);

  return (
    <div className="course-card">
      {/* Image */}
      <img 
        src={course.image ? `${server}/${course.image}` : "https://via.placeholder.com/300x200/6a1b9a/ffffff?text=Course"} 
        alt={course.title} 
        className="course-image" 
      />

      {/* Badge (Optional) */}
      {course.isPopular && <span className="course-badge popular">🔥 Popular</span>}
      {course.isNew && <span className="course-badge new">✨ New</span>}
      {course.isFeatured && <span className="course-badge featured">⭐ Featured</span>}

      {/* Content */}
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>

        <div className="course-meta">
          <div className="meta-item">
            <span className="icon">👨‍🏫</span>
            <span className="label">Instructor:</span>
            <span className="value">{course.createdBy || "Unknown"}</span>
          </div>
          <div className="meta-item">
            <span className="icon">⏱️</span>
            <span className="label">Duration:</span>
            <span className="value">{course.duration || 0} weeks</span>
          </div>
          <div className="meta-item">
            <span className="icon">📚</span>
            <span className="label">Category:</span>
            <span className="value">{course.category || "General"}</span>
          </div>
        </div>

        {/* Price */}
        <div className="course-price">
          <span className="current">₹{course.price}</span>
          {course.originalPrice && (
            <span className="original">₹{course.originalPrice}</span>
          )}
          {course.discount && (
            <span className="discount">{course.discount}% OFF</span>
          )}
        </div>

        {/* Buttons */}
        <div className="btn-group">
          {isAuth ? (
            <>
              {/* ✅ Admin & Superadmin - Show "Review" button → Goes to Course Study */}
              {user && (user.role === "admin" || user.role === "superadmin") ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="common-btn review"
                >
                  📝 Review
                </button>
              ) : (
                <>
                  {/* ✅ Student - Show "Study" if enrolled, else "Get Started" */}
                  {isEnrolled ? (
                    <button
                      onClick={() => navigate(`/course/study/${course._id}`)}
                      className="common-btn study"
                    >
                      📖 Study
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/course/${course._id}`)}
                      className="common-btn primary"
                    >
                      🚀 Get Started
                    </button>
                  )}
                </>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="common-btn primary"
            >
              🚀 Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;