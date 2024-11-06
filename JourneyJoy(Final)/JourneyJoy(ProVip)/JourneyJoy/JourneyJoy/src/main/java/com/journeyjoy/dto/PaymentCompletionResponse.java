package com.journeyjoy.dto;

public class PaymentCompletionResponse {
    private int status; // 1 for success, 0 for failure
    private String orderId;
    private String totalPrice;
    private String paymentTime;
    private String transactionId;

    // Constructor, Getters, and Setters
    public PaymentCompletionResponse(int status, String orderId, String totalPrice, String paymentTime, String transactionId) {
        this.status = status;
        this.orderId = orderId;
        this.totalPrice = totalPrice;
        this.paymentTime = paymentTime;
        this.transactionId = transactionId;
    }

    // Getters and setters
    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(String totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getPaymentTime() {
        return paymentTime;
    }

    public void setPaymentTime(String paymentTime) {
        this.paymentTime = paymentTime;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }
}
