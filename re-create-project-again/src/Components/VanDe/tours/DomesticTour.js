import "./allTour.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWarn,
} from "../notify/Notify";
//server URL https://mustang-whole-mentally.ngrok-free.app
import { URL_SERVER } from "../server.js";

const Domestic = ({ user }) => {
  const url = URL_SERVER; //sever
  const navigate = useNavigate(); //go to next page
  const [tours, setTours] = useState([]); //stored data API fetch all tour

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 8;
  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = tours.slice(indexOfFirstTour, indexOfLastTour);
  const totalPages = Math.ceil(tours.length / toursPerPage);

  //
  const dtWishlist = localStorage.getItem("wishListItems");

  // click pagination
  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //move to detail tour
  const handleDetailClick = (id) => {
    navigate(`/tour/${id}`);
  };

  // -------------- API all tour ------------------
  useEffect(() => {
    const fetchAllTour = async () => {
      try {
        const response = await fetch(
          `${url}/tour/trong-nuoc`, //server Lam
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
        setTours(data);
        console.log(tours);
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    fetchAllTour();
  }, []);

  // ------------------Add wishlist----------------
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

  // handle text
  const truncateText = (text, maxLines, lineHeight = 1.2) => {
    const maxHeight = maxLines * lineHeight * 22; // Assuming 16px font-size
    const tempElement = document.createElement("div");
    tempElement.style.position = "absolute";
    tempElement.style.visibility = "hidden";
    tempElement.style.width = "420px"; // Adjust to match your actual container width
    tempElement.style.fontSize = "16px"; // Adjust to match your actual font-size
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
  //handle title
  const truncateTextTiitle = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  // ----------------------

  return (
    <div className="allTour_root" id="domestic">
      <div className="body__alltours">
        <h1>Domestic Tours</h1>
        <div className="body__alltours--col">
          {currentTours.map((tour) => (
            <div className="card" key={tour.id}>
              <div className="addwl">
                <div className="">
                  <div className="button__mini">
                    {/* <i class="fa-solid fa-heart"></i> */}
                    {/* <i
                      onClick={() => addWishList(tour.id)}
                      className="fa-regular fa-heart"
                    ></i> */}
                  </div>
                </div>
              </div>
              <img
                className="card__background"
                src={`${url}/public/img/${tour.anh_tour}`}
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
                      <i
                        onClick={() => handleDetailClick(tour.id)}
                        className="fa-solid fa-cart-shopping"
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          {[...Array(totalPages)].map((_, index) => (
            <button
              id="buttonpaging"
              key={index}
              onClick={() => handleClick(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Domestic;
