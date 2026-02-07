package ru.stopro.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.stopro.domain.entity.Task;
import ru.stopro.domain.enums.TaskDifficulty;

import java.util.List;
import java.util.UUID;

/**
 * Репозиторий для работы с задачи
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    /**
     * Поиск задач по теме
     */
    List<Task> findByTopicIdAndIsActiveTrue(UUID topicId);

    /**
     * Поиск задач по номеру ЕГЭ
     */
    List<Task> findByEgeNumberAndIsActiveTrue(Integer egeNumber);

    /**
     * Поиск задач по сложности
     */
    Page<Task> findByDifficultyAndIsActiveTrue(TaskDifficulty difficulty, Pageable pageable);

    /**
     * Поиск задач с фильтрами
     */
    @Query("SELECT t FROM Task t WHERE t.isActive = true " +
           "AND (:topicId IS NULL OR t.topic.id = :topicId) " +
           "AND (:egeNumber IS NULL OR t.egeNumber = :egeNumber) " +
           "AND (:difficulty IS NULL OR t.difficulty = :difficulty)")
    Page<Task> findWithFilters(
            @Param("topicId") UUID topicId,
            @Param("egeNumber") Integer egeNumber,
            @Param("difficulty") TaskDifficulty difficulty,
            Pageable pageable
    );

    /**
     * Случайные задачи для генерации варианта
     */
    @Query(value = "SELECT * FROM tasks t WHERE t.is_active = true " +
                   "AND t.ege_number = :egeNumber " +
                   "ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Task> findRandomByEgeNumber(@Param("egeNumber") Integer egeNumber, @Param("limit") int limit);

    /**
     * Задачи, которые ученик ещё не решал
     */
    @Query("SELECT t FROM Task t WHERE t.isActive = true " +
           "AND t.topic.id = :topicId " +
           "AND t.id NOT IN (SELECT tr.task.id FROM TaskResult tr WHERE tr.student.id = :studentId)")
    List<Task> findUnsolvedByStudent(@Param("studentId") UUID studentId, @Param("topicId") UUID topicId);

    /**
     * Рекомендованные задачи (те, которые ученик решил неправильно)
     */
    @Query("SELECT DISTINCT t FROM Task t " +
           "JOIN TaskResult tr ON tr.task = t " +
           "WHERE tr.student.id = :studentId AND tr.isCorrect = false " +
           "AND t.isActive = true")
    List<Task> findIncorrectlySolvedByStudent(@Param("studentId") UUID studentId, Pageable pageable);

    /**
     * Подсчёт задач по номеру ЕГЭ
     */
    long countByEgeNumberAndIsActiveTrue(Integer egeNumber);

    /**
     * Полнотекстовый поиск по содержимому задачи
     */
    @Query("SELECT t FROM Task t WHERE t.isActive = true " +
           "AND (LOWER(t.content) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(t.solution) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Task> searchByContent(@Param("query") String query, Pageable pageable);
}
