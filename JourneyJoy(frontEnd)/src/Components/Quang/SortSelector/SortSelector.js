import React, { useEffect } from "react";
import comments from "../../../DemoData/comments.json";

export default function SortSelector({ setSortedComments }) {
  const [sortOrder, setSortOrder] = React.useState("newest");

  useEffect(() => {
    sortComments(sortOrder);
  }, [sortOrder]);

  const sortComments = (order) => {
    const sorted = [...comments].sort((a, b) => {
      const dateA = new Date(
        a.dateAndTime.split(" ")[1].split("/").reverse().join("-") +
          "T" +
          a.dateAndTime.split(" ")[0]
      );
      const dateB = new Date(
        b.dateAndTime.split(" ")[1].split("/").reverse().join("-") +
          "T" +
          b.dateAndTime.split(" ")[0]
      );
      return order === "newest" ? dateB - dateA : dateA - dateB;
    });
    setSortedComments(sorted);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <div className="mb-3 w-25">
      <label htmlFor="sortSelect" className="form-label">
        Sort By:
      </label>
      <select
        className="form-select"
        id="sortSelect"
        value={sortOrder}
        onChange={handleSortChange}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  );
}
