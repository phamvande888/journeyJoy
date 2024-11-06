// import React, { useEffect, useState } from "react";
// import TourDetailBookingModal from "./TourBookingDetailModal";
// import commonAPI from "../../CommonAPI/commonAPI";
// import ConvertTimestampToDate from "../ConvertTimestampToDate/ConvertTimestampToDate";
// import { useLocation } from "react-router-dom";
// import Sidebar from "../../DiepThanh/SideBar/Sidebar";
// import SearchBar from "../SearchBar/SearchBar";
// import SortListTour from "./SortListTour";
// import { Button, Card } from "react-bootstrap";

// const ListTourBooking = () => {
//   const [bookings, setBookings] = useState([]);
//   const [bookingStates, setBookingStates] = useState({});
//   const [selectedTour, setSelectedTour] = useState(null); // State for selected tour
//   const [showModal, setShowModal] = useState(false);
//   const [checkingState, setCheckingState] = useState();
//   const [filteredTours, setFilteredTours] = useState([]);
//   const [isCheckedIn, setIsCheckedIn] = useState(null);
//   const location = useLocation();
//   const path = location.pathname;
//   console.log("PATH URL LIST TOUR BOOKING MODAL", path);

//   const getDataListBooking = async () => {
//     try {
//       console.log("MESSAGE BEFORE GET DATA LIST BOOKING");
//       const data = await commonAPI.get(path);
//       console.log("MESSAGE GET DATA LIST BOOKING SUCCESS", data);
//       setBookings(data.content);
//     } catch (error) {
//       console.log("ERROR MESSAGE GET DATA LIST BOOKING", error);
//     }
//   };

//   useEffect(() => {
//     getDataListBooking();
//   }, [path]);

//   const handleTourClick = (tour) => {
//     setSelectedTour(tour);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedTour(null);
//   };

//   const handleSearch = (data) => {
//     setFilteredTours(data);
//   };

//   const handleCheckedIn = async (id, checkin, event) => {
//     event.stopPropagation(); // Stop event propagation
//     try {
//       console.log("DATA BEFORE SEND TO CHECKED IN", id, checkin);
//       const response = await commonAPI.put(
//         `/api/booking/checkin/${id}?checkin=${checkin}`
//       );
//       console.log("MESSAGE SUCCESS CHECKED IN", response);
//       setCheckingState(checkin);
//     } catch (error) {
//       console.log("ERROR FAILED TO CHECK IN", error);
//     }
//   };

//   const handleCheckedOut = async (id, checkin, event) => {
//     event.stopPropagation(); // Stop event propagation
//     try {
//       console.log("DATA BEFORE SEND TO CHECKED OUT", id, checkin);
//       const response = await commonAPI.put(
//         `/api/booking/checkin/${id}?checkin=${checkin}`
//       );
//       console.log("MESSAGE SUCCESS CHECKED OUT", response, checkin);
//       setCheckingState(checkin);
//     } catch (error) {
//       console.log("ERROR FAILED TO CHECK OUT", error);
//     }
//   };

//   const handleSort = () => {};

//   const getStateLabel = (state) => {
//     switch (state) {
//       case 1:
//         return "Getting started";
//       case 2:
//         return "On going";
//       case 3:
//         return "Done";
//       case 4:
//         return "Canceled";
//       default:
//         return "Unknown";
//     }
//   };

//   const bookingsToDisplay = filteredTours.length > 0 ? filteredTours : bookings;
//   const handleCheckInClick = (id, status, event) => {
//     handleCheckedIn(id, status, event);
//     setIsCheckedIn(true);
//   };

//   const handleCheckOutClick = (id, status, event) => {
//     handleCheckedOut(id, status, event);
//     setIsCheckedIn(false);
//   };
//   return (
//     <div style={{ background: "rgb(15 30 45)" }} className="row mx-0">
//       <div className="col-2">
//         <Sidebar />
//       </div>
//       {/* <div
//         className={` ${bookings.length > 6 ? "vh-100" : ""}col-10 text-white`}
//         style={{ position: "relative" }}
//       > */}
//       <div
//         className={`col-10 text-white ${bookings.length < 7 ? "vh-100" : ""}`}
//         style={{ position: "relative" }}
//       >
//         <div className="d-flex justify-content-center">
//           <SearchBar onSearch={handleSearch} />
//           <SortListTour onSort={handleSort} />
//         </div>

//         {bookingsToDisplay.length > 0 ? (
//           <div className="row justify-content-center px-5">
//             <h2>Tour Bookings</h2>
//             {bookingsToDisplay.map((booking) => (
//               <div className="col-4 mb-2 px-1" key={booking.id}>
//                 <Card
//                   className="h-100"
//                   onClick={() => handleTourClick(booking)}
//                 >
//                   <Card.Body>
//                     <Card.Title>{booking.ten_tour}</Card.Title>
//                     <Card.Text>
//                       <strong>Ngày Khởi Hành:</strong>{" "}
//                       {ConvertTimestampToDate(booking.ngay_khoi_hanh)}
//                     </Card.Text>
//                     <Card.Text>
//                       <strong>Số Lượng Người:</strong> {booking.so_luong_nguoi}
//                     </Card.Text>
//                     <Card.Text>
//                       <strong>Tổng Tiền:</strong>{" "}
//                       {booking.tong_tien.toLocaleString()} VND
//                     </Card.Text>
//                     <Card.Text>
//                       <strong>Trạng Thái:</strong>{" "}
//                       {getStateLabel(booking.trang_thai)}
//                     </Card.Text>
//                     {/* <Card.Text>
//                       <strong>Check In: </strong>
//                       <Button
//                         onClick={(event) =>
//                           handleCheckedIn(booking.id, 1, event)
//                         }
//                       >
//                         Check in
//                       </Button>
//                       <Button
//                         onClick={(event) =>
//                           handleCheckedOut(booking.id, 0, event)
//                         }
//                       >
//                         Check out
//                       </Button>
//                     </Card.Text> */}
//                     <Card.Text>
//                       <strong>Check In: </strong>
//                       <Button
//                         variant={
//                           booking.checked_in === 1 ? "success" : "secondary"
//                         }
//                         onClick={(event) =>
//                           handleCheckInClick(booking.id, 1, event)
//                         }
//                         disabled={isCheckedIn}
//                       >
//                         Check in
//                       </Button>
//                       <Button
//                         variant={
//                           booking.checked_in === 0 ? "danger" : "secondary"
//                         }
//                         onClick={(event) =>
//                           handleCheckOutClick(booking.id, 0, event)
//                         }
//                         disabled={!isCheckedIn}
//                       >
//                         Check out
//                       </Button>
//                     </Card.Text>
//                   </Card.Body>
//                 </Card>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>No bookings found for this tour.</p>
//         )}

//         <TourDetailBookingModal
//           className=""
//           tour={selectedTour}
//           show={showModal}
//           onHide={handleCloseModal}
//           bookingState={bookingStates[selectedTour?.id]}
//         />
//       </div>
//     </div>
//   );
// };

// export default ListTourBooking;
import React, { useEffect, useState } from "react";
import TourDetailBookingModal from "./TourBookingDetailModal";
import commonAPI from "../../CommonAPI/commonAPI";
import ConvertTimestampToDate from "../ConvertTimestampToDate/ConvertTimestampToDate";
import { useLocation } from "react-router-dom";
import Sidebar from "../../DiepThanh/SideBar/Sidebar";
import SearchBar from "../SearchBar/SearchBar";
import SortListTour from "./SortListTour";
import { Button, Card } from "react-bootstrap";

const ListTourBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredTours, setFilteredTours] = useState([]);
  const location = useLocation();
  const path = location.pathname;

  const getDataListBooking = async () => {
    try {
      const data = await commonAPI.get(path);
      setBookings(data.content);
    } catch (error) {
      console.log("ERROR MESSAGE GET DATA LIST BOOKING", error);
    }
  };

  useEffect(() => {
    getDataListBooking();
  }, [path]);

  const handleTourClick = (tour) => {
    setSelectedTour(tour);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTour(null);
  };

  const handleSearch = (data) => {
    setFilteredTours(data);
  };

  const handleCheckedIn = async (id, event) => {
    event.stopPropagation();
    try {
      const response = await commonAPI.put(
        `/api/booking/checkin/${id}?checkin=1`
      );
      const updatedBookings = bookings.map((booking) =>
        booking.id === id ? { ...booking, checked_in: 1 } : booking
      );
      setBookings(updatedBookings);
    } catch (error) {
      console.log("ERROR FAILED TO CHECK IN", error);
    }
  };

  const handleCheckedOut = async (id, event) => {
    event.stopPropagation();
    try {
      const response = await commonAPI.put(
        `/api/booking/checkin/${id}?checkin=0`
      );
      const updatedBookings = bookings.map((booking) =>
        booking.id === id ? { ...booking, checked_in: 0 } : booking
      );
      setBookings(updatedBookings);
    } catch (error) {
      console.log("ERROR FAILED TO CHECK OUT", error);
    }
  };

  const getStateLabel = (state) => {
    switch (state) {
      case 1:
        return "Getting started";
      case 2:
        return "On going";
      case 3:
        return "Done";
      case 4:
        return "Canceled";
      default:
        return "Unknown";
    }
  };

  const bookingsToDisplay = filteredTours.length > 0 ? filteredTours : bookings;

  return (
    <div style={{ background: "rgb(15 30 45)" }} className="row mx-0">
      <div className="col-2">
        <Sidebar />
      </div>
      <div
        className={`col-10 text-white ${bookings.length < 7 ? "vh-100" : ""}`}
        style={{ position: "relative" }}
      >
        <div className="d-flex justify-content-center">
          <SearchBar onSearch={handleSearch} />
          <SortListTour onSort={() => {}} />
        </div>

        {bookingsToDisplay.length > 0 ? (
          <div className="row justify-content-center px-5">
            <h2>Tour Bookings</h2>
            {bookingsToDisplay.map((booking) => (
              <div className="col-4 mb-2 px-1" key={booking.id}>
                <Card
                  className="h-100"
                  onClick={() => handleTourClick(booking)}
                >
                  <Card.Body>
                    <Card.Title>{booking.ten_tour}</Card.Title>
                    <Card.Text>
                      <strong>Ngày Khởi Hành:</strong>{" "}
                      {ConvertTimestampToDate(booking.ngay_khoi_hanh)}
                    </Card.Text>
                    <Card.Text>
                      <strong>Số Lượng Người:</strong> {booking.so_luong_nguoi}
                    </Card.Text>
                    <Card.Text>
                      <strong>Tổng Tiền:</strong>{" "}
                      {booking.tong_tien.toLocaleString()} VND
                    </Card.Text>
                    <Card.Text>
                      <strong>Trạng Thái:</strong>{" "}
                      {getStateLabel(booking.trang_thai)}
                    </Card.Text>
                    <Card.Text>
                      <strong>Check In: </strong>
                      <Button
                        variant={
                          booking.checked_in === 1 ? "success" : "secondary"
                        }
                        onClick={(event) => handleCheckedIn(booking.id, event)}
                        disabled={booking.checked_in === 1}
                      >
                        Check in
                      </Button>
                      <Button
                        variant={
                          booking.checked_in === 0 ? "danger" : "secondary"
                        }
                        onClick={(event) => handleCheckedOut(booking.id, event)}
                        disabled={booking.checked_in !== 1}
                      >
                        Check out
                      </Button>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <p>No bookings found for this tour.</p>
        )}

        <TourDetailBookingModal
          className=""
          tour={selectedTour}
          show={showModal}
          onHide={handleCloseModal}
          bookingState={selectedTour?.checked_in}
        />
      </div>
    </div>
  );
};

export default ListTourBooking;
