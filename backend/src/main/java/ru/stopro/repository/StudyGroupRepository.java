package ru.stopro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.stopro.domain.entity.StudyGroup;

import java.util.List;
import java.util.UUID;

/**
 * Репозиторий для работы с учебными группами
 */
@Repository
public interface StudyGroupRepository extends JpaRepository<StudyGroup, UUID> {
    
    /**
     * Поиск групп учителя
     */
    List<StudyGroup> findByTeacherId(UUID teacherId);
    
    /**
     * Поиск активных групп учителя
     */
    List<StudyGroup> findByTeacherIdAndIsActiveTrue(UUID teacherId);
}
