package com.journeyjoy.service.impl;

import com.journeyjoy.config.PaymentConfig;
import com.journeyjoy.entity.Booking;
import com.journeyjoy.entity.Payment;
import com.journeyjoy.repository.BookingRepository;
import com.journeyjoy.repository.PaymentRepository;
import com.journeyjoy.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public String createOrder(HttpServletRequest request, long amount, String orderInfor, String urlReturn) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = PaymentConfig.getRandomNumber(8);
        String vnp_IpAddr = PaymentConfig.getIpAddress(request);
        String vnp_TmnCode = PaymentConfig.vnp_TmnCode;
        String orderType = "order-type";
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);

        // Log the amount before multiplying
        System.out.println("Amount before multiplying: " + amount);
        long calculatedAmount = amount * 100;
        // Log the amount after multiplying
        System.out.println("Amount after multiplying: " + calculatedAmount);

        vnp_Params.put("vnp_Amount", String.valueOf(calculatedAmount));
        vnp_Params.put("vnp_CurrCode", "VND");

        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", orderInfor);
        vnp_Params.put("vnp_OrderType", orderType);

        String locate = "vn";
        vnp_Params.put("vnp_Locale", locate);

        urlReturn += PaymentConfig.vnp_Returnurl;
        vnp_Params.put("vnp_ReturnUrl", urlReturn);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                try {
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    // Build query
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String salt = PaymentConfig.vnp_HashSecret;
        String vnp_SecureHash = PaymentConfig.hmacSHA512(salt, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = PaymentConfig.vnp_PayUrl + "?" + queryUrl;

        // Log the final payment URL
        System.out.println("Final payment URL: " + paymentUrl);

        return paymentUrl;
    }

    @Override
    @Transactional
    public int orderReturn(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = null;
            String fieldValue = null;
            try {
                fieldName = URLEncoder.encode(params.nextElement(), StandardCharsets.US_ASCII.toString());
                fieldValue = URLEncoder.encode(request.getParameter(fieldName), StandardCharsets.US_ASCII.toString());
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (fields.containsKey("vnp_SecureHashType")) {
            fields.remove("vnp_SecureHashType");
        }
        if (fields.containsKey("vnp_SecureHash")) {
            fields.remove("vnp_SecureHash");
        }
        String signValue = PaymentConfig.hashAllFields(fields);
        if (signValue.equals(vnp_SecureHash)) {
            String txnRef = request.getParameter("vnp_TxnRef");
            String transactionId = request.getParameter("vnp_TransactionNo");
            String paymentStatus = request.getParameter("vnp_ResponseCode");
            Long amount = Long.parseLong(request.getParameter("vnp_Amount")) / 100;
            String orderInfo = request.getParameter("vnp_OrderInfo");

            // Extract bookingId from orderInfo or another source if needed
            Long bookingId = extractBookingId(orderInfo);

            Payment payment = new Payment();
            payment.setTxnRef(txnRef);
            payment.setTransactionId(transactionId);
            payment.setAmount(amount);
            payment.setPaymentStatus(paymentStatus);
            payment.setBookingId(bookingId);
            payment.setOrderInfo(orderInfo);
            payment.setStatus(paymentStatus.equals("00") ? "SUCCESS" : "FAILED");
            payment.setCreatedAt(new Date());
            payment.setUpdatedAt(new Date());

            paymentRepository.save(payment);

            if ("00".equals(paymentStatus)) {
                Booking booking = bookingRepository.findById(bookingId)
                        .orElseThrow(() -> new RuntimeException("Booking not found"));
                booking.setTrang_thai(1);
                bookingRepository.save(booking);
                return 1;
            } else {
                return 0;
            }
        } else {
            return -1;
        }
    }

    private Long extractBookingId(String orderInfo) {
        // Implement the logic to extract bookingId from orderInfo
        // Example: if orderInfo is "BookingID: 22, UserID: 2, TourID: 5", extract bookingId = 22
        String[] parts = orderInfo.split(", ");
        for (String part : parts) {
            if (part.startsWith("BookingID:")) {
                return Long.parseLong(part.split(": ")[1]);
            }
        }
        return null;
    }
}
