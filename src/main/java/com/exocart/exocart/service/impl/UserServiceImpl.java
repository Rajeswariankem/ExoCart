package com.exocart.exocart.service.impl;

import com.exocart.exocart.dto.request.LoginRequestDto;
import com.exocart.exocart.dto.request.RegisterUserRequestDto;
import com.exocart.exocart.dto.response.LoginResponseDto;
import com.exocart.exocart.dto.response.UserResponseDto;
import com.exocart.exocart.entity.User;
import com.exocart.exocart.exception.EmailAlreadyExistsException;
import com.exocart.exocart.repository.UserRepository;
import com.exocart.exocart.security.JwtService;
import com.exocart.exocart.service.UserService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private JwtService jwtService;

    @Override
    public void sendResetOtp(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Email not registered"
                        )
                );

        String otp = String.valueOf(
                (int) (Math.random() * 900000) + 100000
        );

        user.setResetOtp(otp);

        user.setResetOtpExpiry(
                java.time.LocalDateTime.now()
                        .plusMinutes(5)
        );

        userRepository.save(user);

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "ExoCart - Password Reset OTP"
        );

        message.setText(
                "Hello " + user.getName() + ",\n\n"
                        + "Your ExoCart password reset OTP is: "
                        + otp + "\n\n"
                        + "This OTP is valid for 5 minutes.\n\n"
                        + "If you did not request a password reset, "
                        + "please ignore this email.\n\n"
                        + "Regards,\n"
                        + "ExoCart Team"
        );

        mailSender.send(message);
    }
    @Override
    public boolean verifyResetOtp(String email, String otp) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Email not registered"
                        )
                );

        if (user.getResetOtp() == null) {
            return false;
        }

        if (user.getResetOtpExpiry() == null) {
            return false;
        }

        if (java.time.LocalDateTime.now()
                .isAfter(user.getResetOtpExpiry())) {

            return false;
        }

        return user.getResetOtp().equals(otp);
    }

    @Override
    public void resetPassword(
            String email,
            String otp,
            String newPassword) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Email not registered"
                        )
                );

        if (user.getResetOtp() == null
                || user.getResetOtpExpiry() == null) {

            throw new RuntimeException(
                    "Invalid OTP"
            );
        }

        if (java.time.LocalDateTime.now()
                .isAfter(user.getResetOtpExpiry())) {

            throw new RuntimeException(
                    "OTP expired"
            );
        }

        if (!user.getResetOtp().equals(otp)) {

            throw new RuntimeException(
                    "Invalid OTP"
            );
        }

        user.setPassword(newPassword);

        // Clear OTP after successful reset
        user.setResetOtp(null);
        user.setResetOtpExpiry(null);

        userRepository.save(user);
    }

    @Override
    public UserResponseDto registerUser(
            RegisterUserRequestDto requestDto) {

        User existingUser =
                userRepository
                        .findByEmail(requestDto.getEmail())
                        .orElse(null);

        if (existingUser != null) {
            throw new EmailAlreadyExistsException(
                    "Email already exists"
            );
        }

        User user = new User();

        user.setName(requestDto.getName());
        user.setEmail(requestDto.getEmail());
        user.setPassword(requestDto.getPassword());
        user.setPhoneNumber(requestDto.getPhoneNumber());
        user.setRole("CUSTOMER");

        User savedUser =
                userRepository.save(user);

        UserResponseDto responseDto =
                new UserResponseDto();

        responseDto.setId(savedUser.getId());
        responseDto.setName(savedUser.getName());
        responseDto.setEmail(savedUser.getEmail());
        responseDto.setPhoneNumber(
                savedUser.getPhoneNumber()
        );
        responseDto.setRole(savedUser.getRole());

        return responseDto;
    }

    @Override
    public LoginResponseDto login(
            LoginRequestDto loginRequestDto) {

        User user =
                userRepository
                        .findByEmail(
                                loginRequestDto.getEmail()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid Email"
                                )
                        );

        if (!user.getPassword().equals(
                loginRequestDto.getPassword()
        )) {
            throw new RuntimeException(
                    "Invalid Password"
            );
        }

        String token =
                jwtService.generateToken(
                        user.getId(),
                        user.getEmail(),
                        user.getRole()
                );

        return new LoginResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                token
        );
    }

    @Override
    public UserResponseDto getCurrentUser(
            String email) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        UserResponseDto responseDto =
                new UserResponseDto();

        responseDto.setId(user.getId());
        responseDto.setName(user.getName());
        responseDto.setEmail(user.getEmail());
        responseDto.setPhoneNumber(
                user.getPhoneNumber()
        );
        responseDto.setRole(user.getRole());

        return responseDto;
    }
    @Override
    public long getTotalUsers() {
        return userRepository.count();
    }
    @Override
    public List<UserResponseDto> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> {

                    UserResponseDto responseDto =
                            new UserResponseDto();

                    responseDto.setId(user.getId());
                    responseDto.setName(user.getName());
                    responseDto.setEmail(user.getEmail());
                    responseDto.setPhoneNumber(
                            user.getPhoneNumber()
                    );
                    responseDto.setRole(user.getRole());

                    return responseDto;
                })
                .toList();
    }
}