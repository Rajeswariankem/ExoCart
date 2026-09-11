package com.exocart.exocart.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDto {

    private Long id;

    private String name;

    private String description;

    private Double price;

    private Integer stock;

    private String imageUrl;

    private String category;

    private Double rating;

    private String unit;
}