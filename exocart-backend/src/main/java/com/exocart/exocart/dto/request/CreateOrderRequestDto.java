package com.exocart.exocart.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequestDto {

    private String customerName;

    private String phoneNumber;

    private String deliveryAddress;

    private String city;

    private String pincode;

    private Double totalAmount;

    private String paymentMethod;

    private List<OrderItemRequestDto> items;
}