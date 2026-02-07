package ru.stopro.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import ru.stopro.domain.enums.TopicStatus;

import java.time.LocalDateTime;

/**
 * Статистика прогресса ученика по конкретной теме
 */
@Entity
@Table(name = "progress_stats", indexes = {
    @Index(name = "idx_progress_student", columnList = "student_id"),
    @Index(name = "idx_progress_topic", columnList = "topic_id"),
    @Index(name = "idx_progress_status", columnList = "status")
}, uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "topic_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressStats extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(name = "total_attempts", nullable = false)
    @Builder.Default
    private Integer totalAttempts = 0;

    @Column(name = "correct_attempts", nullable = false)
    @Builder.Default
    private Integer correctAttempts = 0;

    @Column(name = "success_rate", nullable = false)
    @Builder.Default
    private Double successRate = 0.0;

    @Column(name = "average_time_seconds")
    private Integer averageTimeSeconds;

    @Column(name = "last_attempt_at")
    private LocalDateTime lastAttemptAt;

    @Column(name = "best_streak", nullable = false)
    @Builder.Default
    private Integer bestStreak = 0; // Лучшая серия правильных ответов

    @Column(name = "current_streak", nullable = false)
    @Builder.Default
    private Integer currentStreak = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private TopicStatus status = TopicStatus.NOT_STARTED;

    @Column(name = "points_earned", nullable = false)
    @Builder.Default
    private Integer pointsEarned = 0;

    // =========================================
    // Business logic
    // =========================================

    /**
     * Обновляет статистику после решения задачи
     */
    public void recordAttempt(boolean isCorrect, int timeSpentSeconds, int points) {
        totalAttempts++;
        
        if (isCorrect) {
            correctAttempts++;
            currentStreak++;
            pointsEarned += points;
            
            if (currentStreak > bestStreak) {
                bestStreak = currentStreak;
            }
        } else {
            currentStreak = 0;
        }
        
        // Пересчет success rate
        successRate = (double) correctAttempts / totalAttempts * 100;
        
        // Пересчет среднего времени
        if (averageTimeSeconds == null) {
            averageTimeSeconds = timeSpentSeconds;
        } else {
            averageTimeSeconds = (averageTimeSeconds * (totalAttempts - 1) + timeSpentSeconds) / totalAttempts;
        }
        
        lastAttemptAt = LocalDateTime.now();
        
        // Обновление статуса
        updateStatus();
    }

    /**
     * Определяет статус темы на основе success rate
     */
    public void updateStatus() {
        if (totalAttempts == 0) {
            status = TopicStatus.NOT_STARTED;
        } else if (totalAttempts < 5) {
            status = TopicStatus.IN_PROGRESS;
        } else if (successRate >= 80) {
            status = TopicStatus.STRONG;
        } else if (successRate >= 60) {
            status = TopicStatus.NORMAL;
        } else {
            status = TopicStatus.WEAK;
        }
    }
}
