package ru.stopro.dto.auth;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class TeacherProfileDto {
    private String id;
    private String specialization;
    private BigDecimal hourlyRate;
    private String about;
}
