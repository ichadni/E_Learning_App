import React, { useState, useEffect } from "react";
import Layout from "../Utils/Layout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import toast from "react-hot-toast";
import "./editcourse.css";

const categories = [
  "Web Development",
  "App Development",
  "Game Development",
  "Data Science",
  "Artificial Intelligence",
];

const EditCourse = ({ user }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  if (user && user.role !== "admin" && user.role !== "superadmin") {
    navigate("/");
  }

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePrev, setImagePrev] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`${server}/api/course/${id}`);
        const courseData = data.course;
        setCourse(courseData);
        setTitle(courseData.title);
        setDescription(courseData.description);
        setCategory(courseData.category);
        setPrice(courseData.price);
        setCreatedBy(courseData.createdBy);
        setDuration(courseData.duration);
        setImagePrev(courseData.image ? `${server}/${courseData.image}` : "");
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
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
    if (image) {
      myForm.append("file", image);
    }

    try {
      const { data } = await axios.put(
        `${server}/api/course/${id}`,
        myForm,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      setBtnLoading(false);
      navigate("/admin/course");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update course");
      setBtnLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="edit-course">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading course details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="edit-course">
        <h2>
          Edit Course
          <span className="course-id">ID: {id}</span>
        </h2>

        <form onSubmit={submitHandler} className="edit-form">
          <label>
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter course title"
            required
          />

          <label>
            Description <span className="required">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter course description"
            required
          />

          <label>
            Price (BDT) <span className="required">*</span>
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter course price"
            required
          />

          <label>
            Created By <span className="required">*</span>
          </label>
          <input
            type="text"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            placeholder="Enter instructor name"
            required
          />

          <label>
            Category <span className="required">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((e) => (
              <option value={e} key={e}>{e}</option>
            ))}
          </select>

          <label>
            Duration (weeks) <span className="required">*</span>
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter course duration"
            required
          />

          <label>Course Image</label>
          <input type="file" onChange={changeImageHandler} />
          
          {imagePrev && (
            <>
              <span className="current-image-label">
                <span className="dot"></span> Current Image
              </span>
              <div className="image-preview">
                <img src={imagePrev} alt="Course" />
              </div>
            </>
          )}

          <button type="submit" disabled={btnLoading} className="common-btn">
            {btnLoading ? (
              <>
                <span className="spinner"></span> Updating...
              </>
            ) : (
              '✅ Update Course'
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditCourse;