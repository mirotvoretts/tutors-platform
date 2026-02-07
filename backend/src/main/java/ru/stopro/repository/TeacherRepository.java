package ru.stopro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.stopro.domain.entity.Teacher;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Репозиторий для работы с профилями учителей
 */
@Repository
public interface TeacherRepository extends JpaRepository<Teacher, UUID> {

    /**
     * Поиск учителя по ID пользователя
     */
    Optional<Teacher> findByUserId(UUID userId);

    /**
     * Учителя, принимающие учеников
     */
    List<Teacher> findByIsAcceptingStudentsTrue();

    /**
     * Поиск учителей по специализации
     */
    @Query("SELECT t FROM Teacher t WHERE LOWER(t.specialization) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Teacher> searchBySpecialization(@Param("query") String query);

    /**
     * Топ учителей по количеству учеников
     */
    @Query("SELECT t FROM Teacher t LEFT JOIN t.students s " +
           "GROUP BY t ORDER BY COUNT(s) DESC")
    List<Teacher> findTopByStudentsCount();
}
