package ru.stopro.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.stopro.domain.entity.TaskResult;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Репозиторий для работы с результатами решения задач
 */
@Repository
public interface TaskResultRepository extends JpaRepository<TaskResult, UUID> {

    /**
     * Результаты по ученику
     */
    List<TaskResult> findByStudentId(UUID studentId);

    /**
     * Результаты по ученику с пагинацией
     */
    Page<TaskResult> findByStudentIdOrderByCreatedAtDesc(UUID studentId, Pageable pageable);

    /**
     * Результаты по домашнему заданию
     */
    List<TaskResult> findByHomeworkId(UUID homeworkId);

    /**
     * Результаты ученика по домашнему заданию
     */
    List<TaskResult> findByStudentIdAndHomeworkId(UUID studentId, UUID homeworkId);

    /**
     * Статистика по ученику
     */
    @Query("SELECT COUNT(tr), SUM(CASE WHEN tr.isCorrect = true THEN 1 ELSE 0 END), " +
           "AVG(tr.timeSpentSeconds), SUM(tr.pointsEarned) " +
           "FROM TaskResult tr WHERE tr.student.id = :studentId")
    Object[] getStudentStats(@Param("studentId") UUID studentId);

    /**
     * Статистика по ученику за период
     */
    @Query("SELECT COUNT(tr), SUM(CASE WHEN tr.isCorrect = true THEN 1 ELSE 0 END) " +
           "FROM TaskResult tr WHERE tr.student.id = :studentId " +
           "AND tr.createdAt BETWEEN :startDate AND :endDate")
    Object[] getStudentStatsByPeriod(
            @Param("studentId") UUID studentId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * Статистика по теме для ученика
     */
    @Query("SELECT t.topic.id, t.topic.name, COUNT(tr), " +
           "SUM(CASE WHEN tr.isCorrect = true THEN 1 ELSE 0 END) " +
           "FROM TaskResult tr JOIN tr.task t " +
           "WHERE tr.student.id = :studentId " +
           "GROUP BY t.topic.id, t.topic.name")
    List<Object[]> getStudentStatsByTopic(@Param("studentId") UUID studentId);

    /**
     * Недельная активность ученика
     */
    @Query("SELECT DATE(tr.createdAt), COUNT(tr), SUM(CASE WHEN tr.isCorrect = true THEN 1 ELSE 0 END) " +
           "FROM TaskResult tr " +
           "WHERE tr.student.id = :studentId " +
           "AND tr.createdAt >= :startDate " +
           "GROUP BY DATE(tr.createdAt) " +
           "ORDER BY DATE(tr.createdAt)")
    List<Object[]> getWeeklyActivity(@Param("studentId") UUID studentId, @Param("startDate") LocalDateTime startDate);

    /**
     * Подсчёт решённых задач
     */
    long countByStudentId(UUID studentId);

    /**
     * Подсчёт правильных ответов
     */
    long countByStudentIdAndIsCorrectTrue(UUID studentId);

    /**
     * Последние результаты для анализа ИИ
     */
    @Query("SELECT tr FROM TaskResult tr " +
           "WHERE tr.student.id = :studentId " +
           "ORDER BY tr.createdAt DESC")
    List<TaskResult> findRecentResults(@Param("studentId") UUID studentId, Pageable pageable);
}
