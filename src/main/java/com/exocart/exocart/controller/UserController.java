package com.exocart.exocart.controller;

import com.exocart.exocart.dto.request.LoginRequestDto;
import com.exocart.exocart.dto.request.RegisterUserRequestDto;
import com.exocart.exocart.dto.response.LoginResponseDto;
import com.exocart.exocart.dto.response.UserResponseDto;
import com.exocart.exocart.service.UserService;
import com.exocart.exocart.dto.request.ForgotPasswordRequestDto;
import com.exocart.exocart.dto.request.VerifyOtpRequestDto;
import com.exocart.exocart.dto.request.ResetPasswordRequestDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public UserResponseDto registerUser(
            @RequestBody RegisterUserRequestDto requestDto) {

        return userService.registerUser(requestDto);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(
            @RequestBody LoginRequestDto loginRequestDto) {

        LoginResponseDto response =
                userService.login(loginRequestDto);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser(
            Authentication authentication) {

        String email = authentication.getName();

        UserResponseDto user =
                userService.getCurrentUser(email);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequestDto request) {

        userService.sendResetOtp(request.getEmail());

        return ResponseEntity.ok(
                "OTP sent successfully"
        );
    }
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @RequestBody VerifyOtpRequestDto request) {

        boolean valid = userService.verifyResetOtp(
                request.getEmail(),
                request.getOtp()
        );

        if (!valid) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid or expired OTP");
        }

        return ResponseEntity.ok(
                "OTP verified successfully"
        );
    }
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequestDto request) {

        userService.resetPassword(
                request.getEmail(),
                request.getOtp(),
                request.getNewPassword()
        );

        return ResponseEntity.ok(
                "Password reset successfully"
        );
    }
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalUsers() {
        return ResponseEntity.ok(
                userService.getTotalUsers()
        );
    }
    @GetMapping("/all")
    public ResponseEntity<java.util.List<UserResponseDto>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }
}