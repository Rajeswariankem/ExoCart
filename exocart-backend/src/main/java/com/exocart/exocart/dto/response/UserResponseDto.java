package com.exocart.exocart.dto.response;

import lombok.Data;

@Data
public class UserResponseDto {

    private Long id;

    private String name;

    private String email;

    private String phoneNumber;

    private String role;
}