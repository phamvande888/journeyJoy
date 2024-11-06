import "./footer.css";

const Footer = () => {
  return (
    <div className="footer__root">
      <div className="footer">
        <div className="footer__conntent">
          <div class="footer-left">
            {/* <img src="./logo1.png"></img> */}
            <p className="footer-left-content">Journey Joy © 2024</p>
          </div>

          <div class="footer-center">
            <div className="footer-center-item">
              <i class="fa fa-map-marker"></i>
              <p>Ninh Kieu, Can Tho, Viet Nam</p>
            </div>

            <div className="footer-center-item">
              <i class="fa fa-phone"></i>
              <p>08 777 34803</p>
            </div>

            <div className="footer-center-item">
              <i class="fa fa-envelope"></i>
              <p>Fujourneyjoy@gmail.com</p>
            </div>
          </div>

          {/* <div class="footer-right">
          <div class="footer-icons">
            <a href="#">
              <i class="fa-brands fa-facebook"></i>
            </a>
            <a href="#">
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="#">
              <i class="fa-brands fa-twitter"></i>
            </a>
          </div>
        </div> */}
        </div>

        <div className="footer_bg_one"></div>
        <div className="footer_bg_two"></div>
      </div>
    </div>
  );
};

export default Footer;
