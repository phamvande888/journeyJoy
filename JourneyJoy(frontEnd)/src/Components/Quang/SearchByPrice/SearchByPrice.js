import clsx from "clsx";
import style from "./StyleSearchByPrice.module.css";
import { useState } from "react";
export default function SearchByPrice({ onFilter }) {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000000);

  const handleFilter = () => {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    onFilter(min, max);
  };
  return (
    <div className={style.parentDiv}>
      <h3 className={style.heading}>Price</h3>
      <div>
        <p>
          The median activity price is{" "}
          {average(minPrice, maxPrice).toLocaleString()}
        </p>
        <div>
          <div className={style.divLabel}>
            <div className={clsx(style.label, style.labelMinPrice)}>
              <label>
                <h5 className={style.textPrice}>Min Price</h5>
                <input
                  className={style.inputPrice}
                  type="number"
                  value={minPrice.toLocaleString()}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </label>
            </div>
            <div className={clsx(style.label)}>
              <label>
                <h5 className={style.textPrice}>Max Price</h5>
                <input
                  className={style.inputPrice}
                  type="number"
                  value={maxPrice.toLocaleString()}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </label>
            </div>
          </div>
          <div className={style.message}>Display in Vietnam Dong</div>
        </div>
      </div>
      <br />
      <button
        className="rounded-2 p-1 bg-primary text-white border-0"
        onClick={handleFilter}
      >
        Show Result
      </button>
    </div>
  );
}
function average(a, b) {
  // force the input as numbers *1
  return (a * 1 + b * 1) / 2;
}
