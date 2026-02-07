package ru.stopro.domain.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Результат решения задачи учеником
 */
@Entity
@Table(name = "task_results", indexes = {
    @Index(name = "idx_result_student", columnList = "student_id"),
    @Index(name = "idx_result_task", columnList = "task_id"),
    @Index(name = "idx_result_homework", columnList = "homework_id"),
    @Index(name = "idx_result_created", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResult extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "homework_id")
    private Homework homework; // null если решается вне ДЗ

    @Column(name = "user_answer", length = 500)
    private String userAnswer;

    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect;

    @Column(name = "time_spent_seconds")
    private Integer timeSpentSeconds; // Время решения в секундах

    @Column(name = "attempts_count", nullable = false)
    @Builder.Default
    private Integer attemptsCount = 1;

    @Column(name = "points_earned", nullable = false)
    @Builder.Default
    private Integer pointsEarned = 0;

    // Анализ от ИИ
    @Column(name = "ai_feedback", columnDefinition = "TEXT")
    private String aiFeedback;

    @Column(name = "ai_error_type", length = 50)
    private String aiErrorType; // CALCULATION, CONCEPT, LOGIC, NOTATION

    @Column(name = "solution_image_url", length = 500)
    private String solutionImageUrl; // URL загруженного рукописного решения

    @Column(name = "recognized_text", columnDefinition = "TEXT")
    private String recognizedText; // OCR текст из изображения

    // =========================================
    // Computed fields
    // =========================================

    @Transient
    public boolean hasAiFeedback() {
        return aiFeedback != null && !aiFeedback.isBlank();
    }

    @Transient
    public boolean hasSolutionImage() {
        return solutionImageUrl != null && !solutionImageUrl.isBlank();
    }
}
