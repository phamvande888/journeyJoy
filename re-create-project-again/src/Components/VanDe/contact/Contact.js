import React, { useState, useRef } from "react";
import "./Contact.css";
import "./breakpoint.css";
import Footer from "../homePage/footer/footer";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    emailSubject: "",
    message: "",
  });

  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_gu14itc", // replace with your EmailJS service ID
        "template_ayux0el", // replace with your EmailJS template ID
        {
          from_name: formData.fullName,
          from_email: formData.email,
          to_name: "Admin", // you can set this to anything you like
          to_email: "phamvande1805@gmail.com", // admin email
          subject: formData.emailSubject,
          message: formData.message,
          mobileNumber: formData.mobileNumber,
        },
        "XcGS9AmegEXOCdeuB" // replace with your EmailJS user ID
      )
      .then((response) => {
        console.log("Email sent successfully!", response.status, response.text);
        setStatusMessage("Email sent successfully!");
      })
      .catch((err) => {
        console.error("Failed to send email. Error:", err);
        setStatusMessage("Failed to send email.");
      });
  };

  return (
    <div>
      <div className="cart" id="contact_root">
        <header className="header">
          <a href="/" className="logo">
            Journey<span>JOY</span>
          </a>
          <i className="bx bx-menu" id="menu-icon"></i>
          <nav className="navbar">
            <a href="#home" className="active">
              Home
            </a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <section className="home" id="home">
          <div className="home-content">
            <h3>Hello, We are...</h3>
            <h1>Development Team</h1>
            <h3>
              Contact here<span className="multiple-text"></span>
            </h3>
          </div>
          <div className="home-img">
            <img src="home1.png" alt="home" />
          </div>
        </section>

        <section className="about" id="about">
          <div className="about-img">
            <img src="about1.png" alt="about" />
          </div>
          <div className="about-content">
            <h2 className="heading">
              About <span>Us</span>
            </h2>
            <p>
              Innovative Freelance Front-End Developer with 3+ Years at Upwork
              Seeking New Challenges | Bachelor of Informatics Grad | Proficient
              in HTML, CSS, JS, PHP, MongoDB, Express.js, React, Node.js | Eager
              to Bring Problem-Solving and Critical Thinking Skills to Your
              Team.
            </p>
          </div>
        </section>

        <section className="services" id="services">
          <h2 className="heading">
            Our <span>Services</span>
          </h2>
          <div className="services-container">
            <div className="services-box">
              <i className="bx bx-code-alt"></i>
              <h3>Front End</h3>
              <p>
                Welcome to our front-end development section. Here, we focus on
                creating visually appealing and user-friendly interfaces that
                enhance the user experience.
              </p>
              <a href="#" className="btn">
                Read More
              </a>
            </div>
            <div className="services-box">
              <i className="bx bxs-paint"></i>
              <h3>Graphic Design</h3>
              <p>
                Welcome to our Graphic Design section. In this area, we explore
                the art of visual communication, using typography, imagery, and
                color to convey messages and create captivating designs.
              </p>
              <a href="#" className="btn">
                Read More
              </a>
            </div>
            <div className="services-box">
              <i className="bx bx-data"></i>
              <h3>Back End</h3>
              <p>
                Welcome to our Back End development section. This area focuses
                on server-side logic, database management, and ensuring the
                smooth functionality of web applications behind the scenes.
              </p>
              <a href="#" className="btn">
                Read More
              </a>
            </div>
          </div>
        </section>

        <section className="contact contacttt" id="contact">
          <h2 className="heading">
            Contact <span>Us</span>
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <input
                type="number"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="emailSubject"
                placeholder="Email Subject"
                value={formData.emailSubject}
                onChange={handleChange}
                required
              />
            </div>
            <textarea
              name="message"
              cols="30"
              rows="10"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <input type="submit" value="Send Message" className="btn" />
          </form>
          {statusMessage && (
            <p style={{ textAlign: "center" }}>{statusMessage}</p>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
