import React, { useState, useEffect } from "react";
import "./Booking.css";
import Header from "../header/header";
import Footer from "../footer/footer";
import { URL_SERVER } from "../../server";
import "react-toastify/dist/ReactToastify.css";
import { notifySuccess, notifyError } from "../../notify/Notify";
import { ToastContainer } from "react-toastify";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const url = URL_SERVER;
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //--------------------List Booking-------------------------
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/user/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      const sortedBookings = data.sort(
        (a, b) => new Date(b.booking_at) - new Date(a.booking_at)
      );
      setBookings(sortedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatPrice = (price) => {
    if (price == null || isNaN(price)) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 0:
        return { color: "yellow" };
      case 1:
        return { color: " #00fbff" };
      case 2:
        return { color: "orange" };
      case 3:
        return { color: "rgb(156, 249, 16)" };
      case 4:
        return { color: "red" };
      default:
        return {};
    }
  };

  const renderStatusText = (status) => {
    switch (status) {
      case 0:
        return "Wait for payment";
      case 1:
        return "Paid";
      case 2:
        return "Processing";
      case 3:
        return "Accomplished";
      case 4:
        return "Cancelled";
      default:
        return "Unknown status";
    }
  };

  const handleRowClick = (booking) => {
    setSelectedBooking(booking);
  };

  const closeDetails = () => {
    setSelectedBooking(null);
  };

  // ----------------------CANCEL tour------------------------------------
  const cancelTour = async () => {
    if (!selectedBooking) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/cancel/${selectedBooking.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }
      await response.json();
      notifySuccess("Tour cancelled successfully!");
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling tour:", error);
      notifyError("Failed to cancel the tour.");
    }
  };

  const handleFeedback = () => {
    if (selectedBooking) {
      navigate(`/tour/${selectedBooking.tour_id}`, {
        state: { trang_thai_feedback: selectedBooking.trang_thai },
      });
    }
  };

  return (
    <div>
      <Header />
      <div id="ticket__root">
        <div className="ticket__body">
          <h1>Your Bookings</h1>
          {loading ? (
            <div className="loading-spinner">
              <Oval
                height={80}
                width={80}
                color="#4fa94d"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#4fa94d"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </div>
          ) : (
            <div className="ticket__cards">
              {bookings.length === 0 ? (
                <div style={{ paddingLeft: "43%", paddingTop: "30%" }}>
                  <p>No bookings available</p>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div
                    className="ticket__card"
                    key={booking.id}
                    style={{
                      backgroundImage: `url(${
                        booking.tourImage
                          ? `${url}/public/img/${booking.tourImage}`
                          : `${url}/public/img/tour3.jpg`
                      })`,
                    }}
                    onClick={() => handleRowClick(booking)}
                  >
                    <div className="ticket__card-content">
                      <h2>{booking.ten_tour}</h2>
                      <p>
                        <strong>Date Book:</strong>{" "}
                        {formatDate(booking.booking_at)}
                      </p>
                      <p
                        className="statusne"
                        style={getStatusStyle(booking.trang_thai)}
                      >
                        <strong>Status:</strong>{" "}
                        {renderStatusText(booking.trang_thai)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {selectedBooking && (
            <div className="booking-details-popup">
              <div className="booking-details">
                <div onClick={closeDetails} className="dt_close">
                  <i className="fa-solid fa-x"></i>
                </div>
                <h2>Booking Details</h2>
                <p>
                  <strong>Name:</strong> {selectedBooking.ten_tour}
                </p>
                <p>
                  <strong>Date Book:</strong>{" "}
                  {formatDate(selectedBooking.booking_at)}
                </p>
                <p>
                  <strong>Date Start:</strong>{" "}
                  {formatDate(selectedBooking.ngay_khoi_hanh)}
                </p>
                <p>
                  <strong>Number of People:</strong>{" "}
                  {selectedBooking.so_luong_nguoi}
                </p>
                <p>
                  <strong>Total Price:</strong>{" "}
                  {formatPrice(selectedBooking.tong_tien)}
                </p>
                <p className="status">
                  <strong>Status:</strong>{" "}
                  {renderStatusText(selectedBooking.trang_thai)}
                </p>
                <div className="booking-details-btn">
                  {selectedBooking.trang_thai === 0 ? (
                    <>
                      <button onClick={closeDetails}>Close</button>
                      <button onClick={cancelTour}>Cancel Tour</button>
                    </>
                  ) : selectedBooking.trang_thai === 3 ? (
                    <>
                      <button onClick={closeDetails}>Close</button>
                      <button onClick={handleFeedback}>Feedback</button>
                    </>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <button onClick={closeDetails}>Close</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default Booking;
