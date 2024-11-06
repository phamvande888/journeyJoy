import React, { useState } from "react";
import style from "./sortBooking.module.css";
export default function SortBooking({ onSort }) {
  const [sortOption, setSortOption] = useState("");
  const handleSortChange = (event) => {
    const selectedSortOption = event.target.value;

    setSortOption(selectedSortOption);
    onSort(selectedSortOption);
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
        <option value="so_luong_nguoi">Số Lượng Hành Khách</option>
        <option value="trang_thai">Trạng Thái</option>
        <option value="ngay_khoi_hanh">Ngày Khởi Hành</option>
        <option value="booking_at">Booking At</option>
        <option value="tong_tien">Tổng Tiền</option>
      </select>
    </div>
  );
}
