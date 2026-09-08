import React, { useState } from "react";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import "./admincourses.css";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";

const categories = [
  "Web Development",
  "App Development",
  "Game Development",
  "Data Science",
  "Artificial Intelligence",
];

const AdminCourses = ({ user }) => {
  const navigate = useNavigate();

  // ✅ Allow both admin AND superadmin
  if (user && user.role !== "admin" && user.role !== "superadmin") return navigate("/");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const { courses, fetchCourses } = CourseData();

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  // ✅ Edit Course Function
  const editCourse = (courseId) => {
    navigate(`/admin/course/edit/${courseId}`);
  };

  // ✅ Delete Course Function
  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const { data } = await axios.delete(`${server}/api/course/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      await fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete course");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const myForm = new FormData();

    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("category", category);
    myForm.append("price", price);
    myForm.append("createdBy", createdBy);
    myForm.append("duration", duration);
    myForm.append("file", image);

    try {
      const { data } = await axios.post(`${server}/api/course/new`, myForm, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      setBtnLoading(false);
      await fetchCourses();
      
      // ✅ ADD NOTIFICATIONS
      try {
        const token = localStorage.getItem("token");
        
        // Notify all users about new course
        await axios.post(
          `${server}/api/notifications/create`,
          {
            title: "📚 New Course Available!",
            message: `New course "${title}" has been added. Enroll now!`,
            type: "info",
            link: "/courses",
          },
          {
            headers: { token },
          }
        );
        
        // Notify superadmin
        await axios.post(
          `${server}/api/notifications/create`,
          {
            title: "📚 Course Added",
            message: `New course "${title}" added to the platform by ${user.name}`,
            type: "info",
            link: "/admin/dashboard",
          },
          {
            headers: { token },
          }
        );
        
        console.log("✅ Notifications sent for new course");
      } catch (notifError) {
        console.log("❌ Notification error:", notifError);
      }

      // Reset form fields
      setImage("");
      setTitle("");
      setDescription("");
      setDuration("");
      setImagePrev("");
      setCreatedBy("");
      setPrice("");
      setCategory("");
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add course");
      setBtnLoading(false);
    }
  };

  return (
    <Layout>
      <div className="admin-courses">
        <div className="left">
          <h1>All Courses</h1>
          <div className="dashboard-content">
            {courses && courses.length > 0 ? (
              courses.map((e) => (
                <div key={e._id} className="course-item">
                  <CourseCard course={e} />
                  {/* ✅ Edit & Delete Buttons */}
                  <div className="course-actions">
                    <button 
                      onClick={() => editCourse(e._id)} 
                      className="edit-btn"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => deleteHandler(e._id)} 
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No Courses Yet</p>
            )}
          </div>
        </div>

        <div className="right">
          <div className="add-course">
            <div className="course-form">
              <h2>Add Course</h2>
              <form onSubmit={submitHandler}>
                <label htmlFor="text">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <label htmlFor="text">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />

                <label htmlFor="text">Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />

                <label htmlFor="text">createdBy</label>
                <input
                  type="text"
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                  required
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value={""}>Select Category</option>
                  {categories.map((e) => (
                    <option value={e} key={e}>
                      {e}
                    </option>
                  ))}
                </select>

                <label htmlFor="text">Duration</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />

                <input type="file" required onChange={changeImageHandler} />
                {imagePrev && <img src={imagePrev} alt="" width={300} />}

                <button
                  type="submit"
                  disabled={btnLoading}
                  className="common-btn"
                >
                  {btnLoading ? "Please Wait..." : "Add"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCourses;