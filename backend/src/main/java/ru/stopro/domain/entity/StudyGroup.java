package ru.stopro.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import ru.stopro.domain.enums.StudentLevel;

import java.util.ArrayList;
import java.util.List;

/**
 * Учебная группа для объединения учеников
 */
@Entity
@Table(name = "study_groups", indexes = {
    @Index(name = "idx_group_teacher", columnList = "teacher_id"),
    @Index(name = "idx_group_level", columnList = "level")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyGroup extends BaseEntity {

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "level", nullable = false, length = 20)
    @Builder.Default
    private StudentLevel level = StudentLevel.INTERMEDIATE;

    @Column(name = "max_students")
    @Builder.Default
    private Integer maxStudents = 20;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    // Учитель группы
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    // Ученики в группе
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Student> students = new ArrayList<>();

    // Домашние задания группы
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL)
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
    public boolean isFull() {
        return students.size() >= maxStudents;
    }

    @Transient
    public double getAverageSuccessRate() {
        if (students.isEmpty()) {
            return 0.0;
        }
        return students.stream()
                .mapToDouble(Student::getSuccessRate)
                .average()
                .orElse(0.0);
    }
}
