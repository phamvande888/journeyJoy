import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import tourBooked from "../../../DemoData/tourBooked";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import SearchBar from "../SearchBar/SearchBar";
import commonAPI from "../../CommonAPI/commonAPI"; // Make sure to import your commonAPI
import TourDetailModal from "./TourDetailModal"; // Import the new TourDetailModal component
import SortBooking from "./sortBooking";
import style from "./SearchBooking.module.css";
import Sidebar from "../../DiepThanh/SideBar/Sidebar";
import ConvertTimestampToDate from "../ConvertTimestampToDate/ConvertTimestampToDate";
export default function SearchBooking() {
  const [filteredBookings, setFilteredBookings] = useState(tourBooked);
  const [bookingStates, setBookingStates] = useState({});
  const [selectedTour, setSelectedTour] = useState(null); // State for selected tour
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [sortOption, setSortOption] = useState("");

  function GetURLPath() {
    const urlPath = useLocation();
    console.log("urlPath>>>>>>>>>>>>>>", urlPath);
    return urlPath.pathname;
  }
  GetURLPath();
  const handleSearch = (query) => {
    const filtered = tourBooked.filter((booking) =>
      booking.ten_tour.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBookings(filtered);
  };

  const handleSort = (sortOption) => {
    setSortOption(sortOption);
    let sortedBookings = [...filteredBookings];

    switch (sortOption) {
      case "so_luong_nguoi":
        sortedBookings.sort((b, a) => a.so_luong_nguoi - b.so_luong_nguoi);
        break;
      case "trang_thai":
        sortedBookings.sort(
          (a, b) => parseInt(a.trang_thai) - parseInt(b.trang_thai)
        );
        break;
      case "ngay_khoi_hanh":
        sortedBookings.sort(
          (b, a) => new Date(a.ngay_khoi_hanh) - new Date(b.ngay_khoi_hanh)
        );
        break;
      case "booking_at":
        sortedBookings.sort((a, b) =>
          ("" + a.booking_at).localeCompare(b.booking_at)
        );
        break;
      case "tong_tien":
        sortedBookings.sort((b, a) => a.tong_tien - b.tong_tien);
        break;
      default:
        break;
    }

    setFilteredBookings(sortedBookings);
  };

  const getTourAPI = async () => {
    try {
      const data = await commonAPI.get("/admin/booking");
      setFilteredBookings(data.content);
      console.log("GET TOUR API ============", data.content);
    } catch (error) {
      console.log("ERROR getTourAPI METHOD GET:", error);
    }
  };

  useEffect(() => {
    getTourAPI();
  }, []);

  const handleStateChange = async (bookingId, newState) => {
    setBookingStates((prevStates) => ({
      ...prevStates,
      [bookingId]: newState,
    }));

    console.log("HANDLE STATE CHANGE SEND DATA", newState);
    try {
      // Sử dụng template literal để thêm trạng thái mới vào query parameter của URL
      const response = await commonAPI.put(
        `/api/booking/approve/${bookingId}?trang_thai=${newState}`
      );
      console.log("PUT response data:", response);
    } catch (error) {
      console.error("Error posting data with PUT:", error);
    }
  };

  const handleNextState = (booking) => {
    const currentState = parseInt(
      bookingStates[booking.id] || booking.trang_thai,
      10
    );
    const nextState = currentState + 1;
    handleStateChange(booking.id, nextState);
  };
  const handleCancelState = (booking) => {
    handleStateChange(booking.id, 4);
  };

  const handleTourClick = (tour) => {
    setSelectedTour(tour);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTour(null);
  };

  const getStateLabel = (state) => {
    switch (state) {
      case 0:
        return "Đã xác nhận";
      case 1:
        return "Đã thanh toán";
      case 2:
        return "Đang đi";
      case 3:
        return "Đã hoàn thành";
      case 4:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  return (
    <div style={{ background: "rgb(15 30 45)" }} className="row mx-0">
      <div className="col-2">
        <Sidebar />
      </div>
      <div className="col-10 " style={{ position: "relative" }}>
        <div className={`${style.searchNsort} d-flex justify-content-center`}>
          <SearchBar onSearch={handleSearch} />
          <SortBooking onSort={handleSort} />
        </div>
        <div>
          <div className={`${style.ContTourBooked} container`}>
            <div className="row justify-content-md-center">
              {filteredBookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="col-3 m-1 p-2"
                  onClick={() => handleTourClick(booking)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Body>
                    <Card.Title>{booking.ten_tour}</Card.Title>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="border-0 px-0">
                        Lưu ý: {booking.ghi_chu}
                      </ListGroup.Item>
                      {/* <div className="pt-2"> */}
                      <ListGroup.Item className="border-0 px-0">
                        Số Lượng Hành Khách: {booking.so_luong_nguoi}
                      </ListGroup.Item>
                      <ListGroup.Item className="border-0 px-0">
                        Ngày Khởi Hành:{" "}
                        {ConvertTimestampToDate(booking.ngay_khoi_hanh)}
                      </ListGroup.Item>
                      <ListGroup.Item className="border-0 px-0">
                        Tổng Tiền: {booking.tong_tien.toLocaleString()}
                      </ListGroup.Item>
                      <ListGroup.Item className="border-0 px-0">
                        Booking At: {ConvertTimestampToDate(booking.booking_at)}
                      </ListGroup.Item>
                      {/* </div> */}
                      <ListGroup.Item style={{ paddingLeft: 0 }}>
                        Trạng thái tour:{" "}
                        {getStateLabel(
                          bookingStates[booking.id] || booking.trang_thai
                        )}
                        {parseInt(
                          bookingStates[booking.id] || booking.trang_thai,
                          10
                        ) < 3 && (
                          <div className="mt-2 float-end">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNextState(booking);
                              }}
                              {...console.log(
                                "DATA TOUR BOOKING WHEN CLICK NEXT STATE",
                                booking
                              )}
                              className="mx-1"
                            >
                              {getStateLabel(booking.trang_thai + 1)}
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelState(booking);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <TourDetailModal
          tour={selectedTour}
          show={showModal}
          onHide={handleCloseModal}
          bookingState={bookingStates[selectedTour?.id]}
          handleStateChange={handleStateChange}
        />
      </div>
    </div>
  );
}
