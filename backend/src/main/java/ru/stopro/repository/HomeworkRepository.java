package ru.stopro.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.stopro.domain.entity.Homework;
import ru.stopro.domain.enums.HomeworkStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Репозиторий для работы с домашними заданиями
 */
@Repository
public interface HomeworkRepository extends JpaRepository<Homework, UUID> {

    /**
     * ДЗ по учителю
     */
    List<Homework> findByTeacherId(UUID teacherId);

    /**
     * ДЗ по группе
     */
    List<Homework> findByGroupId(UUID groupId);

    /**
     * Активные ДЗ по группе
     */
    List<Homework> findByGroupIdAndStatus(UUID groupId, HomeworkStatus status);

    /**
     * ДЗ по учителю с пагинацией
     */
    Page<Homework> findByTeacherIdOrderByDeadlineDesc(UUID teacherId, Pageable pageable);

    /**
     * Активные ДЗ для ученика (через группу)
     */
    @Query("SELECT h FROM Homework h " +
           "JOIN h.group g " +
           "JOIN g.students s " +
           "WHERE s.id = :studentId AND h.status = 'ACTIVE' " +
           "ORDER BY h.deadline ASC")
    List<Homework> findActiveForStudent(@Param("studentId") UUID studentId);

    /**
     * Все ДЗ для ученика
     */
    @Query("SELECT h FROM Homework h " +
           "JOIN h.group g " +
           "JOIN g.students s " +
           "WHERE s.id = :studentId " +
           "ORDER BY h.deadline DESC")
    Page<Homework> findAllForStudent(@Param("studentId") UUID studentId, Pageable pageable);

    /**
     * ДЗ с истёкшим дедлайном, которые нужно обновить
     */
    @Query("SELECT h FROM Homework h WHERE h.status = 'ACTIVE' AND h.deadline < :now")
    List<Homework> findOverdueHomeworks(@Param("now") LocalDateTime now);

    /**
     * Подсчёт активных ДЗ учителя
     */
    long countByTeacherIdAndStatus(UUID teacherId, HomeworkStatus status);

    /**
     * ДЗ за период
     */
    @Query("SELECT h FROM Homework h WHERE h.teacher.id = :teacherId " +
           "AND h.createdAt BETWEEN :startDate AND :endDate")
    List<Homework> findByTeacherAndPeriod(
            @Param("teacherId") UUID teacherId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
