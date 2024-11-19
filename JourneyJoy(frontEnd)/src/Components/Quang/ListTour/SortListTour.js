import React, { useState } from "react";
import style from "../booking/sortBooking.module.css";
import commonAPI from "../../CommonAPI/commonAPI";
export default function SortListTour({ onSort }) {
  const [sortOption, setSortOption] = useState("");
  const handleSortChange = async (event) => {
    try {
      const selectedSortOption = event.target.value;
      const data = await commonAPI.get(`${selectedSortOption}`);
      setSortOption(data.content);
      onSort(data.content);
      console.log("SORT TOUR BY TRONG NUOC, NGOAI NUOC", data.content);
    } catch (error) {
      console.log("ERROR SORT TOUR BY TRONG NUOC, NGOAI NUOC", error);
    }
  };
  return (
    <div className={style.div}>
      <select
        value={sortOption}
        onChange={handleSortChange}
        className={style.SortBooking}
      >
        <option value="" selected disabled hidden>
          Filter...
        </option>
        <option value="/admin/tour">Reset</option>
        <option value="/admin/tour-trongnuoc">Tour trong nước</option>
        <option value="/admin/tour-ngoainuoc">Tour ngoài nước</option>
      </select>
    </div>
  );
}
