package com.exocart.exocart.dto.request;

import lombok.Data;

@Data
public class ProductRequestDto {

    private String name;

    private String description;

    private Double price;

    private Integer stock;

    private String imageUrl;

    private String category;

    private Double rating;

    private String unit;
}