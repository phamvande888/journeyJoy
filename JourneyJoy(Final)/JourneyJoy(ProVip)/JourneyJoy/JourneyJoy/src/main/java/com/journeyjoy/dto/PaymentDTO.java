package com.journeyjoy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long bookingId;
    private String transactionId;
    private Long amount;
    private String status;
    private String orderInfo;
    private String txnRef;
    private String paymentStatus;

}