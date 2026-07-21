import React from "react";
import { Link, useParams } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import "./paymentpending.css";

const PaymentPending = ({ user }) => {
  const params = useParams();

  return (
    <div className="payment-pending-page">
      <div className="pending-message">
        <FaClock className="pending-icon" />
        <h2>Payment Submitted!</h2>
        <p>Your payment is waiting for admin verification.</p>
        <p className="reference">Reference: {params.id}</p>
        <p className="note">
          ⏳ Please wait while the admin verifies your payment.
          <br />
          You will be enrolled once verified.
        </p>
        {user && (
          <Link to={`/${user._id}/dashboard`} className="common-btn">
            Go to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
};

export default PaymentPending;