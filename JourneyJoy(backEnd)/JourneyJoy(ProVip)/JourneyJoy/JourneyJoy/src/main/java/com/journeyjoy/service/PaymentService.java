package com.journeyjoy.service;

import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {

    String createOrder(HttpServletRequest request, long amount, String orderInfor, String urlReturn);

    int orderReturn(HttpServletRequest request);

}