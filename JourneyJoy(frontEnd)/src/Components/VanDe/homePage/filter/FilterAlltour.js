import React, { useState, useEffect } from "react";
import "./Filter.css";
import { URL_SERVER } from "../../server";

const FilterAllTour = ({ onFilter }) => {
  const [startDate, setStartDate] = useState(""); // State for start date
  const [endDate, setEndDate] = useState(""); // State for end date
  const [minPrice, setMinPrice] = useState(""); // State for min price
  const [maxPrice, setMaxPrice] = useState(""); // State for max price
  const [diemDen, setDiemDen] = useState(""); // State for destination

  const [showFilters, setShowFilters] = useState(false); // State to show/hide filters
  const [showPriceFilters, setShowPriceFilters] = useState(false); // State to show/hide price filters
  const [showDateFilters, setShowDateFilters] = useState(false); // State to show/hide date filters
  const [showDestinationFilters, setShowDestinationFilters] = useState(false); // State to show/hide destination filter

  const [tourFilter, setTourFilter] = useState([]); // State

  //  --------------api FILTER TOUR -------------------
  const handleFilter = async () => {
    try {
      const response = await fetch(`${URL_SERVER}/api/tour/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          minPrice,
          maxPrice,
          diemDen,
        }),
      });
      // if can't get data
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json(); // data filter from api
      // console.log("-----FILTER ----------", data);
      setTourFilter(data);
      console.log("kết quả filter:", tourFilter);
      onFilter(data);
      // console.log(onFilter);
    } catch (error) {
      console.error("Error fetching the filtered tours:", error);
    }
  };

  // bật cái này đóng cái kia, liên tục cập nhật filter
  useEffect(() => {
    handleFilter();
  }, [minPrice, maxPrice, startDate, endDate, diemDen]);

  const handleShowPriceFilters = () => {
    setShowPriceFilters((prev) => !prev);
    setShowDateFilters(false);
    setShowDestinationFilters(false);
  };

  const handleShowDateFilters = () => {
    setShowDateFilters((prev) => !prev);
    setShowPriceFilters(false);
    setShowDestinationFilters(false);
  };

  const handleShowDestinationFilters = () => {
    setShowDestinationFilters((prev) => !prev);
    setShowPriceFilters(false);
    setShowDateFilters(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setStartDate("");
    setEndDate("");
    setDiemDen("");
    setShowFilters(false);
  };

  return (
    <div className="filter__root">
      <button
        className="btn_filter"
        onClick={() => setShowFilters((prev) => !prev)}
      >
        <i className="fa-solid fa-filter"></i> Filter
      </button>

      {showFilters && (
        <div className="threeft">
          <button onClick={handleShowPriceFilters}>
            <i className="fa-solid fa-dollar-sign"></i> Price
          </button>
          {showPriceFilters && (
            <div className="ft__price">
              <div className="fl_destination">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div className="fl_destination">
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          )}

          <button onClick={handleShowDateFilters}>
            <i className="fa-solid fa-calendar"></i> Date
          </button>
          {showDateFilters && (
            <div className="ft__time" style={{ display: "flex" }}>
              <div className="date-input-container">
                <input
                  type="date"
                  className="date-input"
                  placeholder="From"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="date-input-container">
                <input
                  type="date"
                  className="date-input"
                  placeholder="To"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}

          <button onClick={handleShowDestinationFilters}>
            <i className="fa-solid fa-location-dot"></i> Destination
          </button>
          {showDestinationFilters && (
            <div className="fl_destination fl_destination-a">
              <input
                type="text"
                placeholder="Destination"
                value={diemDen}
                onChange={(e) => setDiemDen(e.target.value)}
              />
            </div>
          )}
          <button className="btn_clear_all" onClick={clearAllFilters}>
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterAllTour;
