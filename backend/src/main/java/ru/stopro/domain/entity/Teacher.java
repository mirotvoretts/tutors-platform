package ru.stopro.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Профиль учителя/репетитора
 */
@Entity
@Table(name = "teachers", indexes = {
    @Index(name = "idx_teacher_user", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "specialization", length = 255)
    private String specialization;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "hourly_rate")
    private Integer hourlyRate; // Стоимость занятия в рублях

    @Column(name = "max_students")
    @Builder.Default
    private Integer maxStudents = 50;

    @Column(name = "is_accepting_students", nullable = false)
    @Builder.Default
    private Boolean isAcceptingStudents = true;

    // Ученики этого учителя
    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Student> students = new ArrayList<>();

    // Группы учителя
    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    @Builder.Default
    private List<StudyGroup> groups = new ArrayList<>();

    // Созданные домашние задания
    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Homework> homeworks = new ArrayList<>();

    // =========================================
    // Computed fields
    // =========================================

    @Transient
    public int getStudentsCount() {
        return students.size();
    }

    @Transient
    public int getGroupsCount() {
        return groups.size();
    }

    @Transient
    public int getActiveHomeworksCount() {
        return (int) homeworks.stream()
                .filter(hw -> hw.getStatus() == ru.stopro.domain.enums.HomeworkStatus.ACTIVE)
                .count();
    }
}
