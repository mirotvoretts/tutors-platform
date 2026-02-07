package ru.stopro.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import ru.stopro.domain.enums.HomeworkStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Домашнее задание для группы учеников
 */
@Entity
@Table(name = "homeworks", indexes = {
    @Index(name = "idx_homework_teacher", columnList = "teacher_id"),
    @Index(name = "idx_homework_group", columnList = "group_id"),
    @Index(name = "idx_homework_status", columnList = "status"),
    @Index(name = "idx_homework_deadline", columnList = "deadline")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Homework extends BaseEntity {

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "deadline", nullable = false)
    private LocalDateTime deadline;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private HomeworkStatus status = HomeworkStatus.ACTIVE;

    @Column(name = "max_attempts")
    @Builder.Default
    private Integer maxAttempts = 3; // Максимум попыток на задачу

    @Column(name = "show_solutions_after_deadline", nullable = false)
    @Builder.Default
    private Boolean showSolutionsAfterDeadline = true;

    // Учитель, создавший ДЗ
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    // Группа, которой назначено ДЗ
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private StudyGroup group;

    // Задачи в ДЗ
    @ManyToMany
    @JoinTable(
        name = "homework_tasks",
        joinColumns = @JoinColumn(name = "homework_id"),
        inverseJoinColumns = @JoinColumn(name = "task_id")
    )
    @Builder.Default
    private List<Task> tasks = new ArrayList<>();

    // Результаты решений
    @OneToMany(mappedBy = "homework", cascade = CascadeType.ALL)
    @Builder.Default
    private List<TaskResult> results = new ArrayList<>();

    // =========================================
    // Computed fields
    // =========================================

    @Transient
    public int getTasksCount() {
        return tasks.size();
    }

    @Transient
    public int getTotalPoints() {
        return tasks.stream()
                .mapToInt(Task::getPoints)
                .sum();
    }

    @Transient
    public boolean isOverdue() {
        return LocalDateTime.now().isAfter(deadline);
    }

    @Transient
    public int getCompletedByCount() {
        return (int) results.stream()
                .map(r -> r.getStudent().getId())
                .distinct()
                .count();
    }

    @Transient
    public double getCompletionRate() {
        int totalStudents = group.getStudentsCount();
        if (totalStudents == 0) {
            return 0.0;
        }
        return (double) getCompletedByCount() / totalStudents * 100;
    }

    /**
     * Автоматическое обновление статуса
     */
    @PreUpdate
    protected void updateStatus() {
        if (status == HomeworkStatus.ACTIVE && isOverdue()) {
            // Проверяем, все ли ученики выполнили
            if (getCompletedByCount() >= group.getStudentsCount()) {
                status = HomeworkStatus.COMPLETED;
            } else {
                status = HomeworkStatus.OVERDUE;
            }
        }
    }
}
