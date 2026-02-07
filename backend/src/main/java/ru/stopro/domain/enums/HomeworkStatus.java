package ru.stopro.domain.enums;

/**
 * Статус домашнего задания
 */
public enum HomeworkStatus {
    DRAFT,      // Черновик (не опубликовано)
    ACTIVE,     // Активно (в процессе выполнения)
    COMPLETED,  // Выполнено всеми учениками
    OVERDUE     // Просрочено
}
