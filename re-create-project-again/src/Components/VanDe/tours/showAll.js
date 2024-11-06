import "./allTour.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { URL_SERVER } from "../server.js";
import {
  notifyError,
  notifyInfo,
  notifySuccess,
  notifyWarn,
} from "../notify/Notify.js";
import Header from "../homePage/header/header.js";
import Footer from "../homePage/footer/footer.js";
import FilterAllTour from "../homePage/filter/FilterAlltour.js";

// Component fetch all tour in home page
const ShowAll = ({ user }) => {
  const navigate = useNavigate(); // navigate page

  const [allTour, setAllTour] = useState([]); // state of list tour
  const [filteredTours, setFilteredTours] = useState([]); // state for filtered tours
  const [tourCount, setTourCount] = useState(0); // state for count of filtered tours
  const [tourNotFound, setTourNotFound] = useState(false); // state for tour not found message
  const [visibleTourCount, setVisibleTourCount] = useState(12); // state for visible tour count
  const [sortOption, setSortOption] = useState(""); // state for sorting option
  const location = useLocation();
  const dataSearch = location.state?.dataSearch || null; // Get dataSearch from location state
  const userId = localStorage.getItem("localUserID");

  // Fetch all tours
  const fetchAllTour = async () => {
    try {
      const response = await fetch(`${URL_SERVER}/`, {
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
      setAllTour(data);
      console.log("--------Hiển thị tour---------", allTour);
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  // display tours based on search data
  const filterTours = (searchData) => {
    if (searchData && searchData.length > 0) {
      const searchResults = allTour.filter((tour) =>
        searchData.some((result) => result.id === tour.id)
      );
      setFilteredTours(searchResults);
      setTourCount(searchResults.length);
      setTourNotFound(searchResults.length === 0);
    } else {
      setFilteredTours(allTour);
      setTourCount(allTour.length);
      setTourNotFound(false); // No search data, so no "not found" message
    }
  };

  // Sort filtered tours based on the selected option
  const sortTours = (option) => {
    const sortedTours = [...filteredTours].sort((a, b) => {
      if (option === "price-asc") {
        return a.gia_tour - b.gia_tour;
      } else if (option === "price-desc") {
        return b.gia_tour - a.gia_tour;
      }
      return 0; // No sorting if no valid option
    });
    setFilteredTours(sortedTours);
  };

  useEffect(() => {
    fetchAllTour();
  }, []);

  useEffect(() => {
    filterTours(dataSearch);
  }, [allTour, dataSearch]);

  useEffect(() => {
    sortTours(sortOption); // Sort tours whenever sortOption changes
  }, [sortOption]);

  const handleFilter = (filteredData) => {
    setFilteredTours(filteredData);
    setTourCount(filteredData.length);
    setTourNotFound(filteredData.length === 0);
  };

  // Handle click tour --> move to detail tour
  const handleDetailClick = (id) => {
    navigate(`/tour/${id}`);
  };

  // Add wishlist
  const addWishList = async (id) => {
    if (!userId) {
      notifyWarn("Please Login!");
      return;
    }
    const requestBody = {
      userId: userId,
      tourId: id,
    };
    try {
      const response = await fetch(`${URL_SERVER}/wishlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      if (!response.ok) {
        console.error("Error adding to wishlist:", result);
        notifyWarn(result.message);
        return;
      } else {
        console.log(result);
        if (result.message === "Item added to wishlist successfully.") {
          notifySuccess(result.message);
        } else {
          notifyError(result.message);
        }
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      notifyError("Error adding to wishlist!");
    }
  };

  // Handle text truncation
  const truncateText = (text, maxLines, lineHeight = 1.2) => {
    const maxHeight = maxLines * lineHeight * 22;
    const tempElement = document.createElement("div");
    tempElement.style.position = "absolute";
    tempElement.style.visibility = "hidden";
    tempElement.style.width = "420px";
    tempElement.style.fontSize = "16px";
    tempElement.style.lineHeight = `${lineHeight}em`;
    tempElement.innerHTML = text;
    document.body.appendChild(tempElement);
    if (tempElement.scrollHeight > maxHeight) {
      let truncatedText = text;
      while (tempElement.scrollHeight > maxHeight) {
        truncatedText = truncatedText.slice(0, -1);
        tempElement.innerHTML = truncatedText + "...";
      }
      document.body.removeChild(tempElement);
      return truncatedText + "...";
    }
    document.body.removeChild(tempElement);
    return text;
  };

  const truncateTextTiitle = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  // Load more tours
  const loadMoreTours = () => {
    setVisibleTourCount((prevCount) => prevCount + 8);
  };

  // Handle sort change
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <div>
      <div
        className="allTour_root"
        id="allTour"
        style={{ paddingTop: "5% ", minHeight: "500px" }}
      >
        <Header />
        <FilterAllTour onFilter={handleFilter} />
        <div className="sort-container">
          <label htmlFor="sort-options" style={{ paddingRight: "10px" }}>
            Sort by :
          </label>
          <select id="sort-options" onChange={handleSortChange}>
            <option value="">Price</option>
            <option value="price-asc">Low to High</option>
            <option value="price-desc">High to Low</option>
          </select>
        </div>
        <div className="body__alltours">
          {/* Sort Dropdown */}

          {/* Display count message */}
          <div className="tour-count-message">
            {tourNotFound ? (
              <p className="tour-not-found">Tour not found!</p>
            ) : (
              <p className="tour-found-message">
                {tourCount} tour{tourCount > 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="body__alltours--col">
            {filteredTours.slice(0, visibleTourCount).map((tour) => (
              <div className="card" key={tour.id}>
                <img
                  className="card__background"
                  src={`${URL_SERVER}/public/img/${tour.anh_tour}`}
                  alt={tour.nameTour}
                  width="1920"
                  height="2193"
                />
                <div className="card__content | flow">
                  <div className="card__content--container | flow">
                    <h2 className="card__title">
                      {truncateTextTiitle(tour.ten_tour, 200)}
                    </h2>
                    <p className="card__description">
                      {truncateText(tour.gioi_thieu_tour, 2)}
                    </p>
                  </div>
                  <button
                    id="button_detail"
                    className="card__button"
                    onClick={() => handleDetailClick(tour.id)}
                  >
                    From{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0,
                    }).format(tour.gia_tour)}
                  </button>

                  <div className="card__button--heartAndCart">
                    <div className="card__wish">
                      <button
                        className="button__mini"
                        onClick={() => addWishList(tour.id)}
                      >
                        <i className="fa-regular fa-heart"></i>
                      </button>
                    </div>
                    <div className="card__wish">
                      <button className="button__mini">
                        <i className="fa-solid fa-cart-shopping"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {visibleTourCount < tourCount && (
            <div className="load-more-container">
              <button className="load-more-button" onClick={loadMoreTours}>
                Show More
              </button>
            </div>
          )}

          <div className="pagination"></div>
        </div>
        <ToastContainer />
      </div>
      <Footer />
    </div>
  );
};

export default ShowAll;
