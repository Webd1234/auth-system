package com.example.auth.controller;

import com.example.auth.dto.LoginRequest;
import com.example.auth.dto.SignupRequest;
import com.example.auth.jwt.JwtUtil;
import com.example.auth.service.AuthService;

import io.jsonwebtoken.lang.Collections;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        return authService.registerUser(request);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        String token = authService.authenticateUser(request);
        return ResponseEntity.ok(Map.of("token",token));
    }
}
