package com.exocart.exocart.controller;

import com.exocart.exocart.dto.request.ProductRequestDto;
import com.exocart.exocart.dto.response.ProductResponseDto;
import com.exocart.exocart.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    // CREATE PRODUCT
    @PostMapping
    public ResponseEntity<ProductResponseDto> addProduct(
            @RequestBody ProductRequestDto requestDto
    ) {

        ProductResponseDto response =
                productService.addProduct(requestDto);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    // GET ALL PRODUCTS
    @GetMapping
    public ResponseEntity<List<ProductResponseDto>> getAllProducts() {

        return ResponseEntity.ok(
                productService.getAllProducts()
        );
    }

    // GET PRODUCT BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDto> getProductById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                productService.getProductById(id)
        );
    }

    // UPDATE PRODUCT
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDto> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequestDto requestDto
    ) {

        return ResponseEntity.ok(
                productService.updateProduct(
                        id,
                        requestDto
                )
        );
    }

    // DELETE PRODUCT
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable Long id
    ) {

        productService.deleteProduct(id);

        return ResponseEntity.ok(
                "Product deleted successfully"
        );
    }

    // SEARCH + FILTER + SORT + PAGINATION
    @GetMapping("/filter")
    public ResponseEntity<Page<ProductResponseDto>> filterProducts(

            @RequestParam(required = false)
            String keyword,

            @RequestParam(required = false)
            String category,

            @RequestParam(required = false)
            Double minPrice,

            @RequestParam(required = false)
            Double maxPrice,

            @RequestParam(required = false)
            Double rating,

            @RequestParam(required = false)
            Boolean stock,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "8")
            int size,

            @RequestParam(defaultValue = "id,desc")
            String sort
    ) {

        Page<ProductResponseDto> products =
                productService.getFilteredProducts(
                        keyword,
                        category,
                        minPrice,
                        maxPrice,
                        rating,
                        stock,
                        page,
                        size,
                        sort
                );

        return ResponseEntity.ok(products);
    }
}