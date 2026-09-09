package com.exocart.exocart.controller;

import com.exocart.exocart.dto.request.CreateOrderRequestDto;
import com.exocart.exocart.dto.response.OrderResponseDto;
import com.exocart.exocart.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // ================= CREATE ORDER =================

    @PostMapping
    public ResponseEntity<OrderResponseDto> createOrder(
            @RequestBody CreateOrderRequestDto request,
            Authentication authentication
    ) {

        String customerEmail =
                authentication.getName();

        OrderResponseDto response =
                orderService.createOrder(
                        request,
                        customerEmail
                );

        return ResponseEntity.ok(response);
    }

    // ================= CUSTOMER ORDERS =================

    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getMyOrders(
            Authentication authentication
    ) {

        String customerEmail =
                authentication.getName();

        List<OrderResponseDto> orders =
                orderService.getMyOrders(
                        customerEmail
                );

        return ResponseEntity.ok(orders);
    }

    // ================= CANCEL ORDER =================

    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponseDto> cancelOrder(
            @PathVariable Long orderId,
            Authentication authentication
    ) {

        String customerEmail =
                authentication.getName();

        OrderResponseDto response =
                orderService.cancelOrder(
                        orderId,
                        customerEmail
                );

        return ResponseEntity.ok(response);
    }

    // ================= ADMIN - ALL ORDERS =================

    @GetMapping("/admin/all")
    public ResponseEntity<List<OrderResponseDto>> getAllOrders() {

        List<OrderResponseDto> orders =
                orderService.getAllOrders();

        return ResponseEntity.ok(orders);
    }

    // ================= ADMIN - UPDATE STATUS =================

    @PatchMapping("/admin/{orderId}/status")
    public ResponseEntity<OrderResponseDto> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> request
    ) {

        String status =
                request.get("status");

        OrderResponseDto response =
                orderService.updateOrderStatus(
                        orderId,
                        status
                );

        return ResponseEntity.ok(response);
    }
}