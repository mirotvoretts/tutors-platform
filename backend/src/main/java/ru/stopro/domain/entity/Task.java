package ru.stopro.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import ru.stopro.domain.enums.TaskDifficulty;
import ru.stopro.domain.enums.TaskSource;

import java.util.ArrayList;
import java.util.List;

/**
 * Математическая задача
 */
@Entity
@Table(name = "tasks", indexes = {
    @Index(name = "idx_task_topic", columnList = "topic_id"),
    @Index(name = "idx_task_difficulty", columnList = "difficulty"),
    @Index(name = "idx_task_ege_number", columnList = "ege_number"),
    @Index(name = "idx_task_source", columnList = "source")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(name = "ege_number", nullable = false)
    private Integer egeNumber; // Номер задания ЕГЭ (1-19)

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty", nullable = false, length = 20)
    @Builder.Default
    private TaskDifficulty difficulty = TaskDifficulty.MEDIUM;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content; // Условие задачи (может содержать LaTeX)

    @Column(name = "answer", nullable = false, length = 500)
    private String answer; // Правильный ответ

    @Column(name = "solution", columnDefinition = "TEXT")
    private String solution; // Полное решение

    @Column(name = "hint", columnDefinition = "TEXT")
    private String hint; // Подсказка

    @Column(name = "image_url", length = 500)
    private String imageUrl; // URL изображения к задаче

    @Column(name = "points", nullable = false)
    @Builder.Default
    private Integer points = 1; // Баллы за задачу

    @Column(name = "estimated_time_minutes")
    @Builder.Default
    private Integer estimatedTimeMinutes = 5;

    @Enumerated(EnumType.STRING)
    @Column(name = "source", length = 50)
    @Builder.Default
    private TaskSource source = TaskSource.BANK;

    @Column(name = "source_year")
    private Integer sourceYear; // Год ЕГЭ/источника

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "times_solved")
    @Builder.Default
    private Integer timesSolved = 0;

    @Column(name = "times_correct")
    @Builder.Default
    private Integer timesCorrect = 0;

    // Результаты решения
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    @Builder.Default
    private List<TaskResult> results = new ArrayList<>();

    // Связь с домашними заданиями
    @ManyToMany(mappedBy = "tasks")
    @Builder.Default
    private List<Homework> homeworks = new ArrayList<>();

    // =========================================
    // Computed fields
    // =========================================

    @Transient
    public double getSuccessRate() {
        if (timesSolved == 0) {
            return 0.0;
        }
        return (double) timesCorrect / timesSolved * 100;
    }

    /**
     * Проверяет правильность ответа
     * Поддерживает различные форматы: числа, дроби, множества
     */
    public boolean checkAnswer(String userAnswer) {
        if (userAnswer == null || userAnswer.isBlank()) {
            return false;
        }
        
        String normalized = normalizeAnswer(userAnswer);
        String correctNormalized = normalizeAnswer(answer);
        
        return normalized.equals(correctNormalized);
    }

    private String normalizeAnswer(String answer) {
        return answer
                .trim()
                .toLowerCase()
                .replaceAll("\\s+", "")
                .replace(",", ".")
                .replaceAll("\\.0+$", ""); // Убираем .0 в конце чисел
    }
}
