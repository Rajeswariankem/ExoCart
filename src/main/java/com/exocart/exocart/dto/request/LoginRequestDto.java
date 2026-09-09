package com.exocart.exocart.dto.request;

import lombok.Data;

@Data
public class LoginRequestDto {

    private String email;
    private String password;
}