package com.journeyjoy.dto;

public class PaymentResponse {
    private String url;

    public PaymentResponse(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}