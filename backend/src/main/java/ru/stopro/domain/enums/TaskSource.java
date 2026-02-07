package ru.stopro.domain.enums;

/**
 * Источник задачи
 */
public enum TaskSource {
    EGE_OFFICIAL,   // Официальные задания ЕГЭ
    OGE_OFFICIAL,   // Официальные задания ОГЭ
    FIPI,           // Открытый банк ФИПИ
    BANK,           // Банк задач платформы
    TEACHER,        // Создана учителем
    GENERATED       // Сгенерирована системой
}
