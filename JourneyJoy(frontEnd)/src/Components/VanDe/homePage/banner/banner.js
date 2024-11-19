import React from "react";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure you import Bootstrap CSS
import "./banner.css";

const banners = [
  { id: 0, name: "banner0", src: "banner4.jpg" },
  { id: 1, name: "banner1", src: "banner11.jpg" },
  { id: 2, name: "banner2", src: "banner5.jpg" },
];

const Banner = () => {
  return (
    <div className="banner__root">
      <div className="banner">
        <Carousel>
          {banners.map((banner) => (
            <Carousel.Item key={banner.id}>
              <img src={banner.src} alt="First slide" />
              <Carousel.Caption>
                {/* <div className="banner_h1">
                  <h1>create your own memories in ...</h1>
                  <div className="banner_h1--content">
                    <i className="fa-solid fa-arrow-down"></i>
                    <a href="#allTour">
                      <p>Book tour now</p>
                    </a>
                  </div>
                </div> */}
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
        {/* <div className="banner__root">
          <div className="banner">
            <img src="banner.jpg" alt="Denim Jeans" />
            <div className="banner_h1">
              <h1>create your own memories in ...</h1>
              <div className="banner_h1--content">
                <i className="fa-solid fa-arrow-down"></i>
                <a href="#allTour">
                  <p>Book tour now</p>
                </a>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Banner;
