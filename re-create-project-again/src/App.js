import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Components/VanDe/homePage/homePage";
import Login from "./Components/VanDe/login/login";
import Profile from "./Components/VanDe/profile/profile";
import TourDetail from "./Components/VanDe/tours/detail/tourDetail";
import Cart from "./Components/VanDe/homePage/Cart/Cart";
import Wishlist from "./Components/VanDe/homePage/wishList/WishList";
import Booking from "./Components/VanDe/homePage/ticket/Booking";
import ListTour from "./Components/Quang/ListTour/ListTour";
import AdminLogin from "./Components/DiepThanh/Admin/login";
import PostedList from "./Components/Quang/PostedList/PostedList";
import User from "./Components/Quang/UserAccount/User";
import Comment from "./Components/Quang/Comment/Comment";
import App2 from "./App2";
import PersonalProfile from "./Components/Quang/profile/ProfileAdminSite";
import ListTourBookingModal from "./Components/Quang/ListTour/ListTourBookingModal";
import firebase from "firebase/app";
import "firebase/auth";
import SearchBooking from "./Components/Quang/booking/SearchBooking";
import Payment from "./Components/VanDe/tours/payment/Payment";
import OTP from "./Components/Quang/OTPVerify/OTP";
import CreateTourModal from "./Components/Quang/ListTour/CreateTour";
import Contact from "./Components/VanDe/contact/Contact";
import ShowAll from "./Components/VanDe/tours/showAll";
import PaymentResult from "./Components/VanDe/tours/payment/PaymentResult";
import PostDetail from "./Components/Quang/PostListCustomerPage/PostDetail";
import ContactList from "./Components/DiepThanh/Contacts/contact";
import Statistics from "./Components/DiepThanh/Statistics/statistics";
import LanguageSwitcher from "./Components/DiepThanh/LanguageSwitcher/LanguageSwitcher";
import UpdatePayment from "./Components/VanDe/tours/payment/UpDatePayment";
import PostListCustomerPage from "./Components/Quang/PostListCustomerPage/PostListCustomerPage";

//toast
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/tourguide/login" element={<AdminLogin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tour/:id" element={<TourDetail />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/tour/:id/payments" element={<Payment />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/admin/createtour" element={<CreateTourModal />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/alltour" element={<ShowAll />} />
          <Route path="/admin/statistics" element={<Statistics />} />
          <Route path="/tourguide/contacts" element={<ContactList />} />
          <Route
            path="/tourguide/listtourbooked"
            element={<ListTourBookingModal />}
          />
          <Route path="/paymentResult" element={<PaymentResult />} />
          <Route
            path="/tourguide/tour/:id/bookings"
            element={<ListTourBookingModal />}
          />
          <Route path="/news" element={<PostListCustomerPage />} />
          {["/admin", "/tourguide"].map((path, index) => {
            return <Route path={path} element={<App2 />} key={index} />;
          })}
          {/* {["/admin/sidebar", "/tourguide/sidebar"].map((path, index) => {
            return <Route path={path} element={<Sidebar />} key={index} />;
          })} */}
          {["/admin/listtour/*", "/tourguide/listtour/*"].map((path, index) => {
            return <Route path={path} element={<ListTour />} key={index} />;
          })}

          {["/admin/tourbooked/*", "/tourguide/tourbooked/*"].map(
            (path, index) => {
              return (
                <Route path={path} element={<SearchBooking />} key={index} />
              );
            }
          )}
          {["/admin/postedlist", "/tourguide/postedlist"].map((path, index) => {
            return <Route path={path} element={<PostedList />} key={index} />;
          })}

          {["/admin/userlist", "/tourguide/userlist"].map((path, index) => {
            return <Route path={path} element={<User />} key={index} />;
          })}
          {/* {[
            "/admin/recommendtourbyprice",
            "/tourguide/recommendtourbyprice",
          ].map((path, index) => {
            return (
              <Route path={path} element={<ViewRecommendTour />} key={index} />
            );
          })} */}
          {["/admin/commentManagement", "/tourguide/commentManagement"].map(
            (path, index) => {
              return <Route path={path} element={<Comment />} key={index} />;
            }
          )}
          {["/admin/profile", "/tourguide/profile"].map((path, index) => {
            return (
              <Route path={path} element={<PersonalProfile />} key={index} />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
