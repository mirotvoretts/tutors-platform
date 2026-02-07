package ru.stopro.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.stopro.domain.entity.AiRecommendation;

import java.util.List;
import java.util.UUID;

/**
 * Репозиторий для работы с рекомендациями ИИ
 */
@Repository
public interface AiRecommendationRepository extends JpaRepository<AiRecommendation, UUID> {
    
    /**
     * Активные рекомендации для ученика
     */
    @Query("SELECT r FROM AiRecommendation r WHERE r.student.id = :studentId " +
           "AND r.isDeleted = false AND r.isActioned = false " +
           "ORDER BY r.priority DESC, r.createdAt DESC")
    List<AiRecommendation> findActiveByStudentId(@Param("studentId") UUID studentId, Pageable pageable);
}
