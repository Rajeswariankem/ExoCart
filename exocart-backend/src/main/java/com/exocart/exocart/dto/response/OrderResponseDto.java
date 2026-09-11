package com.exocart.exocart.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDto {

    private Long orderId;

    private String customerName;

    private String phoneNumber;

    private String deliveryAddress;

    private String city;

    private String pincode;

    private Double totalAmount;

    private String paymentMethod;

    private String paymentStatus;

    private String orderStatus;

    private LocalDateTime orderDate;
}