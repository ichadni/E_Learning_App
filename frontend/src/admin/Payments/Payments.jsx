import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Layout from "../Utils/Layout";
import toast from "react-hot-toast";
import "./payments.css";

const Payments = ({ user }) => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Check admin access
  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "superadmin") {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${server}/api/payment/pending`, {
        headers: { token },
      });
      setPayments(data.payments);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentId) => {
    if (!window.confirm("Verify this payment and enroll the user?")) return;

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${server}/api/payment/verify/${paymentId}`,
        {},
        {
          headers: { token },
        }
      );

      toast.success(data.message);

      // ✅ Send notification to user
      try {
        const payment = payments.find(p => p._id === paymentId);
        
        if (payment && payment.user) {
          await axios.post(
            `${server}/api/notifications/create`,
            {
              title: "✅ Payment Verified!",
              message: `Your payment for "${payment.course?.title}" has been verified! You can now start learning.`,
              type: "success",
              link: `/course/study/${payment.course?._id}`,
            },
            {
              headers: { token },
            }
          );
          console.log("✅ Notification sent to user:", payment.user?.name);
        }
      } catch (notifError) {
        console.log("❌ Notification error:", notifError);
      }

      fetchPayments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="payments-page">
          <h1>Pending Payments</h1>
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="payments-page">
        <h1>Pending Payments</h1>
        <p className="subtitle">Verify bKash payments to enroll users</p>

        {payments.length === 0 ? (
          <div className="empty-state">
            <p>No pending payments</p>
          </div>
        ) : (
          <table className="payments-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Sender Number</th>
                <th>Transaction ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={payment._id}>
                  <td>{index + 1}</td>
                  <td>{payment.user?.name}</td>
                  <td>{payment.course?.title}</td>
                  <td>৳{payment.amount}</td>
                  <td>{payment.bkash?.senderNumber}</td>
                  <td className="trx-id">{payment.transactionId}</td>
                  <td>
                    <button
                      onClick={() => verifyPayment(payment._id)}
                      className="verify-btn"
                    >
                      Verify & Enroll
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default Payments;