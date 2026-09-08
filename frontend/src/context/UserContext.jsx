import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Login User
  async function loginUser(email, password, navigate, fetchMyCourse) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, {
        email,
        password,
      });

      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      
      if (fetchMyCourse) {
        await fetchMyCourse();
      }

      // ❌ NO WELCOME NOTIFICATION

    } catch (error) {
      setBtnLoading(false);
      setIsAuth(false);
      toast.error(error.response?.data?.message || "Login failed");
    }
  }

  // ✅ Register User
  async function registerUser(name, email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/register`, {
        name,
        email,
        password,
      });

      toast.success(data.message);
      localStorage.setItem("activationToken", data.activationToken);
      setBtnLoading(false);
      navigate("/verify");
    } catch (error) {
      setBtnLoading(false);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  }

  // ✅ Verify OTP
  async function verifyOtp(otp, navigate) {
    setBtnLoading(true);
    const activationToken = localStorage.getItem("activationToken");
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        otp,
        activationToken,
      });

      toast.success(data.message);
      navigate("/login");
      localStorage.clear();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
      setBtnLoading(false);
    }
  }

  // ✅ Fetch User
  async function fetchUser() {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token: token,
        },
      });

      setIsAuth(true);
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      
      if (error.response?.status === 403) {
        localStorage.removeItem("token");
        setIsAuth(false);
      }
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setIsAuth,
        isAuth,
        loginUser,
        btnLoading,
        loading,
        registerUser,
        verifyOtp,
        fetchUser,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);