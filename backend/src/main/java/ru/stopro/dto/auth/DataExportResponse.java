package ru.stopro.dto.auth;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DataExportResponse {
    private String userId;
    private String username;
    private String fullName;
    private String role;
    private LocalDateTime registeredAt;
    private LocalDateTime exportDate;
}
