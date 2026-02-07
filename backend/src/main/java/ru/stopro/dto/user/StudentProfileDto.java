package ru.stopro.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.stopro.domain.entity.Student;
import ru.stopro.domain.enums.StudentLevel;

import java.util.UUID;

/**
 * DTO для профиля ученика
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileDto {

    private UUID id;
    private Integer grade;
    private Integer targetScore;
    private StudentLevel level;
    private String schoolName;
    private String city;
    private UUID teacherId;
    private String teacherName;
    private UUID groupId;
    private String groupName;

    // Статистика
    private Integer totalTasksSolved;
    private Integer correctAnswers;
    private Double successRate;

    /**
     * Конвертация из Entity
     */
    public static StudentProfileDto fromEntity(Student student) {
        StudentProfileDtoBuilder builder = StudentProfileDto.builder()
                .id(student.getId())
                .grade(student.getGrade())
                .targetScore(student.getTargetScore())
                .level(student.getLevel())
                .schoolName(student.getSchoolName())
                .city(student.getCity())
                .totalTasksSolved(student.getTotalTasksSolved())
                .correctAnswers(student.getCorrectAnswers())
                .successRate(student.getSuccessRate());

        if (student.getTeacher() != null) {
            builder.teacherId(student.getTeacher().getId());
            if (student.getTeacher().getUser() != null) {
                builder.teacherName(student.getTeacher().getUser().getFullName());
            }
        }

        if (student.getGroup() != null) {
            builder.groupId(student.getGroup().getId());
            builder.groupName(student.getGroup().getName());
        }

        return builder.build();
    }
}
