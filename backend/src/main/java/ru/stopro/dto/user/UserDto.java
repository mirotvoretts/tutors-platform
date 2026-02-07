package ru.stopro.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.stopro.domain.entity.User;
import ru.stopro.domain.enums.UserRole;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO для пользователя
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
    private String phone;
    private String avatarUrl;
    private Boolean isEmailVerified;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;

    // Дополнительные данные для ученика
    private StudentProfileDto studentProfile;

    // Дополнительные данные для учителя
    private TeacherProfileDto teacherProfile;

    /**
     * Конвертация из Entity
     */
    public static UserDto fromEntity(User user) {
        UserDtoBuilder builder = UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .isEmailVerified(user.getIsEmailVerified())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt());

        // Добавляем профиль ученика
        if (user.isStudent() && user.getStudentProfile() != null) {
            builder.studentProfile(StudentProfileDto.fromEntity(user.getStudentProfile()));
        }

        // Добавляем профиль учителя
        if (user.isTeacher() && user.getTeacherProfile() != null) {
            builder.teacherProfile(TeacherProfileDto.fromEntity(user.getTeacherProfile()));
        }

        return builder.build();
    }
}
