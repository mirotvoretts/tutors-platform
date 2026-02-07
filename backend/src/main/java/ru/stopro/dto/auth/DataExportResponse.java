package ru.stopro.dto.auth;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class DataExportResponse {
    private String userId;
    private String email;
    private String fullName;
    private String role;
    private LocalDateTime registeredAt;
    private Map<String, Object> additionalData;
    private LocalDateTime exportDate;
}
