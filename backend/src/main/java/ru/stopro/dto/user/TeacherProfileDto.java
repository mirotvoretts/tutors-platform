package ru.stopro.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.stopro.domain.entity.Teacher;

import java.util.UUID;

/**
 * DTO для профиля учителя
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherProfileDto {

    private UUID id;
    private String specialization;
    private Integer experienceYears;
    private String description;
    private Integer hourlyRate;
    private Integer maxStudents;
    private Boolean isAcceptingStudents;

    // Статистика
    private Integer studentsCount;
    private Integer groupsCount;
    private Integer activeHomeworksCount;

    /**
     * Конвертация из Entity
     */
    public static TeacherProfileDto fromEntity(Teacher teacher) {
        return TeacherProfileDto.builder()
                .id(teacher.getId())
                .specialization(teacher.getSpecialization())
                .experienceYears(teacher.getExperienceYears())
                .description(teacher.getDescription())
                .hourlyRate(teacher.getHourlyRate())
                .maxStudents(teacher.getMaxStudents())
                .isAcceptingStudents(teacher.getIsAcceptingStudents())
                .studentsCount(teacher.getStudentsCount())
                .groupsCount(teacher.getGroupsCount())
                .activeHomeworksCount(teacher.getActiveHomeworksCount())
                .build();
    }
}
