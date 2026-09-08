import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
import Footer from "./components/footer/Footer";
import About from "./pages/about/About";
import Account from "./pages/account/Account";
import { UserData } from "./context/UserContext";
import Loading from "./components/loading/Loading";
import Courses from "./pages/courses/Courses";
import CourseDescription from "./pages/coursedescription/CourseDescription";
import PaymentSuccess from "./pages/paymentsuccess/PaymentSuccess";
import Dashbord from "./pages/dashbord/Dashbord";
import CourseStudy from "./pages/coursestudy/CourseStudy";
import Lecture from "./pages/lecture/Lecture";
import AdminDashbord from "./admin/Dashboard/AdminDashbord";
import AdminCourses from "./admin/Courses/AdminCourses";
import AdminUsers from "./admin/Users/AdminUsers";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import PaymentPending from "./pages/paymentpending/PaymentPending";
import Payments from "./admin/Payments/Payments";
import EditCourse from "./admin/Courses/EditCourse";

const App = () => {
  // ✅ ALL HOOKS at the top - consistent order
  const [forceShow, setForceShow] = useState(false);
  const { isAuth, user, loading } = UserData();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceShow(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading && !forceShow) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Header isAuth={isAuth} />  {/* ✅ FIXED: Added isAuth prop */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/account" element={isAuth ? <Account user={user} /> : <Login />} />
        <Route path="/login" element={isAuth ? <Home /> : <Login />} />
        <Route path="/register" element={isAuth ? <Home /> : <Register />} />
        <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
        <Route path="/forgot" element={isAuth ? <Home /> : <ForgotPassword />} />
        <Route path="/reset-password/:token" element={isAuth ? <Home /> : <ResetPassword />} />
        <Route path="/course/:id" element={isAuth ? <CourseDescription user={user} /> : <Login />} />
        <Route path="/payment-success/:id" element={isAuth ? <PaymentSuccess user={user} /> : <Login />} />
        <Route path="/:id/dashboard" element={isAuth ? <Dashbord user={user} /> : <Login />} />
        <Route path="/course/study/:id" element={isAuth ? <CourseStudy user={user} /> : <Login />} />
        <Route path="/lectures/:id" element={isAuth ? <Lecture user={user} /> : <Login />} />
        <Route path="/admin/dashboard" element={isAuth ? <AdminDashbord user={user} /> : <Login />} />
        <Route path="/admin/course" element={isAuth ? <AdminCourses user={user} /> : <Login />} />
        <Route path="/admin/users" element={isAuth ? <AdminUsers user={user} /> : <Login />} />
        <Route path="/payment-pending/:id" element={isAuth ? <PaymentPending user={user} /> : <Login />} />
        <Route path="/admin/payments" element={isAuth ? <Payments user={user} /> : <Login />} />
        <Route path="/admin/course/edit/:id" element={isAuth ? <EditCourse user={user} /> : <Login />}
/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;