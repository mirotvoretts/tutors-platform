package ru.stopro.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Журнал согласий пользователей (152-ФЗ)
 * 
 * Хранит полную историю всех действий с согласиями:
 * - Получение согласия
 * - Отзыв согласия
 * - Обновление согласия
 * 
 * Данные НЕ удаляются даже при удалении пользователя!
 */
@Entity
@Table(name = "consent_log", indexes = {
    @Index(name = "idx_consent_user", columnList = "user_id"),
    @Index(name = "idx_consent_type", columnList = "consent_type"),
    @Index(name = "idx_consent_action", columnList = "action"),
    @Index(name = "idx_consent_date", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsentLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /**
     * ID пользователя (не FK, чтобы сохранять логи после удаления пользователя)
     */
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    /**
     * Тип согласия:
     * - DATA_PROCESSING - обработка персональных данных
     * - MARKETING - маркетинговые рассылки
     * - COOKIES - использование cookies
     * - ANALYTICS - аналитика
     */
    @Column(name = "consent_type", nullable = false, length = 50)
    private String consentType;

    /**
     * Действие:
     * - GRANTED - согласие получено
     * - WITHDRAWN - согласие отозвано
     * - UPDATED - согласие обновлено (новая версия политики)
     */
    @Column(name = "action", nullable = false, length = 20)
    private String action;

    /**
     * Версия политики, с которой согласился пользователь
     */
    @Column(name = "policy_version", length = 20)
    private String policyVersion;

    /**
     * IP-адрес пользователя в момент действия
     */
    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    /**
     * User-Agent браузера
     */
    @Column(name = "user_agent", length = 500)
    private String userAgent;

    /**
     * Дополнительные данные в формате JSON
     */
    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    /**
     * Дата и время действия
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
