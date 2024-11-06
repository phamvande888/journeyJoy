import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.css";
import Header from "../../homePage/header/header";
import Footer from "../../homePage/footer/footer";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { URL_SERVER } from "../../server";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  notifySuccess,
  notifyError,
  notifyWarn,
  notifyInfo,
} from "../../notify/Notify";

const Payments = () => {
  const [urlPay, setUrlPay] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null); // New state for payment method
  const url = URL_SERVER;
  const navigate = useNavigate(); // go to next page
  const location = useLocation();
  const bookingData = location.state?.bookingData || {}; // Provide a default empty object

  const [tourDetail, setTourDetail] = useState(null); // tour
  const { id } = useParams(); // id tour

  const [selectedDate, setSelectedDate] = useState(""); // selected date
  const [ho_ten, setHo_ten] = useState(""); // name user
  const [sdt, setSdt] = useState(""); // phone user
  const [numberPeople, setNumberPeople] = useState(
    bookingData.so_luong_nguoi || 1
  ); // number of people
  const [note, setNote] = useState();
  const [showPayNow, setShowPayNow] = useState(false); // State to control visibility of PAY NOW button

  // Call API data Profile
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${url}/account`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return;
      }

      const data = await response.json();
      setHo_ten(data.ho_ten); // set name user
      setSdt(data.sdt); // set phone
    } catch (error) {
      console.error("Error fetching user profile: ", error);
    }
  };

  // useEffect fetch UserProfile
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // API 1 tour
  useEffect(() => {
    const fetchAllTour = async () => {
      try {
        const response = await fetch(`${url}/tour/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTourDetail(data);
      } catch (error) {
        console.error("Error fetching tours:", error);
        alert(`Error fetching tours: ${error.message}`);
      }
    };

    fetchAllTour();
  }, [id, url]);

  // Format the departure date
  const formatDate = (timestamp) => {
    return timestamp
      ? new Date(timestamp).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "";
  };

  // handle number of people change
  const handleNumberPeopleChange = (event) => {
    setNumberPeople(Number(event.target.value));
  };

  // Set payment method
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  // ---------------------- POST Confirm Pay------------------------
  const handleUpdatePay = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${url}/booking/update/${bookingData.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          so_luong_nguoi: numberPeople,
          ghi_chu: note,
          pt_thanh_toan: paymentMethod, // Use payment method state
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        notifyWarn(errorData.message);
        console.error("Error updating payment:", errorData);
        notifyError(errorData);
        return;
      }

      const data = await response.json();
      // notifySuccess("Booking success");
      console.log("sau khi confirm: ", data);

      if (paymentMethod === 1) {
        notifySuccess(data.message);
        setTimeout(() => {
          navigate("/Booking"); // Redirect to /paymentResult if payment method is cash
        }, 2000);
      } else {
        // notifySuccess("Booking success");
        getURL();
        setShowPayNow(true); // Show PAY NOW button on success
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      notifyWarn(`chose Payment method`);
    }
  };

  //DELETE
  const handleCancelPay = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${url}/deleteBooking/${bookingData.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error canceling payment:", errorData);
        notifyError(errorData);
        return;
      }

      const data = await response.json();
      notifySuccess(data.message);
      setTimeout(() => {
        navigate(`/tour/${tourDetail?.tour?.id || ""}`);
      }, 2000);
    } catch (error) {
      console.error("Error canceling payment:", error);
    }
  };

  // calculate total price
  const totalPrice = tourDetail?.tour
    ? (tourDetail.tour.gia_tour * numberPeople).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })
    : "";

  // get URL pay
  const getURL = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${url}/payment/submitOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          bookingId: bookingData.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error get url:", errorData);
        notifyError(errorData);
        return;
      }

      const data = await response.json();
      notifySuccess("Booking success");
      console.log("URL: ", data);
      setUrlPay(data);
      console.log("link: ", urlPay.url);
    } catch (error) {
      console.error("Error updating payment:", error);
      notifyError(`Error updating payment: ${error.message}`);
    }
  };

  return (
    <div>
      <Header />
      <div id="payment__root">
        <div>
          <div className="payment__h1">
            <h1>Confirm booking</h1>
          </div>

          <div className="payment__border">
            <div>
              <div>
                <form>
                  <div>
                    <h5>User Information</h5>
                    <div className="payment__inforUser">
                      <input
                        className="inputall"
                        type="text"
                        name="ho_ten"
                        id="email"
                        placeholder="Username"
                        value={ho_ten}
                        disabled
                      />

                      <input
                        className="inputall"
                        type="text"
                        id="name"
                        name="sdt"
                        placeholder="Phone"
                        value={sdt}
                        disabled
                      />
                    </div>
                  </div>
                  <h5>Detailed tour information</h5>
                  {tourDetail && (
                    <>
                      <div className="payment__nametour">
                        <input
                          className="inputall inputalone"
                          type="text"
                          placeholder="Name tour"
                          value={tourDetail.tour.ten_tour}
                          required
                          disabled
                        />
                      </div>

                      <div>
                        <div className="pm_daystart">
                          <h5>Departure schedule :</h5>
                          <input
                            type="text"
                            value={formatDate(bookingData?.ngay_khoi_hanh)}
                            readOnly
                          />
                        </div>
                        <div>
                          <div className="pm_daystart inputnumber">
                            <h6>Number of people :</h6>
                            <input
                              className="inputall"
                              type="number"
                              min={1}
                              name="so_luong_nguoi"
                              placeholder="numberpeople"
                              value={numberPeople}
                              onChange={handleNumberPeopleChange}
                              style={{ textAlign: "left", width: "100px" }}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="totalprice">
                    <h6>Total Price:</h6>
                    <h5 className="gia_tour">{totalPrice}</h5>
                  </div>
                  <div>
                    <h6>Note :</h6>
                    <textarea
                      placeholder="Write here"
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                        height: "100px",
                      }}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                    <p></p>
                  </div>
                  <h6>Payment methods : </h6>
                  <div className="imgpayment">
                    <div
                      className={`payment-option ${
                        paymentMethod === 2 ? "selected" : ""
                      }`} // Add a selected class if payment method is 2
                      onClick={() => handlePaymentMethodChange(2)} // Set payment method to 2
                    >
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp1v7T287-ikP1m7dEUbs2n1SbbLEqkMd1ZA&s"
                        style={{
                          width: "100px",
                          borderRadius: "10px",
                          cursor: "pointer", // Indicate that the image is clickable
                        }}
                      ></img>
                    </div>
                    <div
                      className={`payment-option ${
                        paymentMethod === 1 ? "selected" : ""
                      }`} // Add a selected class if payment method is 1
                      onClick={() => handlePaymentMethodChange(1)} // Set payment method to 1
                    >
                      <img
                        src="https://static.vecteezy.com/system/resources/previews/005/835/168/original/hand-holding-money-illustration-free-vector.jpg"
                        style={{
                          width: "100px",
                          borderRadius: "10px",
                          cursor: "pointer", // Indicate that the image is clickable
                        }}
                      ></img>
                    </div>
                  </div>
                  <div className="btnn">
                    <button type="button" onClick={handleCancelPay}>
                      Cancel
                    </button>
                    {showPayNow ? (
                      <button style={{ backgroundColor: "green" }}>
                        <a href={urlPay.url}>PAY NOW</a>
                      </button>
                    ) : (
                      <button type="button" onClick={handleUpdatePay}>
                        Confirm
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default Payments;
