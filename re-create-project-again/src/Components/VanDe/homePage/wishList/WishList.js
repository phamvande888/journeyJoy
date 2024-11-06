import React, { useState, useEffect } from "react";
import "./WishList.css";
import Header from "../header/header";
import Footer from "../footer/footer";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifySuccess, notifyError, notifyInfo } from "../../notify/Notify";
import { URL_SERVER } from "../../server";

const WishList = () => {
  const url = URL_SERVER;
  const navigate = useNavigate(); // navigate page
  const [user, setUser] = useState(null); // data user
  const [wishListItems, setWishListItems] = useState([]); //set data Wishlist
  const [loading, setLoading] = useState(true); // state loading

  //---------------------- API  user data ------------------------
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
        console.log("Error data:", errorData);
        return;
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // ---------------------------API view wishlist-----------------
  useEffect(() => {
    if (!user || !user.id) return;

    const fetchWishListItems = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${url}/wishlist/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch wishlist items");
        }

        const data = await response.json();
        setWishListItems(data);
      } catch (error) {
        // notifyError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishListItems();
  }, [user]);

  // --------------------------REMOVE WISHLIST-------------------------------
  const handleRemoveItem = async (itemId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      notifyError("User not logged in!");
      return;
    }

    const requestBody = {
      userId: user.id,
      tourId: itemId,
    };

    try {
      const response = await fetch(`${url}/wishlist/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      setWishListItems(wishListItems.filter((item) => item.id !== itemId));
      notifySuccess("Item removed successfully!");
    } catch (error) {
      notifyError(error.message);
    }
  };

  const handleDetailClick = (id) => {
    navigate(`/tour/${id}`);
    notifyInfo("Navigating to tour details!");
  };

  const handleAddlist = () => {
    navigate(`/`);
    notifySuccess("Navigating to homepage!");
  };

  return (
    <div>
      <Header />
      <div className="cart" id="wishlist__root">
        <div className="titleh2">
          <h2>Your favorite places</h2>
        </div>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: "0.5",
              paddingTop: "100px",
            }}
          >
            <p>Loading your wishlist...</p>
          </div>
        ) : wishListItems.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: "0.5",
              paddingTop: "100px",
            }}
          >
            <i
              className="fa-solid fa-heart-circle-plus"
              style={{ fontSize: "5rem" }}
              onClick={handleAddlist}
            ></i>
            <p>Create your own list of favorites</p>
          </div>
        ) : (
          <div className="cart__body">
            <ul>
              {wishListItems.map((item, index) => (
                <li key={item.id} className="cart-item">
                  <div className="serial-number">
                    <i
                      class="fa-brands fa-gratipay"
                      style={{ paddingLeft: "20px" }}
                    ></i>{" "}
                    {index + 1}
                  </div>{" "}
                  {/* Add serial number */}
                  <div
                    className="item-details"
                    onClick={() => handleDetailClick(item.id)}
                  >
                    <img
                      src={`${url}/public/img/${item.anh_tour}`}
                      style={{ width: "100px" }}
                      alt={item.name}
                    />
                    <span className="item-name">{item.ten_tour}</span>
                  </div>
                  <div>
                    <button
                      className="remove-item-button infor btn-hover"
                      onClick={() => handleDetailClick(item.id)}
                    >
                      <i className="fa-solid fa-circle-info"></i>
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="remove-item-button btn-hover"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default WishList;
