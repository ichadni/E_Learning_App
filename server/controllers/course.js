import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";
import crypto from "crypto";
import { Payment } from "../models/Payment.js";
import { Progress } from "../models/Progress.js";
import { Notification } from "../models/Notification.js";
import { Enrollment } from "../models/Enrollment.js";

import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";


// =====================================================
// CLOUDINARY UPLOAD HELPER
// =====================================================

const uploadToCloudinary = (file, folder, resourceType) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error("No file received"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier
      .createReadStream(file.buffer)
      .pipe(uploadStream);
  });
};


// =====================================================
// GET ALL COURSES
// =====================================================

export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();

  res.json({
    courses,
  });
});


// =====================================================
// GET SINGLE COURSE
// =====================================================

export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  res.json({
    course,
  });
});


// =====================================================
// FETCH LECTURES
// =====================================================

export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });

  const user = await User.findById(req.user._id);

  if (user.role === "admin" || user.role === "superadmin") {
    return res.json({ lectures });
  }

  if (!user.subscription.includes(req.params.id)) {
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });
  }

  res.json({ lectures });
});


// =====================================================
// FETCH SINGLE LECTURE
// =====================================================

export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  const user = await User.findById(req.user._id);

  if (user.role === "admin" || user.role === "superadmin") {
    return res.json({ lecture });
  }

  if (!user.subscription.includes(lecture.course)) {
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });
  }

  res.json({ lecture });
});


// =====================================================
// GET MY COURSES
// =====================================================

export const getMyCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find({
    _id: req.user.subscription,
  });

  res.json({
    courses,
  });
});


// =====================================================
// CHECKOUT
// =====================================================

export const checkout = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const course = await Courses.findById(req.params.id);

  if (user.subscription.includes(course._id)) {
    return res.status(400).json({
      message: "You already have this course",
    });
  }

  const options = {
    amount: Number(course.price * 100),
    currency: "INR",
  };

  const order = await instance.orders.create(options);

  res.status(201).json({
    order,
    course,
  });
});


// =====================================================
// PAYMENT VERIFICATION
// =====================================================

export const paymentVerification = TryCatch(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const body =
    razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac(
      "sha256",
      process.env.Razorpay_Secret
    )
    .update(body)
    .digest("hex");

  const isAuthentic =
    expectedSignature === razorpay_signature;

  if (isAuthentic) {
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    const user = await User.findById(req.user._id);
    const course = await Courses.findById(req.params.id);

    user.subscription.push(course._id);

    await Progress.create({
      course: course._id,
      completedLectures: [],
      user: req.user._id,
    });

    await user.save();

    res.status(200).json({
      message: "Course Purchased Successfully",
    });
  } else {
    return res.status(400).json({
      message: "Payment Failed",
    });
  }
});


// =====================================================
// ADD PROGRESS WITH NOTIFICATIONS
// =====================================================

export const addProgress = TryCatch(async (req, res) => {
  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.query.course,
  });

  const { lectureId } = req.query;

  if (progress.completedLectures.includes(lectureId)) {
    return res.json({
      message: "Progress recorded",
    });
  }

  progress.completedLectures.push(lectureId);

  await progress.save();

  // Lecture Completed Notification
  const lecture = await Lecture.findById(lectureId);

  if (lecture) {
    await Notification.create({
      user: req.user._id,
      title: "✅ Lecture Completed!",
      message: `You completed "${lecture.title}"`,
      type: "success",
      link: `/lectures/${req.query.course}`,
    });
  }

  // Check if Course Completed
  const allLectures = await Lecture.find({
    course: req.query.course,
  });

  const completedCount =
    progress.completedLectures.length;

  if (
    completedCount === allLectures.length &&
    allLectures.length > 0
  ) {
    const course = await Courses.findById(
      req.query.course
    );

    // To USER: Course Completed
    await Notification.create({
      user: req.user._id,
      title: "🏆 Course Completed!",
      message: `Congratulations! You completed "${course.title}"!`,
      type: "success",
      link: `/certificate/${req.query.course}`,
    });

    // To All ADMINS: Course Completed
    const admins = await User.find({
      role: "admin",
    });

    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        title: "🎓 Course Completed",
        message: `${req.user.name} completed "${course.title}"`,
        type: "info",
        link: "/admin/dashboard",
      });
    }

    // To All SUPERADMINS: Course Completed
    const superadmins = await User.find({
      role: "superadmin",
    });

    for (const superadmin of superadmins) {
      await Notification.create({
        user: superadmin._id,
        title: "🎓 Course Completed",
        message: `${req.user.name} completed "${course.title}"`,
        type: "info",
        link: "/admin/dashboard",
      });
    }
  }

  res.status(201).json({
    message: "new Progress added",
  });
});


// =====================================================
// GET YOUR PROGRESS
// =====================================================

export const getYourProgress = TryCatch(async (req, res) => {
  const progress = await Progress.find({
    user: req.user._id,
    course: req.query.course,
  });

  if (!progress) {
    return res.status(404).json({
      message: "null",
    });
  }

  const allLectures = (
    await Lecture.find({
      course: req.query.course,
    })
  ).length;

  const completedLectures =
    progress[0].completedLectures.length;

  const courseProgressPercentage =
    (completedLectures * 100) / allLectures;

  res.json({
    courseProgressPercentage,
    completedLectures,
    allLectures,
    progress,
  });
});


// =====================================================
// CREATE COURSE WITH NOTIFICATIONS
// =====================================================

export const createCourse = TryCatch(async (req, res) => {
  const {
    title,
    description,
    category,
    createdBy,
    duration,
    price,
  } = req.body;

  const image = req.file;

  // ================================
  // UPLOAD IMAGE TO CLOUDINARY
  // ================================

  let imageUrl = "";

  if (image) {
    const result = await uploadToCloudinary(
      image,
      "e-learning/courses",
      "image"
    );

    imageUrl = result.secure_url;
  }

  const course = await Courses.create({
    title,
    description,
    category,
    createdBy,
    image: imageUrl,
    duration,
    price,
  });

  // To All USERS: New Course Available
  const allUsers = await User.find({
    role: "user",
  });

  for (const user of allUsers) {
    await Notification.create({
      user: user._id,
      title: "📚 New Course Available!",
      message: `New course "${title}" has been added. Enroll now!`,
      type: "info",
      link: "/courses",
    });
  }

  // To All ADMINS: Course Added
  const admins = await User.find({
    role: "admin",
  });

  for (const admin of admins) {
    await Notification.create({
      user: admin._id,
      title: "📚 Course Added",
      message: `New course "${title}" added by ${req.user.name}`,
      type: "info",
      link: "/admin/dashboard",
    });
  }

  // To All SUPERADMINS: Course Added
  const superadmins = await User.find({
    role: "superadmin",
  });

  for (const superadmin of superadmins) {
    await Notification.create({
      user: superadmin._id,
      title: "📚 Course Added",
      message: `New course "${title}" added by ${req.user.name}`,
      type: "info",
      link: "/admin/dashboard",
    });
  }

  res.status(201).json({
    message: "Course Created Successfully",
  });
});


// =====================================================
// ADD LECTURES WITH NOTIFICATIONS
// =====================================================

export const addLectures = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      message: "No Course with this id",
    });
  }

  const {
    title,
    description,
  } = req.body;

  const file = req.file;

  // ================================
  // UPLOAD VIDEO TO CLOUDINARY
  // ================================

  let videoUrl = "";

  if (file) {
    const result = await uploadToCloudinary(
      file,
      "e-learning/lectures",
      "video"
    );

    videoUrl = result.secure_url;
  }

  const lecture = await Lecture.create({
    title,
    description,
    video: videoUrl,
    course: course._id,
  });

  // To All Enrolled Users: New Lecture Added
  const enrolledUsers = await User.find({
    subscription: course._id,
  });

  for (const user of enrolledUsers) {
    await Notification.create({
      user: user._id,
      title: "📹 New Lecture Added!",
      message: `New lecture "${title}" added to "${course.title}"`,
      type: "info",
      link: `/lectures/${course._id}`,
    });
  }

  // To All ADMINS: Lecture Added
  const admins = await User.find({
    role: "admin",
  });

  for (const admin of admins) {
    await Notification.create({
      user: admin._id,
      title: "📹 Lecture Added",
      message: `New lecture "${title}" added to "${course.title}"`,
      type: "info",
      link: `/admin/course`,
    });
  }

  // To All SUPERADMINS: Lecture Added
  const superadmins = await User.find({
    role: "superadmin",
  });

  for (const superadmin of superadmins) {
    await Notification.create({
      user: superadmin._id,
      title: "📹 Lecture Added",
      message: `New lecture "${title}" added to "${course.title}"`,
      type: "info",
      link: `/admin/course`,
    });
  }

  res.status(201).json({
    message: "Lecture Added",
    lecture,
  });
});


// =====================================================
// DELETE LECTURE
// =====================================================

export const deleteLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  if (!lecture) {
    return res.status(404).json({
      message: "Lecture not found",
    });
  }

  /*
    OLD:
    rm(lecture.video)

    That was used for local uploads.
    Cloudinary files cannot be removed with rm().
  */

  await lecture.deleteOne();

  res.json({
    message: "Lecture Deleted",
  });
});


// =====================================================
// DELETE COURSE
// =====================================================

export const deleteCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      message: "Course not found",
    });
  }

  const lectures = await Lecture.find({
    course: course._id,
  });

  /*
    OLD local-file deletion removed here.

    Cloudinary URLs cannot be deleted using
    fs.unlink() or rm().
  */

  await Lecture.find({
    course: req.params.id,
  }).deleteMany();

  await course.deleteOne();

  await User.updateMany(
    {},
    {
      $pull: {
        subscription: req.params.id,
      },
    }
  );

  res.json({
    message: "Course Deleted",
  });
});


// =====================================================
// UPDATE COURSE
// =====================================================

export const updateCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      message: "Course not found",
    });
  }

  const {
    title,
    description,
    category,
    createdBy,
    duration,
    price,
  } = req.body;

  if (title) course.title = title;

  if (description) {
    course.description = description;
  }

  if (category) {
    course.category = category;
  }

  if (createdBy) {
    course.createdBy = createdBy;
  }

  if (duration) {
    course.duration = duration;
  }

  if (price) {
    course.price = price;
  }

  // ================================
  // UPDATE IMAGE ON CLOUDINARY
  // ================================

  if (req.file) {
    const result = await uploadToCloudinary(
      req.file,
      "e-learning/courses",
      "image"
    );

    course.image = result.secure_url;
  }

  await course.save();

  res.status(200).json({
    message: "Course updated successfully",
    course,
  });
});