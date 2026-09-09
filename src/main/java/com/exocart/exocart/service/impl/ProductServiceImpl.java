package com.exocart.exocart.service.impl;

import com.exocart.exocart.dto.request.ProductRequestDto;
import com.exocart.exocart.dto.response.ProductResponseDto;
import com.exocart.exocart.entity.Product;
import com.exocart.exocart.repository.ProductRepository;
import com.exocart.exocart.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    // CREATE
    @Override
    public ProductResponseDto addProduct(ProductRequestDto requestDto) {

        Product product = new Product();

        product.setName(requestDto.getName());
        product.setDescription(requestDto.getDescription());
        product.setPrice(requestDto.getPrice());
        product.setStock(requestDto.getStock());
        product.setImageUrl(requestDto.getImageUrl());
        product.setCategory(requestDto.getCategory());
        product.setRating(requestDto.getRating());
        product.setUnit(requestDto.getUnit());

        Product savedProduct = productRepository.save(product);

        return convertToDto(savedProduct);
    }

    // GET ALL
    @Override
    public List<ProductResponseDto> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    // GET BY ID
    @Override
    public ProductResponseDto getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with id: " + id
                        )
                );

        return convertToDto(product);
    }

    // UPDATE
    @Override
    public ProductResponseDto updateProduct(
            Long id,
            ProductRequestDto requestDto
    ) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with id: " + id
                        )
                );

        product.setName(requestDto.getName());
        product.setDescription(requestDto.getDescription());
        product.setPrice(requestDto.getPrice());
        product.setStock(requestDto.getStock());
        product.setImageUrl(requestDto.getImageUrl());
        product.setCategory(requestDto.getCategory());
        product.setRating(requestDto.getRating());
        product.setUnit(requestDto.getUnit());

        Product updatedProduct =
                productRepository.save(product);

        return convertToDto(updatedProduct);
    }

    // DELETE
    @Override
    public void deleteProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with id: " + id
                        )
                );

        productRepository.delete(product);
    }

    // SEARCH + FILTER + SORT + PAGINATION
    @Override
    public Page<ProductResponseDto> getFilteredProducts(
            String keyword,
            String category,
            Double minPrice,
            Double maxPrice,
            Double rating,
            Boolean stock,
            int page,
            int size,
            String sort
    ) {

        if (page < 0) {
            page = 0;
        }

        if (size <= 0) {
            size = 8;
        }

        String sortField = "id";
        Sort.Direction direction = Sort.Direction.DESC;

        if (sort != null && !sort.isBlank()) {

            String[] sortParts = sort.split(",");

            if (sortParts.length > 0) {

                switch (sortParts[0]) {

                    case "price":
                    case "rating":
                    case "name":
                    case "id":
                        sortField = sortParts[0];
                        break;

                    default:
                        sortField = "id";
                }
            }

            if (sortParts.length > 1 &&
                    sortParts[1].equalsIgnoreCase("asc")) {

                direction = Sort.Direction.ASC;
            }
        }

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by(direction, sortField)
                );

        Page<Product> products =
                productRepository.filterProducts(
                        keyword,
                        category,
                        minPrice,
                        maxPrice,
                        rating,
                        stock,
                        pageable
                );

        return products.map(this::convertToDto);
    }

    // ENTITY → DTO
    private ProductResponseDto convertToDto(Product product) {

        return new ProductResponseDto(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getImageUrl(),
                product.getCategory(),
                product.getRating(),
                product.getUnit()
        );
    }
}