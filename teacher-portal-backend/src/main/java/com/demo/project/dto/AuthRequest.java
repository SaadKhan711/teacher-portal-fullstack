package com.demo.project.dto;

public class AuthRequest {
    private String email; // Changed from username
    private String password;

    // Getters and Setters
    public String getEmail() { return email; } // Changed from getUsername
    public void setEmail(String email) { this.email = email; } // Changed from setUsername
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
