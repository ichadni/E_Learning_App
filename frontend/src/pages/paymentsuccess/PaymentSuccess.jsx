import React from "react";
import "./paymentsuccess.css";
import { Link, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = ({ user }) => {
  const params = useParams();

  return (
    <div className="payment-success-page">
      {user && (
        <div className="success-message">
          {/* Success Icon */}
          <div className="success-icon">
            <FaCheckCircle />
          </div>

          <h2>Payment <span>Successful!</span></h2>
          <p className="subtitle">Your course subscription has been activated</p>

          <div className="reference">
            Reference no: <strong>{params.id}</strong>
          </div>

          <Link to={`/${user._id}/dashboard`} className="common-btn">
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;