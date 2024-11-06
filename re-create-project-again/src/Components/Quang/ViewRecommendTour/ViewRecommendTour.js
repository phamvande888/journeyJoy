import React, { useEffect, useState } from "react";
import SearchByPrice from "../SearchByPrice/SearchByPrice";
// import ResultFilltered from "../ShowResultFiltered/ResultFiltered";
import AllTour from "../../VanDe/tours/allTour.js";
import commonAPI from "../../CommonAPI/commonAPI.js";
function ViewRecommendTour() {
  const [tours, setTours] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch(
        //   "https://wise-flea-accurate.ngrok-free.app/tour/trong-nuoc",
        //   {
        //     headers: {
        //       "Content-type": "application/json",
        //       "ngrok-skip-browser-warning": "69420",
        //     },
        //   }
        // );
        // const result = await response.json();
        // setTours(result);
        // setFilteredProducts(result);
        const data = await commonAPI.get("/tour/trong-nuoc");
        // console.log("Get respone data: ", data);
        setTours(data);
        setFilteredProducts(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  const handleFilter = (min, max) => {
    const filtered = tours.filter(
      (tour) => tour.gia_tour >= min && tour.gia_tour <= max
    );
    setFilteredProducts(filtered);
    console.log("line 43: ", filtered);
  };
  return (
    <div>
      <h1>TOUR IN RANGE</h1>
      <SearchByPrice onFilter={handleFilter} />
      {/* <ResultFilltered products={filteredProducts} /> */}
      <AllTour products={filteredProducts} />
      {console.log(filteredProducts)}
    </div>
  );
}

export default ViewRecommendTour;
