package ru.stopro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.stopro.domain.entity.User;
import ru.stopro.domain.enums.UserRole;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Репозиторий для работы с пользователями
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Поиск пользователя по email
     */
    Optional<User> findByEmail(String email);

    /**
     * Проверка существования пользователя по email
     */
    boolean existsByEmail(String email);

    /**
     * Поиск пользователей по роли
     */
    List<User> findByRole(UserRole role);

    /**
     * Поиск активных пользователей по роли
     */
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.isActive = true AND u.isDeleted = false")
    List<User> findActiveByRole(@Param("role") UserRole role);

    /**
     * Поиск пользователей по части имени или email
     */
    @Query("SELECT u FROM User u WHERE " +
           "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND u.isDeleted = false")
    List<User> searchByNameOrEmail(@Param("query") String query);

    /**
     * Подсчёт пользователей по роли
     */
    long countByRoleAndIsDeletedFalse(UserRole role);
}
