package com.exocart.exocart.service;

import com.exocart.exocart.dto.request.ProductRequestDto;
import com.exocart.exocart.dto.response.ProductResponseDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {

    ProductResponseDto addProduct(ProductRequestDto requestDto);

    List<ProductResponseDto> getAllProducts();

    ProductResponseDto getProductById(Long id);

    ProductResponseDto updateProduct(
            Long id,
            ProductRequestDto requestDto
    );

    void deleteProduct(Long id);

    Page<ProductResponseDto> getFilteredProducts(
            String keyword,
            String category,
            Double minPrice,
            Double maxPrice,
            Double rating,
            Boolean stock,
            int page,
            int size,
            String sort
    );
}