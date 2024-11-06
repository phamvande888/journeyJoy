// import "../allTour.css";
// import { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom"; // Import useHistory
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import tours from "../tours.json";

// const TopTours = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const navigate = useNavigate(); // Use useNavigate for navigation

//   const toursPerPage = 8;
//   const indexOfLastTour = currentPage * toursPerPage;
//   const indexOfFirstTour = indexOfLastTour - toursPerPage;
//   const currentTours = tours.slice(indexOfFirstTour, indexOfLastTour);
//   const totalPages = Math.ceil(tours.length / toursPerPage);

//   const handleClick = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleDetailClick = (id) => {
//     navigate(`/tour/${id}`);
//   };

//   // call API get all tour
//   // useEffect(() => {
//   //   fetch("https://jsonplaceholder.typicode.com/posts")
//   //     .then((res) => {
//   //       return res.json();
//   //     })
//   //     .then((data) => {
//   //       console.log("lay duoc data");
//   //       console.log(data);
//   //     });
//   // }, []);

//   return (
//     <div className="allTour_root" id="topTour">
//       <div className="body__alltours">
//         <h1>TOP Tours</h1>
//         <div className="body__alltours--col">
//           {currentTours.map((tour) => (
//             <div className="card" key={tour.id}>
//               <img
//                 className="card__background"
//                 src={tour.src}
//                 alt={tour.nameTour}
//                 width="1920"
//                 height="2193"
//               />
//               <div className="card__content | flow">
//                 <div className="card__content--container | flow">
//                   <h2 className="card__title">{tour.nameTour}</h2>
//                   <p className="card__description">{tour.description}</p>
//                 </div>
//                 <button
//                   id="button_detail"
//                   className="card__button"
//                   onClick={() => handleDetailClick(tour.id)}
//                 >
//                   From ${tour.price}
//                 </button>

//                 <div className="card__button--heartAndCart">
//                   <div className="card__wish">
//                     <button className="button__mini">
//                       <i className="fa-regular fa-heart"></i>
//                     </button>
//                   </div>
//                   <div className="card__wish">
//                     <button className="button__mini">
//                       <i className="fa-solid fa-cart-shopping"></i>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="pagination">
//           {[...Array(totalPages)].map((_, index) => (
//             <button
//               id="buttonpaging"
//               key={index}
//               onClick={() => handleClick(index + 1)}
//               className={currentPage === index + 1 ? "active" : ""}
//             >
//               {index + 1}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopTours;
