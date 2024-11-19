import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./PaymentResult.css"; // Import the CSS file

const PaymentReturn = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const navigate = useNavigate(); // go to next page

  const status = query.get("status");
  const orderInfo = query.get("orderInfo");
  const totalPrice = query.get("totalPrice");
  const paymentTime = query.get("paymentTime");
  const transactionId = query.get("transactionId");

  useEffect(() => {
    if (status) {
      console.log("Payment Status:", status);
      console.log("Order Info:", orderInfo);
      console.log("Total Price:", totalPrice);
      console.log("Payment Time:", paymentTime);
      console.log("Transaction ID:", transactionId);

      // if (status === "1") {
      //   toast.success("Payment successful");
      // } else {
      //   toast.error("Payment failed");
      // }
    }
    // setTimeout(() => {
    //   navigate(`/Booking`);
    // }, 5000);
  }, [status, orderInfo, totalPrice, paymentTime, transactionId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${day}/${month}/${year}`;
  };

  const handleClickHome = () => {
    navigate(`/`);
  };
  const handleClickTheOrder = () => {
    navigate(`/Booking`);
  };

  return (
    <div className="paymentResult__root">
      <div className="payment-result-container">
        {status === "1" ? (
          <div className="success-message">
            <div className="success-message-a">
              <i className="fa-regular fa-circle-check"></i>
              Payment Successful
            </div>
            <div>
              <p>
                Thank you for booking our tour - Journey Joy wishes you a happy
                trip <i class="fa-regular fa-face-smile-wink"></i>
              </p>
            </div>
            <div className="twobtn">
              <div className="twobtn--a">
                <button onClick={handleClickHome}>Home</button>
              </div>
              <div className="twobtn--a">
                <button onClick={handleClickTheOrder}>Views Order</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="error-message">
            <div className="error-message-a">
              <i class="fa-regular fa-circle-xmark"></i>
              Payment Fail
            </div>
            <div>
              <p>
                Payment failed - Journey Joy is very sorry for the inconvenience{" "}
                <i class="fa-regular fa-face-frown"></i>
              </p>
            </div>
            <div className="">
              <div className="">
                <button onClick={handleClickHome}>Home</button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default PaymentReturn;
