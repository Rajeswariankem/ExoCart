package com.exocart.exocart.dto.request;

import lombok.Data;

@Data
public class RegisterUserRequestDto {

    private String name;

    private String email;

    private String password;

    private String phoneNumber;
}