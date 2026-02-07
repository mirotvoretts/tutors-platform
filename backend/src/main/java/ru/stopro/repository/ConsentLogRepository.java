package ru.stopro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.stopro.domain.entity.ConsentLog;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Репозиторий для работы с журналом согласий (152-ФЗ)
 */
@Repository
public interface ConsentLogRepository extends JpaRepository<ConsentLog, UUID> {

    /**
     * История согласий пользователя
     */
    List<ConsentLog> findByUserIdOrderByCreatedAtDesc(UUID userId);

    /**
     * История согласий определённого типа
     */
    List<ConsentLog> findByUserIdAndConsentTypeOrderByCreatedAtDesc(
            UUID userId, String consentType);

    /**
     * Последнее согласие определённого типа
     */
    @Query("SELECT c FROM ConsentLog c WHERE c.userId = :userId " +
           "AND c.consentType = :consentType ORDER BY c.createdAt DESC")
    Optional<ConsentLog> findLatestByUserIdAndType(
            @Param("userId") UUID userId,
            @Param("consentType") String consentType);

    /**
     * Проверка наличия активного согласия
     * Считаем согласие активным, если последнее действие = GRANTED
     */
    @Query("SELECT CASE WHEN c.action = 'GRANTED' THEN true ELSE false END " +
           "FROM ConsentLog c WHERE c.userId = :userId " +
           "AND c.consentType = :consentType " +
           "ORDER BY c.createdAt DESC LIMIT 1")
    boolean hasActiveConsent(
            @Param("userId") UUID userId,
            @Param("consentType") String consentType);

    /**
     * Все согласия за период
     */
    List<ConsentLog> findByCreatedAtBetweenOrderByCreatedAtDesc(
            LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Статистика согласий по типу
     */
    @Query("SELECT c.consentType, c.action, COUNT(c) FROM ConsentLog c " +
           "WHERE c.createdAt >= :since GROUP BY c.consentType, c.action")
    List<Object[]> getConsentStatistics(@Param("since") LocalDateTime since);

    /**
     * Пользователи, отозвавшие согласие за период
     */
    @Query("SELECT DISTINCT c.userId FROM ConsentLog c " +
           "WHERE c.action = 'WITHDRAWN' " +
           "AND c.consentType = 'DATA_PROCESSING' " +
           "AND c.createdAt >= :since")
    List<UUID> findUsersWhoWithdrewConsent(@Param("since") LocalDateTime since);
}
