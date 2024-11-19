import React from "react";
import { useNavigate } from "react-router-dom";
import "./ReComments.css";
import { URL_SERVER } from "../../server";

const ReComments = ({ tourDetail }) => {
  const navigate = useNavigate();

  // Access recommendedTours from tourDetail
  const recommendedTours = tourDetail?.recommendedTours || [];

  // Function to shuffle an array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Get a random subset of tours
  const getRandomTours = () => {
    const shuffledTours = shuffleArray([...recommendedTours]);
    return shuffledTours.slice(0, 4);
  };

  const randomTours = getRandomTours();

  const handleDetailClick = (id) => {
    navigate(`/tour/${id}`);
  };

  const formatCurrencyVND = (amount) => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <div className="recomments__root">
      <div className="recommended-tours">
        <h2>Recommended Tours</h2>
        <div className="recommended-tours-list">
          {randomTours.length > 0 ? (
            randomTours.map((recommendedTour) => (
              <div
                key={recommendedTour.id}
                className="recommended-tour"
                onClick={() => handleDetailClick(recommendedTour.id)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={`${URL_SERVER}/public/img/${recommendedTour.anhTour}`}
                  alt={recommendedTour.tenTour}
                />
                <h3>{recommendedTour.tenTour}</h3>
                <p>
                  Price:{" "}
                  <span>{formatCurrencyVND(recommendedTour.giaTour)}</span>
                </p>
              </div>
            ))
          ) : (
            <p>No recommended tours available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReComments;
