package ru.stopro.dto.student;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.stopro.domain.entity.Student;
import ru.stopro.domain.enums.StudentLevel;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDto {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private Integer grade;
    private Integer targetScore;
    private StudentLevel level;
    private UUID groupId;
    private String groupName;

    public static StudentDto fromEntity(Student student) {
        return StudentDto.builder()
                .id(student.getId())
                .email(student.getUser().getEmail())
                .firstName(student.getUser().getFirstName())
                .lastName(student.getUser().getLastName())
                .grade(student.getGrade())
                .targetScore(student.getTargetScore())
                .level(student.getLevel())
                .groupId(student.getGroup() != null ? student.getGroup().getId() : null)
                .groupName(student.getGroup() != null ? student.getGroup().getName() : null)
                .build();
    }
}
