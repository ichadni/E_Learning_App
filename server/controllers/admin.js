import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { rm } from "fs";
import { promisify } from "util";
import fs from "fs";
import { User } from "../models/User.js";
import { Enrollment } from "../models/Enrollment.js";
import { Notification } from "../models/Notification.js"; // ✅ ADDED
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = (file, folder, resourceType) => {
  return new Promise((resolve, reject) => {
    if (!file?.buffer) {
      return reject(new Error("No file received"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => (error ? reject(error) : resolve(result))
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

export const createCourse = TryCatch(async (req, res) => {
  const { title, description, category, createdBy, duration, price } = req.body;

  const image = req.file;
  const result = await uploadToCloudinary(image, "e-learning/courses", "image");

  await Courses.create({
    title,
    description,
    category,
    createdBy,
    image: result.secure_url,
    duration,
    price,
  });

  res.status(201).json({
    message: "Course Created Successfully",
  });
});

export const addLectures = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course)
    return res.status(404).json({
      message: "No Course with this id",
    });

  const { title, description } = req.body;

  const file = req.file;
  const result = await uploadToCloudinary(file, "e-learning/lectures", "video");

  const lecture = await Lecture.create({
    title,
    description,
    video: result.secure_url,
    course: course._id,
  });

  res.status(201).json({
    message: "Lecture Added",
    lecture,
  });
});

export const deleteLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  await lecture.deleteOne();

  res.json({ message: "Lecture Deleted" });
});

const unlinkAsync = promisify(fs.unlink);

export const deleteCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  const lectures = await Lecture.find({ course: course._id });

  await Promise.all(
    lectures.map(async (lecture) => {
      if (!lecture.video?.startsWith("http")) {
        await unlinkAsync(lecture.video);
      }
    })
  );

  if (!course.image?.startsWith("http")) {
    rm(course.image, () => {});
  }

  await Lecture.find({ course: req.params.id }).deleteMany();

  await course.deleteOne();

  await User.updateMany({}, { $pull: { subscription: req.params.id } });

  res.json({
    message: "Course Deleted",
  });
});

export const getAllStats = TryCatch(async (req, res) => {
  try {
    const totalCourses = await Courses.countDocuments();
    const totalLectures = await Lecture.countDocuments();
    const totalUsers = await User.countDocuments();
    
    const totalEnrollments = await Enrollment.countDocuments();

    const topCourses = await Enrollment.aggregate([
      { $group: { _id: "$course", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" } },
      { $unwind: "$course" },
      { $project: { title: "$course.title", count: 1 } }
    ]);

    const recentEnrollments = await Enrollment.aggregate([
      { $sort: { enrolledAt: -1 } },
      { $limit: 10 },
      { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $lookup: { from: "courses", localField: "course", foreignField: "_id", as: "course" } },
      { $unwind: "$course" },
      { 
        $project: { 
          userName: "$user.name",
          userEmail: "$user.email",
          courseTitle: "$course.title",
          courseId: "$course._id",
          enrolledAt: "$enrolledAt"
        } 
      }
    ]);

    const stats = {
      totalCourses,
      totalLectures,
      totalUsers,
      totalEnrollments,
      topCourses: topCourses || [],
      recentEnrollments: recentEnrollments || [],
    };

    console.log("📊 Stats calculated:", stats);

    res.json({
      stats,
    });
  } catch (error) {
    console.error("❌ Error calculating stats:", error);
    res.status(500).json({ message: error.message });
  }
});

export const getAllUser = TryCatch(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select(
    "-password"
  );

  res.json({ users });
});

// ✅ UPDATED: Update Role with Notifications
export const updateRole = TryCatch(async (req, res) => {
  if (req.user.mainrole !== "superadmin")
    return res.status(403).json({
      message: "This endpoint is assign to superadmin",
    });
  
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  let newRole = "";
  if (user.role === "user") {
    user.role = "admin";
    newRole = "admin";
    await user.save();
  } else if (user.role === "admin") {
    user.role = "user";
    newRole = "user";
    await user.save();
  } else {
    return res.status(400).json({
      message: "Invalid role",
    });
  }

  // ✅ To USER: Role Updated (Only User)
  await Notification.create({
    user: user._id,
    title: "🔄 Role Updated",
    message: `Your role has been updated to "${newRole}"`,
    type: "info",
    link: "/account",
  });

  // ✅ To All SUPERADMINS: Role Updated
  const superadmins = await User.find({ role: "superadmin" });
  for (const superadmin of superadmins) {
    await Notification.create({
      user: superadmin._id,
      title: "🔄 Role Updated",
      message: `${user.name} role updated to "${newRole}"`,
      type: "info",
      link: "/admin/users",
    });
  }

  // ❌ ADMINS DO NOT GET Role Updated notifications

  return res.status(200).json({
    message: `Role updated to ${newRole}`,
  });
});