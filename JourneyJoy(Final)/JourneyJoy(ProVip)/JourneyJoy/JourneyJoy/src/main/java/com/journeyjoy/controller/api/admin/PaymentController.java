package com.journeyjoy.controller.api.admin;

import com.journeyjoy.dto.PaymentResponse;
import com.journeyjoy.dto.SubmitOrderRequest;
import com.journeyjoy.entity.Booking;
import com.journeyjoy.repository.BookingRepository;
import com.journeyjoy.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final BookingRepository bookingRepository; // Assuming you have this

    @Autowired
    public PaymentController(PaymentService paymentService, BookingRepository bookingRepository) {
        this.paymentService = paymentService;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping({"", "/"})
    public String home(){
        return "createOrder";
    }


    @PostMapping("/submitOrder")
    public ResponseEntity<PaymentResponse> submitOrder(@RequestBody SubmitOrderRequest submitOrderRequest, HttpServletRequest request) {
        Long bookingId = submitOrderRequest.getBookingId();
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));

        int orderTotal = Math.toIntExact(booking.getTong_tien());
        System.out.println("Order Total being sent to VNPAY: " + orderTotal);

        String orderInfo = "BookingID: " + booking.getId() + ", UserID: " + booking.getUser_id() + ", TourID: " + booking.getTour_id();
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        String vnpayUrl = paymentService.createOrder(request, orderTotal, orderInfo, baseUrl);

        return ResponseEntity.ok(new PaymentResponse(vnpayUrl));
    }


    @GetMapping("/vnpay-payment-return")
    public void paymentCompleted(HttpServletRequest request, HttpServletResponse response) {
        int paymentStatus = paymentService.orderReturn(request);

        String orderInfo = request.getParameter("vnp_OrderInfo");
        String paymentTime = request.getParameter("vnp_PayDate");
        String transactionId = request.getParameter("vnp_TransactionNo");
        String totalPrice = request.getParameter("vnp_Amount");

        // Chuyển đổi totalPrice sang định dạng dễ đọc hơn nếu cần thiết
        double formattedTotalPrice = Double.parseDouble(totalPrice) / 100;

        String redirectUrl = String.format(
                "http://localhost:3000/paymentResult?status=%d&orderInfo=%s&totalPrice=%.2f&paymentTime=%s&transactionId=%s",
                paymentStatus, orderInfo, formattedTotalPrice, paymentTime, transactionId
        );

        try {
            response.sendRedirect(redirectUrl);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}