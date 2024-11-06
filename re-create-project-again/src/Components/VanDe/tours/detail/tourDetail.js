import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./tourDetail.css";
import Header from "../../homePage/header/header";
import Footer from "../../homePage/footer/footer";
import ReComments from "../ReComments/ReComments";
import { URL_SERVER } from "../../server";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Rating } from "@mui/material";
import sale5 from "./sale5.jpg";
import sale10 from "./sale10.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  notifySuccess,
  notifyError,
  notifyWarn,
  notifyInfo,
} from "../../notify/Notify";
const url = URL_SERVER; //sever

const TourDetail = () => {
  const navigate = useNavigate(); // go to next page
  const { id } = useParams(); // id tour
  const location = useLocation(); // get location object
  const trangThaiFeedBack = location.state?.trang_thai_feedback || null;

  const [tourDetail, setTourDetail] = useState(null); // tour
  const [numberOfPeople, setNumberOfPeople] = useState(1); // number of people
  const [totalPrice, setTotalPrice] = useState(0); //price
  const [feedbackList, setFeedbackList] = useState([]); //list feedback
  const [selectedDate, setSelectedDate] = useState(""); // day in demo booking
  const [discountMessage, setDiscountMessage] = useState(""); // discount message

  const [isBooked, setIsBooked] = useState(false); // true/false booked
  const [value, setValue] = React.useState(0); // state start when user rating
  const [feedback, setFeedback] = useState(""); //feedback

  const [averageRating, setAverageRating] = useState(0); // average Rate

  // Filter state
  const [ratingFilter, setRatingFilter] = useState(0); // 0 means no filter

  // Pagination state
  const [visibleFeedbackCount, setVisibleFeedbackCount] = useState(3);
  const [loadingMore, setLoadingMore] = useState(false); // for loading state
  const [errorLoading, setErrorLoading] = useState(""); // for error message

  const userIdLocal = localStorage.getItem("localUserID"); // id user stored local

  //update feedback
  const [update_value, setUpdate_value] = useState(0); // for error message
  const [update_feedback, setUpdate_feedback] = useState(""); // for error message
  const [isUpdate, setIsUpdate] = useState(false); // for error message

  // gọi lại khi edit feedback
  const fetchAllTour = async () => {
    try {
      const response = await fetch(
        `${url}/tour/${id}`, // use template literals
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTourDetail(data);
      setFeedbackList(data.feedbacks); // Initialize feedback list from the fetched data
      console.log("--------------thong tin tour: ", data);
    } catch (error) {
      console.error("Error fetching tours:", error);
      alert(`Error fetching tours: ${error.message}`);
    }
  };

  // --------------- API  GET tour base id ----------
  useEffect(() => {
    const fetchAllTour = async () => {
      try {
        const response = await fetch(
          `${url}/tour/${id}`, // use template literals
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTourDetail(data);
        setFeedbackList(data.feedbacks); // Initialize feedback list from the fetched data
        console.log("--------------thong tin tour: ", data);
      } catch (error) {
        console.error("Error fetching tours:", error);
        alert(`Error fetching tours: ${error.message}`);
      }
    };
    fetchAllTour();
    if (trangThaiFeedBack === 3) {
      setIsBooked(true);
    }
  }, [id]);

  // update total price booking
  useEffect(() => {
    if (tourDetail) {
      let newTotalPrice = numberOfPeople * tourDetail.tour.gia_tour;
      let discountMessage = "";

      if (numberOfPeople >= 5 && numberOfPeople < 10) {
        newTotalPrice *= 0.95; // 5% discount
        discountMessage = "You get 5% discount";
      } else if (numberOfPeople >= 10) {
        newTotalPrice *= 0.9; // 10% discount
        discountMessage = "You get 10% discount";
      }

      setTotalPrice(newTotalPrice);
      setDiscountMessage(discountMessage);
    }
  }, [numberOfPeople, tourDetail]);

  // feedback list
  useEffect(() => {
    if (feedbackList.length > 0) {
      const totalRatings = feedbackList.reduce(
        (acc, feedback) => acc + feedback.rating,
        0
      );
      setAverageRating(totalRatings / feedbackList.length);
    } else if (tourDetail) {
      setAverageRating(tourDetail.tour.rate || 0);
    }
  }, [feedbackList, tourDetail]);

  // update number of people change
  const handleNumberOfPeopleChange = (event) => {
    const value = parseInt(event.target.value);
    if (value >= 1) {
      setNumberOfPeople(value);
    }
  };

  // write feedback
  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  // -------------------SUBMIT FEEDBACK--------------------
  const handleFeedbackSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${url}/tour/${id}/create_feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          rating: value,
          comment: feedback,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        notifyError(data.message);
        console.log(data);
      } else {
        const data = await response.json(); // lay duoc data
        console.log(data);
        notifySuccess(data.message);
        setTimeout(() => {
          setIsBooked(false);
        }, 2000);
        fetchAllTour();
      }
    } catch (error) {
      console.error("Error Feedback:", error);
      notifyWarn(`Error during booking: ${error.message}`);
    }
  };

  // decrease people
  const handleDecrease = () => {
    if (numberOfPeople > 1) {
      setNumberOfPeople(numberOfPeople - 1);
    }
  };

  // increase people
  const handleIncrease = () => {
    setNumberOfPeople(numberOfPeople + 1);
  };

  // date start tour
  const handleBookDate = (event) => {
    const date = new Date(event.target.value);
    const formattedDate = date.toISOString().split("T")[0]; // Format to yyyy-mm-dd
    setSelectedDate(formattedDate);
  };

  // -----------------------API get Booking demo---------------------------------------
  const handleBookNow = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${url}/tour/booking/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          so_nguoi: numberOfPeople,
          ngay_khoi_hanh: selectedDate,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        notifyWarn(data.message);
        console.log("dong 169");
        console.log(data);
      } else {
        const data = await response.json(); // lay duoc data

        setIsBooked(true);
        console.log("=========BOOKING DEMO=======", data);
        navigate(`/tour/${id}/payments`, { state: { bookingData: data } });
      }
    } catch (error) {
      console.error("Error during booking:", error);
      notifyWarn(`Error during booking: ${error.message}`);
    }
  };

  // tour Not found
  if (!tourDetail) {
    return <div style={{ textAlign: "center" }}>Loading</div>;
  }

  // Function to format the timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-GB"); // Adjust as needed for your locale
  };

  // Function to load more feedbacks
  const handleLoadMoreFeedbacks = async () => {
    setLoadingMore(true); // Set loading state to true
    setErrorLoading(""); // Clear any previous errors
    try {
      // Simulate a network request delay (if needed)
      await new Promise((resolve) => setTimeout(resolve, 500));
      setVisibleFeedbackCount((prevCount) => prevCount + 10);
    } catch (error) {
      setErrorLoading("Failed to load more feedbacks. Please try again.");
    } finally {
      setLoadingMore(false); // Reset loading state
    }
  };

  // Sort feedback list by creation date (most recent first)
  const sortedFeedbackList = [...feedbackList].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Filter feedback list based on ratingFilter
  const filteredFeedbackList = sortedFeedbackList.filter((item) =>
    ratingFilter ? item.rating === ratingFilter : true
  );

  ///------------------------- DELETE FEEDBACK ------------------------------
  const handleDeleteFeedback = async (feedbackId) => {
    const token = localStorage.getItem("token");
    console.log("Feedback ID:", feedbackId);
    try {
      const response = await fetch(`${url}/tour/${id}/feedback/${feedbackId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      if (!response.ok) {
        const data = await response.json();
        notifyError(data.message);
        console.log(data);
      } else {
        const data = await response.json(); // lay duoc data
        console.log(data);
        notifySuccess(data.message);
        // setTimeout(() => {
        //   setIsBooked(false);
        // }, 2000);
        fetchAllTour();
      }
    } catch (error) {
      console.error("Error Feedback:", error);
      notifyWarn(`Error during booking: ${error.message}`);
    }
  };

  ///------------------------- UPDATE FEEDBACK ---------------------
  const handleUpdateFeedback = async (feedbackId) => {
    setIsUpdate(true);
  };

  // const handleUpdateFeedbackSubmit = async (feedbackId) => {
  //   const token = localStorage.getItem("token");
  //   console.log("Feedback ID:", feedbackId);
  //   try {
  //     const response = await fetch(`${url}/tour/${id}/feedback/${feedbackId}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //         "ngrok-skip-browser-warning": "69420",
  //       },
  //       body: JSON.stringify({
  //         rating: update_value,
  //         comment: update_feedback,
  //       }),
  //     });
  //     if (!response.ok) {
  //       const data = await response.json();
  //       notifyError(data.message);
  //       console.log(data);
  //     } else {
  //       const data = await response.json(); // lay duoc data
  //       console.log(data);
  //       notifySuccess(data.message);
  //       fetchAllTour();
  //     }
  //   } catch (error) {
  //     console.error("Error Feedback:", error);
  //     notifyWarn(`Error during booking: ${error.message}`);
  //   }
  // };
  return (
    <div>
      <Header />
      <div className="dtbanner">
        <div className="dtbanner__a">
          {/* <div>
            <h1>TOUR DETAILS</h1>
            <div className="dtbanner__a__content">
              HOME PAGE
              <i className="fa-solid fa-angles-right"></i>
              DETAIL
            </div>
          </div> */}
        </div>
        <div className="detail__root">
          <div className="detail">
            <div>
              <div className="underH1">
                <div>
                  <h1>{tourDetail.tour.ten_tour}</h1>
                  <h3>
                    Tickets available:{" "}
                    <span style={{ color: "" }}>
                      {tourDetail.tour.maxGuests -
                        tourDetail.tour.currentGuests}
                    </span>
                  </h3>
                  <p>{tourDetail.tour.gioi_thieu_tour}</p>
                </div>
              </div>

              <div>
                <Carousel autoPlay interval={3000} infiniteLoop>
                  {tourDetail.images.map((image) => (
                    <div key={image.id}>
                      <img src={`${url}/public/img/${image.url}`} alt="Tour" />
                    </div>
                  ))}
                </Carousel>
              </div>
              <div className="detail__content">
                <div
                  dangerouslySetInnerHTML={{
                    __html: tourDetail.tour.noi_dung_tour,
                  }}
                />
              </div>
            </div>
            <div className="feedback">
              {isBooked ? (
                <div className="borderfeedback">
                  <div className="borderfeedback__header">
                    <div>
                      <h2>Feedback</h2>
                    </div>
                    <div className="borderfeedback__header__start">
                      <Rating
                        name="simple-controlled"
                        value={value}
                        onChange={(event, newValue) => {
                          setValue(newValue);
                        }}
                      />
                    </div>
                  </div>
                  <textarea
                    onChange={handleFeedbackChange}
                    placeholder="Write your feedback here"
                  />
                  <div>
                    <button onClick={handleFeedbackSubmit}>Submit</button>
                  </div>
                </div>
              ) : (
                <div></div>
              )}

              <div id="feedback" className="feedback-list">
                <div>
                  <h2>Customer reviews</h2>
                  <p>
                    Overall rating:{" "}
                    <span>
                      {averageRating
                        ? averageRating.toFixed(1)
                        : "No reviews yet"}
                    </span>
                  </p>
                  <Rating
                    className="overallRating"
                    name="read-only"
                    value={averageRating}
                    readOnly
                  />
                </div>

                <div className="rating-filter">
                  <h3>Filter by Rating</h3>
                  <select
                    onChange={(e) => setRatingFilter(parseInt(e.target.value))}
                  >
                    <option value="0">All Ratings</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>

                {loadingMore && (
                  <div className="loading-indicator">Loading...</div>
                )}
                {errorLoading && (
                  <div className="error-message">{errorLoading}</div>
                )}
                {filteredFeedbackList.length > 0 ? (
                  filteredFeedbackList
                    .slice(0, visibleFeedbackCount)
                    .map((item, index) => (
                      <div key={index} className="feedback-item">
                        <p>
                          <Rating
                            name="read-only"
                            value={item.rating}
                            readOnly
                          />
                        </p>
                        <div className="namefeedback">
                          <i
                            style={{ paddingRight: "10px" }}
                            className="fa-solid fa-user"
                          ></i>{" "}
                          {item.hoTen}
                          <span style={{ paddingLeft: "10px" }}>
                            {formatTimestamp(item.createdAt)}
                          </span>
                          {item.userId === parseInt(userIdLocal) && (
                            <div>
                              <span style={{ paddingRight: "10px" }}>
                                <i
                                  onClick={() => handleUpdateFeedback(item.id)}
                                  class="fa-solid fa-pen-nib"
                                ></i>
                              </span>
                              <span>
                                <i
                                  onClick={() => handleDeleteFeedback(item.id)}
                                  class="fa-solid fa-trash"
                                ></i>
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="admin-reply-time"></p>

                        <p>{item.comment}</p>

                        {item.adminReply && (
                          <div style={{ paddingLeft: "20px" }}>
                            <p className="namefeedback">
                              <i
                                style={{ paddingRight: "10px" }}
                                class="fa-solid fa-user-tie"
                              ></i>{" "}
                              Admin
                            </p>
                            <p>{item.adminReply}</p>
                          </div>
                        )}

                        {/* {isUpdate ? (
                          <div className="borderfeedback">
                            <div className="borderfeedback__header">
                              <div>
                                <h2>Update</h2>
                              </div>
                              <div className="borderfeedback__header__start">
                                <Rating
                                  name="simple-controlled"
                                  value={update_value}
                                  onChange={(event, newValue) => {
                                    setUpdate_value(newValue);
                                  }}
                                />
                              </div>
                            </div>
                            <textarea
                              onChange={handleFeedbackChange}
                              placeholder="Write your feedback here"
                            />
                            <div>
                              <button onClick={handleUpdateFeedbackSubmit}>
                                Submit
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div> hien thi sai </div>
                        )} */}
                      </div>
                    ))
                ) : (
                  <p></p>
                )}
                {filteredFeedbackList.length > visibleFeedbackCount && (
                  <button
                    className="btnfeedback"
                    onClick={handleLoadMoreFeedbacks}
                    disabled={loadingMore}
                  >
                    {loadingMore ? "Loading..." : "Show More"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="booking">
            <div className="booking__border">
              <div className="booking__header">
                <img
                  src={`${url}/public/img/${tourDetail.tour.anh_tour}`}
                ></img>

                <h3>{tourDetail.tour.ten_tour}</h3>
              </div>
              <div className="schedule">
                <h4>Departure schedule :</h4>
                <select onChange={handleBookDate}>
                  <option value="">Select date</option>
                  {tourDetail.tourStartDates.map((date) => (
                    <option
                      key={date.id}
                      value={
                        new Date(date.ngay_khoi_hanh)
                          .toISOString()
                          .split("T")[0]
                      }
                    >
                      {new Date(date.ngay_khoi_hanh).toLocaleDateString(
                        "en-GB"
                      )}
                    </option>
                  ))}
                </select>
              </div>
              <h4 className="pricePerPerson">
                <span id="pricePerPerson">
                  {tourDetail.tour.gia_tour.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
                <span> / person</span>
              </h4>
              <div className="numberPerson">
                <button className="decrease" onClick={handleDecrease}>
                  -
                </button>
                <input
                  type="text"
                  id="numberOfPeople"
                  value={numberOfPeople}
                  onChange={handleNumberOfPeopleChange}
                />
                <i className="fa-solid fa-person numberOfPeople__icon"></i>
                <button className="increase" onClick={handleIncrease}>
                  +
                </button>
              </div>
              {discountMessage && (
                <div className="discount__message">
                  <span> {discountMessage}</span>
                  {/* <img
                    src="/sale.jpg"
                    alt="Discount"
                    style={{ width: "50px" }}
                  /> */}
                </div>
              )}
              <h2 className="total">
                Total :{" "}
                <span id="totalPrice">
                  {totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </h2>

              <div>
                <button onClick={handleBookNow}>Book now</button>
              </div>
            </div>
          </div>
        </div>
        <ReComments tourDetail={tourDetail} />
        <ToastContainer />

        <Footer />
      </div>
    </div>
  );
};

export default TourDetail;
