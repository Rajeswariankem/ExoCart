package com.exocart.exocart.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemRequestDto {

    private Long productId;

    private String productName;

    private Double price;

    private Integer quantity;
}