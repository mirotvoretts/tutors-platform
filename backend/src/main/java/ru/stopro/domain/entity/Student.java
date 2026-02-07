package ru.stopro.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import ru.stopro.domain.enums.StudentLevel;

import java.util.ArrayList;
import java.util.List;

/**
 * Профиль ученика с информацией об обучении
 */
@Entity
@Table(name = "students", indexes = {
    @Index(name = "idx_student_user", columnList = "user_id"),
    @Index(name = "idx_student_teacher", columnList = "teacher_id"),
    @Index(name = "idx_student_group", columnList = "group_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "grade", nullable = false)
    private Integer grade; // 10 или 11 класс

    @Column(name = "target_score", nullable = false)
    @Builder.Default
    private Integer targetScore = 70; // Целевой балл ЕГЭ (0-100)

    @Enumerated(EnumType.STRING)
    @Column(name = "level", nullable = false, length = 20)
    @Builder.Default
    private StudentLevel level = StudentLevel.BEGINNER;

    @Column(name = "school_name", length = 255)
    private String schoolName;

    @Column(name = "city", length = 100)
    private String city;

    // Связь с учителем
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    // Связь с группой
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private StudyGroup group;

    // Результаты решения задач
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TaskResult> taskResults = new ArrayList<>();

    // Статистика прогресса по темам
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProgressStats> progressStats = new ArrayList<>();

    // =========================================
    // Computed fields
    // =========================================

    @Transient
    public int getTotalTasksSolved() {
        return taskResults.size();
    }

    @Transient
    public int getCorrectAnswers() {
        return (int) taskResults.stream()
                .filter(TaskResult::getIsCorrect)
                .count();
    }

    @Transient
    public double getSuccessRate() {
        if (taskResults.isEmpty()) {
            return 0.0;
        }
        return (double) getCorrectAnswers() / taskResults.size() * 100;
    }

    /**
     * Общее количество решённых задач (для совместимости)
     */
    @Transient
    public Integer getTotalSolved() {
        return getTotalTasksSolved();
    }
}
