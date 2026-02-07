package ru.stopro.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.stopro.domain.enums.RecommendationType;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "ai_recommendations")
public class AiRecommendation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecommendationType type;

    @Column(nullable = false)
    private Integer priority;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String actionLink; // Ссылка на действие (например, на тему или задачу)

    @Column(name = "is_completed")
    private boolean isCompleted = false;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt = LocalDateTime.now();
}
