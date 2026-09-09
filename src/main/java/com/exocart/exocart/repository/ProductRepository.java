package com.exocart.exocart.repository;

import com.exocart.exocart.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("""
        SELECT p FROM Product p
        WHERE
            (:keyword IS NULL OR
             LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
             LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND
            (:category IS NULL OR
             LOWER(p.category) = LOWER(:category))
        AND
            (:minPrice IS NULL OR p.price >= :minPrice)
        AND
            (:maxPrice IS NULL OR p.price <= :maxPrice)
        AND
            (:rating IS NULL OR p.rating >= :rating)
        AND
            (:stock IS NULL OR
             (:stock = true AND p.stock > 0) OR
             (:stock = false))
        """)
    Page<Product> filterProducts(
            @Param("keyword") String keyword,
            @Param("category") String category,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("rating") Double rating,
            @Param("stock") Boolean stock,
            Pageable pageable
    );
}