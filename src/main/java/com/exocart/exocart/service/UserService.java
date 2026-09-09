package com.exocart.exocart.service;

import com.exocart.exocart.dto.request.LoginRequestDto;
import com.exocart.exocart.dto.request.RegisterUserRequestDto;
import com.exocart.exocart.dto.response.LoginResponseDto;
import com.exocart.exocart.dto.response.UserResponseDto;

import java.util.List;

public interface UserService {

    UserResponseDto registerUser(
            RegisterUserRequestDto requestDto
    );

    LoginResponseDto login(
            LoginRequestDto loginRequestDto
    );

    UserResponseDto getCurrentUser(
            String email
    );

    void sendResetOtp(
            String email
    );

    boolean verifyResetOtp(
            String email,
            String otp
    );

    void resetPassword(
            String email,
            String otp,
            String newPassword
    );

    long getTotalUsers();

    List<UserResponseDto> getAllUsers();
}