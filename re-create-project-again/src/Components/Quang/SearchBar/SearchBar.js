import React, { useState } from "react";
import style from "./SearchBar.module.css";
import commonAPI from "../../CommonAPI/commonAPI";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();
    console.log("VALUE SEARCH", query);
    try {
      console.log("BEFORE SEARCH", query);
      const ten_tour = query;
      const response = await commonAPI.post(`/search`, { ten_tour });
      console.log("MESSAGE SUCCESS SEARCH", response);
      // Pass the response data to onSearch
      onSearch(response);
    } catch (error) {
      console.log("ERROR SEARCH", error);
    }
  };

  return (
    <form onSubmit={handleSearch} className={style.searchBar}>
      <input
        type="text"
        placeholder="Search for a tour..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={style.searchInput}
      />
      <button type="submit" className={style.searchButton}>
        {/* {query === "" ? "Reset" : "Search"} */}
        Search
      </button>
    </form>
  );
}
