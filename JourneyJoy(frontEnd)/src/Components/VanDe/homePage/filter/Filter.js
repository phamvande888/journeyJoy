import "./Filter.css";

const Filter = () => {
  const handleSelectChange = (event) => {
    const targetId = event.target.value;
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="filter__root">
      <div className="select__tours">
        <select onChange={handleSelectChange}>
          {/* <option value="topTour">Top Tours</option> */}
          {/* <option value="newTour">New Tours</option> */}
          <option value="domestic">Domestic </option>
          <option value="foreign">Foreign </option>
          <option value="allTour">All Tours</option>
        </select>
      </div>

      {/* <div className="threeft">
        <div className="ft__price">
          <select>
            <option>Price</option>
            <option>0-10M</option>
            <option>10M-50M</option>
            <option>50M-xxxM</option>
          </select>
        </div>

        <div className="ft__time">
          <div className="date-input-container">
            <input
              type="text"
              className="date-input"
              placeholder="Departure"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) =>
                e.target.value === "" ? (e.target.type = "text") : null
              }
            />
          </div>
        </div>

        <div className="fl_destination">
          <input type="text" placeholder="Destination" />
        </div>

        <button>
          {" "}
          <i class="fa-solid fa-filter"></i> Filter
        </button>
      </div> */}
    </div>
  );
};

export default Filter;
