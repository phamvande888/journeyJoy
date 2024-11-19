import "./allTour.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { URL_SERVER } from "../server.js";
import { notifyError, notifySuccess, notifyWarn } from "../notify/Notify.js";

// Component fetch all tour in home page
const AllTour = ({ user }) => {
  const url = URL_SERVER; //link sever
  const navigate = useNavigate(); //navigate page
  const [tours, setTours] = useState([]); //state of list tour
  const [showAll, setShowAll] = useState(false); //state for show tour
  const [toursPerPage] = useState(8); //8 tour for a page

  // api fetch -----ALL TOUR
  const fetchAllTour = async () => {
    try {
      const response = await fetch(`${url}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
      });
      // if can't get data
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTours(data);
    } catch (error) {
      console.error("Error fetching tours:", error);
      notifyError(error);
    }
  };

  // use effect get tour
  useEffect(() => {
    fetchAllTour();
  }, []);

  //handle click load more then move to show all tour
  const handleLoadMore = () => {
    navigate("/alltour", { state: { user } });
  };

  // current tours
  const currentTours = showAll ? tours : tours.slice(0, toursPerPage);

  //handle click tour --> move to detail tour
  const handleDetailClick = (id) => {
    navigate(`/tour/${id}`);
  };

  //Add wishlist
  const addWishList = async (id) => {
    if (!user || !user.id) {
      notifyWarn("Please Login!");
      return;
    }

    const requestBody = {
      userId: user.id,
      tourId: id,
    };

    try {
      const response = await fetch(`${url}/wishlist/add`, {
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

  return (
    <div className="allTour_root" id="allTour">
      <div className="body__alltours">
        <h1>All Tours</h1>
        <div className="body__alltours--col">
          {currentTours.map((tour) => (
            <div className="card" key={tour.id}>
              {/* <img
                className="card__background"
                src={`${url}/public/img/${tour.anh_tour}`}
                alt={tour.nameTour}
                width="1920"
                height="2193"
              /> */}
              <img
                className="card__background"
                src={
                  tour.anh_tour && !tour.anh_tour.endsWith("/null")
                    ? `${URL_SERVER}/public/img/${tour.anh_tour}`
                    : "https://cuocsongdungnghia.com/wp-content/uploads/2018/05/loi-hinh-anh.jpg"
                }
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

        <div className="pagination">
          <button
            style={{
              borderRadius: "5px",
              marginBottom: "20px",
            }}
            id="buttonLoadMore"
            onClick={handleLoadMore}
            className="load-more-button"
          >
            {showAll ? "Show Less" : "Show All"}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AllTour;
