package ru.stopro.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.stopro.domain.entity.Student;
import ru.stopro.domain.enums.StudentLevel;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Репозиторий для работы с профилями учеников
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, UUID> {

    /**
     * Поиск ученика по ID пользователя
     */
    Optional<Student> findByUserId(UUID userId);

    /**
     * Поиск учеников по учителю
     */
    List<Student> findByTeacherId(UUID teacherId);

    /**
     * Поиск учеников по учителю с пагинацией
     */
    Page<Student> findByTeacherId(UUID teacherId, Pageable pageable);

    /**
     * Поиск учеников по группе
     */
    List<Student> findByGroupId(UUID groupId);

    /**
     * Поиск учеников по уровню
     */
    List<Student> findByTeacherIdAndLevel(UUID teacherId, StudentLevel level);

    /**
     * Поиск учеников по классу
     */
    List<Student> findByTeacherIdAndGrade(UUID teacherId, Integer grade);

    /**
     * Подсчёт учеников учителя
     */
    long countByTeacherId(UUID teacherId);

    /**
     * Поиск учеников без группы
     */
    @Query("SELECT s FROM Student s WHERE s.teacher.id = :teacherId AND s.group IS NULL")
    List<Student> findWithoutGroup(@Param("teacherId") UUID teacherId);

    /**
     * Топ учеников по успешности
     */
    @Query("SELECT s FROM Student s " +
           "LEFT JOIN s.taskResults tr " +
           "WHERE s.teacher.id = :teacherId " +
           "GROUP BY s " +
           "ORDER BY (COUNT(CASE WHEN tr.isCorrect = true THEN 1 END) * 100.0 / NULLIF(COUNT(tr), 0)) DESC")
    List<Student> findTopPerformers(@Param("teacherId") UUID teacherId, Pageable pageable);

    /**
     * Ученики, требующие внимания (низкая активность или успешность)
     */
    @Query("SELECT s FROM Student s " +
           "LEFT JOIN s.taskResults tr " +
           "WHERE s.teacher.id = :teacherId " +
           "GROUP BY s " +
           "HAVING (COUNT(CASE WHEN tr.isCorrect = true THEN 1 END) * 100.0 / NULLIF(COUNT(tr), 0)) < 60 " +
           "OR COUNT(tr) < 10")
    List<Student> findNeedingAttention(@Param("teacherId") UUID teacherId);
}
