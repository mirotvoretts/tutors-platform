package ru.stopro.dto.auth;

import lombok.Builder;
import lombok.Data;
import ru.stopro.domain.enums.StudentLevel;

@Data
@Builder
public class StudentProfileDto {
    private String id;
    private Integer grade;
    private Integer targetScore;
    private StudentLevel level;
    private String groupId;
    private String teacherId;
}
