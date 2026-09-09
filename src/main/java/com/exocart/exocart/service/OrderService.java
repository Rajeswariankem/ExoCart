package com.exocart.exocart.service;

import com.exocart.exocart.dto.request.CreateOrderRequestDto;
import com.exocart.exocart.dto.request.OrderItemRequestDto;
import com.exocart.exocart.dto.response.OrderResponseDto;
import com.exocart.exocart.entity.Order;
import com.exocart.exocart.entity.OrderItem;
import com.exocart.exocart.repository.OrderItemRepository;
import com.exocart.exocart.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    // ================= CREATE ORDER =================

    @Transactional
    public OrderResponseDto createOrder(
            CreateOrderRequestDto request,
            String customerEmail
    ) {

        String paymentStatus;

        if ("COD".equalsIgnoreCase(request.getPaymentMethod())) {
            paymentStatus = "Pending";
        } else {
            paymentStatus = "Prepaid";
        }

        Order order = new Order();

        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(customerEmail);
        order.setPhoneNumber(request.getPhoneNumber());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setCity(request.getCity());
        order.setPincode(request.getPincode());
        order.setTotalAmount(request.getTotalAmount());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus(paymentStatus);
        order.setOrderStatus("Placed");
        order.setOrderDate(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        if (request.getItems() != null) {

            for (OrderItemRequestDto itemRequest : request.getItems()) {

                OrderItem orderItem = new OrderItem();

                orderItem.setOrderId(savedOrder.getId());
                orderItem.setProductId(itemRequest.getProductId());
                orderItem.setProductName(itemRequest.getProductName());
                orderItem.setPrice(itemRequest.getPrice());
                orderItem.setQuantity(itemRequest.getQuantity());

                double subtotal =
                        itemRequest.getPrice()
                                * itemRequest.getQuantity();

                orderItem.setSubtotal(subtotal);

                orderItemRepository.save(orderItem);
            }
        }

        return convertToResponse(savedOrder);
    }

    // ================= MY ORDERS =================

    public List<OrderResponseDto> getMyOrders(String customerEmail) {

        List<Order> orders =
                orderRepository.findByCustomerEmail(customerEmail);

        return orders.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // ================= ALL ORDERS - ADMIN =================

    public List<OrderResponseDto> getAllOrders() {

        List<Order> orders =
                orderRepository.findAll();

        return orders.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // ================= CANCEL ORDER - CUSTOMER =================

    @Transactional
    public OrderResponseDto cancelOrder(
            Long orderId,
            String customerEmail
    ) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found")
                );

        if (!customerEmail.equalsIgnoreCase(
                order.getCustomerEmail()
        )) {

            throw new RuntimeException(
                    "You are not allowed to cancel this order"
            );
        }

        if (!"Placed".equalsIgnoreCase(order.getOrderStatus())
                && !"Processing".equalsIgnoreCase(order.getOrderStatus())) {

            throw new RuntimeException(
                    "This order cannot be cancelled"
            );
        }

        order.setOrderStatus("Cancelled");

        Order updatedOrder =
                orderRepository.save(order);

        return convertToResponse(updatedOrder);
    }

    // ================= UPDATE ORDER STATUS - ADMIN =================

    @Transactional
    public OrderResponseDto updateOrderStatus(
            Long orderId,
            String status
    ) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found")
                );

        if (status == null || status.isBlank()) {
            throw new RuntimeException(
                    "Order status is required"
            );
        }

        String newStatus =
                status.trim();

        if (!newStatus.equalsIgnoreCase("Placed")
                && !newStatus.equalsIgnoreCase("Processing")
                && !newStatus.equalsIgnoreCase("Out for Delivery")
                && !newStatus.equalsIgnoreCase("Delivered")
                && !newStatus.equalsIgnoreCase("Cancelled")) {

            throw new RuntimeException(
                    "Invalid order status"
            );
        }

        if (newStatus.equalsIgnoreCase("Placed")) {
            newStatus = "Placed";
        } else if (newStatus.equalsIgnoreCase("Processing")) {
            newStatus = "Processing";
        } else if (newStatus.equalsIgnoreCase("Out for Delivery")) {
            newStatus = "Out for Delivery";
        } else if (newStatus.equalsIgnoreCase("Delivered")) {
            newStatus = "Delivered";
        } else {
            newStatus = "Cancelled";
        }

        order.setOrderStatus(newStatus);

        Order updatedOrder =
                orderRepository.save(order);

        return convertToResponse(updatedOrder);
    }

    // ================= CONVERT =================

    private OrderResponseDto convertToResponse(Order order) {

        OrderResponseDto response =
                new OrderResponseDto();

        response.setOrderId(order.getId());
        response.setCustomerName(order.getCustomerName());
        response.setPhoneNumber(order.getPhoneNumber());
        response.setDeliveryAddress(order.getDeliveryAddress());
        response.setCity(order.getCity());
        response.setPincode(order.getPincode());
        response.setTotalAmount(order.getTotalAmount());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setOrderStatus(order.getOrderStatus());
        response.setOrderDate(order.getOrderDate());

        return response;
    }
}