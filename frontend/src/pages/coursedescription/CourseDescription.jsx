import React, { useEffect, useState } from "react";
import "./coursedescription.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";
import { 
  FaUser, FaClock, FaBook, FaGraduationCap, 
  FaMobileAlt, FaCheckCircle
} from "react-icons/fa";

const CourseDescription = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [bkashLoading, setBkashLoading] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  const { fetchUser } = UserData();
  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();

  useEffect(() => {
    fetchCourse(params.id);
  }, [params.id]);

  // ✅ MOVE isEnrolled HERE - Before the useEffect that uses it
  const isEnrolled = user?.subscription?.includes(course?._id);

  // ✅ Handle enrollment notification - AFTER isEnrolled is declared
  useEffect(() => {
    const sendEnrollmentNotification = async () => {
      if (isEnrolled && user && course) {
        try {
          const token = localStorage.getItem("token");
          
          // Notify admin about enrollment
          await axios.post(
            `${server}/api/notifications/create`,
            {
              title: "📚 New Enrollment!",
              message: `${user.name} has enrolled in "${course.title}"`,
              type: "info",
              link: "/admin/dashboard",
            },
            {
              headers: { token },
            }
          );
          
          // Notify user about enrollment
          await axios.post(
            `${server}/api/notifications/create`,
            {
              title: "📚 Course Enrolled!",
              message: `You have successfully enrolled in "${course.title}"`,
              type: "success",
              link: `/course/study/${course._id}`,
            },
            {
              headers: { token },
            }
          );
          
          console.log("✅ Enrollment notifications sent");
        } catch (notifError) {
          console.log("❌ Notification error:", notifError);
        }
      }
    };
    
    sendEnrollmentNotification();
  }, [isEnrolled, user, course]);

  // ✅ bKash Payment Handler - Submit for Verification
  const handleBkashPayment = async (e) => {
    e.preventDefault();
    setBkashLoading(true);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${server}/api/payment/bkash/submit`,
        {
          courseId: course._id,
          senderNumber: senderNumber,
          transactionId: transactionId,
        },
        {
          headers: { token },
        }
      );

      toast.success(data.message);
      setBkashLoading(false);
      setPaymentSubmitted(true);
      setSenderNumber("");
      setTransactionId("");
      
      // ✅ Send notification to admin about new payment
      try {
        await axios.post(
          `${server}/api/notifications/create`,
          {
            title: "💰 New Payment Pending!",
            message: `${user.name} submitted payment for "${course.title}"`,
            type: "warning",
            link: "/admin/payments",
          },
          {
            headers: { token },
          }
        );
        console.log("✅ Admin notification sent for payment");
      } catch (notifError) {
        console.log("❌ Notification error:", notifError);
      }
      
      // ✅ Redirect to pending page
      navigate(`/payment-pending/${data.paymentId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment submission failed");
      setBkashLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!course) {
    return (
      <div className="course-description">
        <div className="course-body">
          <p style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-description">
      {/* Course Header */}
      <div className="course-header">
        {course.image ? (
          <img
            src={`${server}/${course.image}`}
            alt={course.title}
            className="course-image"
          />
        ) : (
          <div className="image-placeholder">📚</div>
        )}

        <div className="course-info">
          <span className="badge">{course.category || "Course"}</span>
          <h2>{course.title}</h2>

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
        </div>
      </div>

      {/* Course Body */}
      <div className="course-body">
        <h3 className="section-title">About This Course</h3>
        <p className="description">{course.description}</p>

        {/* Course Features */}
        <div className="course-features">
          <div className="feature">
            <span className="icon">🎓</span>
            <span className="text">Expert Instruction</span>
          </div>
          <div className="feature">
            <span className="icon">🎥</span>
            <span className="text">Video Lectures</span>
          </div>
          <div className="feature">
            <span className="icon">📝</span>
            <span className="text">Assignments</span>
          </div>
          <div className="feature">
            <span className="icon">🏆</span>
            <span className="text">Certificate</span>
          </div>
        </div>

        {/* Price Section */}
        <div className="price-section">
          <span className="price">
            <span className="currency">৳</span> {course.price}
          </span>
          {course.originalPrice && (
            <span className="original-price">৳{course.originalPrice}</span>
          )}
          {course.discount && (
            <span className="discount">{course.discount}% OFF</span>
          )}
          <span style={{ marginLeft: 'auto', color: '#888', fontSize: '14px' }}>
            <FaMobileAlt /> bKash Payment
          </span>
        </div>

        {/* ✅ Payment Section */}
        {!isEnrolled ? (
          <div className="payment-section">
            {!paymentSubmitted ? (
              <div className="bkash-payment-container">
                <div className="bkash-info">
                  <div className="bkash-header">
                    <FaMobileAlt className="bkash-icon" />
                    <h4>Pay with bKash</h4>
                  </div>
                  <div className="bkash-instructions">
                    <p>📱 Send <strong>৳{course.price}</strong> to:</p>
                    <div className="bkash-number">01768065743</div>
                    <p className="bkash-note">
                      ⚠️ After sending money, enter your Transaction ID below
                    </p>
                  </div>
                </div>

                <form onSubmit={handleBkashPayment} className="bkash-form">
                  <input
                    type="text"
                    placeholder="Your bKash Number"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Transaction ID (TrxID)"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    required
                  />
                  <button 
                    type="submit" 
                    className="common-btn bkash-submit"
                    disabled={bkashLoading}
                  >
                    {bkashLoading ? "Processing..." : "Submit for Verification"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="payment-pending-message">
                <FaCheckCircle className="pending-icon" />
                <h4>Payment Submitted!</h4>
                <p>⏳ Waiting for admin verification.</p>
                <p className="pending-note">You will be enrolled once verified.</p>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate(`/course/study/${course._id}`)}
            className="common-btn study"
          >
            <FaGraduationCap /> Study Now
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseDescription;