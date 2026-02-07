package ru.stopro.dto.auth;

import lombok.Builder;
import lombok.Data;
import ru.stopro.domain.enums.UserRole;

@Data
@Builder
public class UserDto {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
    private String avatarUrl;
    
    // Опциональные поля профиля
    private StudentProfileDto studentProfile;
    private TeacherProfileDto teacherProfile;
}
