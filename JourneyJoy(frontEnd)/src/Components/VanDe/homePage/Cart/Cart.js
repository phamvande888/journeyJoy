import React, { useState } from "react";
import "./Cart.css";
import Header from "../header/header";
import Footer from "../footer/footer";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Cart = () => {
  const navigate = useNavigate(); // Use useNavigate for navigation

  const initialCartItems = [
    { id: 1, name: "Product 1", price: 100, quantity: 1, src: "tour1.jpg" },
    { id: 2, name: "Product 2", price: 200, quantity: 2, src: "tour2.jpg" },
    { id: 3, name: "Product 3", price: 150, quantity: 1, src: "tour3.jpg" },
  ];

  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const handleIncrease = (itemId) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (itemId) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleCheckout = () => {
    alert("Proceeding to checkout");
    // Implement your checkout logic here
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleDetailClick = (id) => {
    navigate(`/tour/${id}`);
  };

  return (
    <div>
      <Header />

      <div className="cart" id="cart__root">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            <ul>
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="item-details">
                    <img
                      src={item.src}
                      style={{ width: "100px" }}
                      alt={item.name}
                    />
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">${item.price}</span>
                    <div className="twobtn">
                      <button
                        className="decrease"
                        onClick={() => handleDecrease(item.id)}
                      >
                        -
                      </button>
                      <span className="item-quantity">
                        {item.quantity}{" "}
                        <i className="fa-solid fa-person numberOfPeople__icon"></i>
                      </span>
                      <button
                        className="increase"
                        onClick={() => handleIncrease(item.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <button
                      className="remove-item-button infor btn-hover"
                      onClick={() => {
                        handleDetailClick(item.id);
                      }}
                    >
                      <i class="fa-solid fa-circle-info"></i>
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="remove-item-button btn-hover"
                    >
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <span>Total: ${getTotalPrice()}</span>
            </div>
            <button onClick={handleCheckout} className="checkout-button">
              Checkout
            </button>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
