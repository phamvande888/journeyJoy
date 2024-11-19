import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import dataTours from "../../../DemoData/dataTours.json";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import SearchBar from "../SearchBar/SearchBar";
import commonAPI from "../../CommonAPI/commonAPI"; // Make sure to import your commonAPI
import ListTourDetailModal from "./ListTourDetailModal"; // Import the TourDetailModal component
import CreateTourModal from "./CreateTour"; // Import the CreateTourModal component
import UpdateDatesModal from "./UpdateDatesModal"; // Import the UpdateDatesModal component
import UpdateImagesModal from "./UpdateImagesModal"; // Import the UpdateImagesModal component
import style from "../booking/SearchBooking.module.css";
import Sidebar from "../../DiepThanh/SideBar/Sidebar";
import SortListTour from "./SortListTour";
import UpdateTourAvatarModal from "./UpdateTourAvatarModal";
import { URL_SERVER } from "../../VanDe/server";
export default function ListTour() {
  const [filteredTours, setFilteredTours] = useState(dataTours);
  const [selectedTour, setSelectedTour] = useState(null); // State for selected tour
  const [showTourDetailModal, setShowTourDetailModal] = useState(false); // State to control tour detail modal visibility
  const [showCreateTourModal, setShowCreateTourModal] = useState(false); // State to control create tour modal visibility
  const [showUpdateDatesModal, setShowUpdateDatesModal] = useState(false); // State to control update dates modal visibility
  const [showUpdateImagesModal, setShowUpdateImagesModal] = useState(false); // State to control update images modal visibility
  const [ShowAvatarTourModal, setShowAvatarTourModal] = useState(false); // State to control update images modal visibility
  // const [bookingsForSelectedTour, setBookingsForSelectedTour] = useState([]);

  const navigate = useNavigate(); // Initialize navigate

  function GetURLPath() {
    const urlPath = useLocation();
    return urlPath.pathname;
  }

  const path = GetURLPath();

  const handleSearch = (data) => {
    setFilteredTours(data);
  };

  const handleSort = (sortOption) => {
    setFilteredTours(sortOption);
  };

  const getTourAPI = async () => {
    try {
      let data = {};
      if (path.includes("/admin")) {
        data = await commonAPI.get("/admin/tour");
      } else if (path.includes("/tourguide")) {
        data = await commonAPI.get("/tourguide/bookings");
      }
      console.log("GET TOUR API", data.content);
      setFilteredTours(data.content);
    } catch (error) {
      console.log("ERROR getTourAPI METHOD GET:", error);
    }
  };

  useEffect(() => {
    getTourAPI();
  }, []);

  const handleTourClick = (tour) => {
    setSelectedTour(tour);
    setShowTourDetailModal(true);
  };

  const handleCloseTourDetailModal = () => {
    setShowTourDetailModal(false);
    setSelectedTour(null);
  };

  const handleSaveTourDetails = async (updatedTour) => {
    try {
      console.log("UPDATE TOUR DATA AND IMAGE", updatedTour);

      // Cập nhật thông tin tour
      const response = await commonAPI.put(
        `/api/tour/update/${updatedTour.id}`,
        updatedTour
      );
      console.log("Updated tour response:", response);

      setFilteredTours((prevTours) =>
        prevTours.map((tour) =>
          tour.id === updatedTour.id ? updatedTour : tour
        )
      );

      handleCloseTourDetailModal();
    } catch (error) {
      console.error("Error updating tour:", error);
    }
  };

  const handleViewBookingsClick = (tourId) => {
    navigate(`/tourguide/tour/${tourId}/bookings`); // Navigate to the bookings page
  };

  const handleCreateTour = async (newTour) => {
    // Logic to handle creating a new tour
    try {
      console.log("DATA NEW TOUR BEFORE PUSH TO SERVER", newTour);
      const data = await commonAPI.post(`/api/tour/add`, newTour);

      console.log("MESSAGE CREATE TOUR", data);
      setFilteredTours([...filteredTours, newTour]);

      setShowCreateTourModal(false);
    } catch (error) {
      console.log("ERROR MESSAGE CREATE TOUR", error);
    }
  };

  const handleUpdateDates = async (tourId, newDates) => {
    try {
      // Logic to handle updating the tour start dates
      console.log("DATA DATE PUSH TO SERVER", Date.parse(newDates));
      const data = await commonAPI.post(
        `/api/tour/add-date/${tourId}`,
        Date.parse(newDates)
      );
      console.log("DATA RESPONE WHEN UPDATE DATE SUCCESS", data);
      alert("UPDATE DATE SUCCESS");
      setShowUpdateDatesModal(false);
    } catch (error) {
      console.error("Error updating dates:", error);
    }
  };

  const handleUpdateImages = async (tourId, newImages) => {
    try {
      const formData = new FormData();

      // Lặp qua danh sách các tệp tin và thêm vào FormData
      newImages.forEach((image) => {
        formData.append("image", image); // Sử dụng 'image' làm key
      });

      // Gửi yêu cầu POST
      const response = await commonAPI.post(
        `/api/tour/add-image/${tourId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("UPLOAD IMAGE SUCCESS!");
      console.log("UPDATING IMAGES", response.data);

      // Cập nhật danh sách các tour nếu cần
      const updatedTours = filteredTours.map((tour) =>
        tour.id === tourId
          ? { ...tour, anh_tour: newImages.map((image) => image.name) }
          : tour
      );
      setFilteredTours(updatedTours);
      setShowUpdateImagesModal(false);
    } catch (error) {
      console.error("ERROR UPDATING IMAGES:", error);
    }
  };

  const handleUpdateTourAvatar = async (tourId, newImages) => {
    try {
      const formData = new FormData();

      formData.append("image", newImages); // Sử dụng 'image' làm key
      console.log("SEND DATA IMAGE", newImages);
      // Gửi yêu cầu PUT
      const response = await commonAPI.put(
        `/api/tour/update/image/${tourId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("UPDATING IMAGES", response.data);

      // Cập nhật danh sách tour nếu cần
      setFilteredTours((prevTours) =>
        prevTours.id === tourId
          ? { ...prevTours, anh_tour: newImages.name }
          : prevTours
      );

      setShowUpdateImagesModal(false);
    } catch (error) {
      console.error("ERROR UPDATING IMAGES:", error);
    }
  };
  return (
    <div style={{ background: "rgb(15 30 45)" }} className="row mx-0">
      <div className="col-2">
        <Sidebar />
      </div>
      <div className="col-10" style={{ position: "relative" }}>
        <div className={`${style.searchNsort} d-flex justify-content-center`}>
          <SearchBar onSearch={handleSearch} />
          <SortListTour onSort={handleSort} />
          {path.includes("/admin") ? (
            <Button
              style={{ marginBottom: "auto", marginTop: "auto" }}
              onClick={() => setShowCreateTourModal(true)}
            >
              Create Tour
            </Button>
          ) : null}
        </div>
        <div>
          <div className="container">
            <div className="row justify-content-md-center">
              {console.log("DATA FILTERED TOUR AFTER SEARCH", filteredTours)}
              {filteredTours.map((tour) => (
                <Card key={tour.id} className="col-3 m-1 p-1">
                  <Card.Img
                    className="rounded-2"
                    style={{ height: 168, width: "auto" }}
                    variant="top"
                    src={`${URL_SERVER}/public/img/${tour.anh_tour}`}
                  />
                  <Card.Body>
                    <Card.Title>{tour.ten_tour}</Card.Title>
                    <ListGroup variant="flush">
                      <div className="pt-2">
                        <ListGroup.Item className="border-0 px-0">
                          <div className="d-flex justify-content-between">
                            <div>
                              <strong>Số Ngày: </strong> {tour.so_ngay}
                            </div>
                            <div>
                              <strong>Tổng số Khách đã đi: </strong>{" "}
                              {tour.currentGuests}
                            </div>
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item className="border-0 px-0">
                          <strong>Giá Tour: </strong>{" "}
                          {tour.gia_tour.toLocaleString()} VND
                        </ListGroup.Item>
                      </div>
                    </ListGroup>
                    <div className="row d-flex justify-content-around">
                      {path.includes("/admin/listtour") ? (
                        <div className="d-flex justify-content-center">
                          <Button
                            variant="primary"
                            className="col-3"
                            onClick={() => handleTourClick(tour)}
                          >
                            <i className="fas fa-info me-1"></i>/
                            <i className="fas fa-edit ms-1"></i>
                          </Button>
                          <Button
                            variant="primary"
                            className="col-2 mx-1"
                            onClick={() => {
                              setSelectedTour(tour);
                              setShowUpdateDatesModal(true);
                            }}
                          >
                            <i className="far fa-calendar-alt"></i>
                          </Button>
                          <Button
                            variant="primary"
                            className="col-2"
                            onClick={() => {
                              setSelectedTour(tour);
                              setShowUpdateImagesModal(true);
                            }}
                          >
                            <i class="far fa-images"></i>
                          </Button>
                          <Button
                            variant="primary"
                            className="col-2 ms-1"
                            onClick={() => {
                              setSelectedTour(tour);
                              setShowAvatarTourModal(true);
                            }}
                          >
                            <i class="far fa-image"></i>
                          </Button>
                        </div>
                      ) : null}
                      {path.includes("/tourguide/listtour") ? (
                        <>
                          <Button
                            variant="primary"
                            className="col-5"
                            onClick={() => handleTourClick(tour)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="secondary"
                            className="col-6"
                            onClick={() => handleViewBookingsClick(tour.id)}
                          >
                            View Bookings
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <ListTourDetailModal
          show={showTourDetailModal}
          onHide={handleCloseTourDetailModal}
          tour={selectedTour}
          onSave={handleSaveTourDetails}
        />
        <CreateTourModal
          show={showCreateTourModal}
          onHide={() => setShowCreateTourModal(false)}
          onSave={handleCreateTour}
        />
        <UpdateDatesModal
          show={showUpdateDatesModal}
          onHide={() => setShowUpdateDatesModal(false)}
          tour={selectedTour}
          onSave={handleUpdateDates}
        />
        <UpdateImagesModal
          show={showUpdateImagesModal}
          onHide={() => setShowUpdateImagesModal(false)}
          tour={selectedTour}
          onSave={handleUpdateImages}
        />
        <UpdateTourAvatarModal
          show={ShowAvatarTourModal}
          onHide={() => setShowAvatarTourModal(false)}
          tour={selectedTour}
          onSave={handleUpdateTourAvatar}
        />
      </div>
    </div>
  );
}
