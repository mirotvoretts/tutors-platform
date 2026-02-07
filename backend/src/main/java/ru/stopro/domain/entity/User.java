package ru.stopro.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import ru.stopro.domain.enums.UserRole;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 * Сущность пользователя системы (ученик, учитель, администратор)
 * 
 * ВАЖНО: Соответствует требованиям 152-ФЗ "О персональных данных"
 * - data_processing_consent - согласие на обработку ПД
 * - consent_date - дата получения согласия
 * - consent_ip - IP-адрес при получении согласия
 */
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_email", columnList = "email", unique = true),
    @Index(name = "idx_user_role", columnList = "role"),
    @Index(name = "idx_user_active", columnList = "is_active")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity implements UserDetails {

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "patronymic", length = 100)
    private String patronymic; // Отчество (опционально)

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private UserRole role;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    // =========================================
    // 152-ФЗ: Согласие на обработку ПД
    // =========================================
    
    /**
     * Согласие на обработку персональных данных
     * Требуется по 152-ФЗ для законной обработки ПД
     */
    @Column(name = "data_processing_consent", nullable = false)
    @Builder.Default
    private Boolean dataProcessingConsent = false;

    /**
     * Дата и время получения согласия на обработку ПД
     */
    @Column(name = "consent_date")
    private LocalDateTime consentDate;

    /**
     * IP-адрес пользователя при получении согласия
     * Для доказательства факта согласия
     */
    @Column(name = "consent_ip", length = 45)
    private String consentIp;

    /**
     * Версия политики обработки ПД, с которой согласился пользователь
     */
    @Column(name = "consent_policy_version", length = 20)
    private String consentPolicyVersion;

    /**
     * Согласие на получение маркетинговых рассылок
     */
    @Column(name = "marketing_consent", nullable = false)
    @Builder.Default
    private Boolean marketingConsent = false;

    /**
     * Дата отзыва согласия (если было отозвано)
     */
    @Column(name = "consent_withdrawn_date")
    private LocalDateTime consentWithdrawnDate;

    // =========================================
    // Статусы и флаги
    // =========================================

    @Column(name = "is_email_verified", nullable = false)
    @Builder.Default
    private Boolean isEmailVerified = false;

    @Column(name = "email_verification_token", length = 255)
    private String emailVerificationToken;

    @Column(name = "email_verification_expires_at")
    private LocalDateTime emailVerificationExpiresAt;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "is_locked", nullable = false)
    @Builder.Default
    private Boolean isLocked = false;

    @Column(name = "lock_reason", length = 500)
    private String lockReason;

    @Column(name = "failed_login_attempts", nullable = false)
    @Builder.Default
    private Integer failedLoginAttempts = 0;

    @Column(name = "last_failed_login_at")
    private LocalDateTime lastFailedLoginAt;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "last_login_ip", length = 45)
    private String lastLoginIp;

    @Column(name = "password_changed_at")
    private LocalDateTime passwordChangedAt;

    @Column(name = "password_reset_token", length = 255)
    private String passwordResetToken;

    @Column(name = "password_reset_expires_at")
    private LocalDateTime passwordResetExpiresAt;

    // =========================================
    // Двухфакторная аутентификация
    // =========================================

    @Column(name = "two_factor_enabled", nullable = false)
    @Builder.Default
    private Boolean twoFactorEnabled = false;

    @Column(name = "two_factor_secret", length = 255)
    private String twoFactorSecret;

    // =========================================
    // Связи с профилями
    // =========================================

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Student studentProfile;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Teacher teacherProfile;

    // =========================================
    // UserDetails implementation
    // =========================================

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !isLocked && isActive;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive && !getIsDeleted() && dataProcessingConsent;
    }

    // =========================================
    // Utility methods
    // =========================================

    public String getFullName() {
        StringBuilder sb = new StringBuilder();
        sb.append(lastName).append(" ").append(firstName);
        if (patronymic != null && !patronymic.isBlank()) {
            sb.append(" ").append(patronymic);
        }
        return sb.toString();
    }

    public String getShortName() {
        return firstName + " " + lastName;
    }

    public boolean isStudent() {
        return role == UserRole.STUDENT;
    }

    public boolean isTeacher() {
        return role == UserRole.TEACHER;
    }

    public boolean isAdmin() {
        return role == UserRole.ADMIN;
    }

    /**
     * Проверяет, дано ли согласие на обработку ПД
     */
    public boolean hasValidConsent() {
        return dataProcessingConsent && consentDate != null && consentWithdrawnDate == null;
    }

    /**
     * Фиксирует согласие на обработку ПД
     */
    public void grantConsent(String ipAddress, String policyVersion) {
        this.dataProcessingConsent = true;
        this.consentDate = LocalDateTime.now();
        this.consentIp = ipAddress;
        this.consentPolicyVersion = policyVersion;
        this.consentWithdrawnDate = null;
    }

    /**
     * Отзывает согласие на обработку ПД
     * ВНИМАНИЕ: После отзыва аккаунт должен быть деактивирован!
     */
    public void withdrawConsent() {
        this.consentWithdrawnDate = LocalDateTime.now();
        this.isActive = false;
    }

    /**
     * Инкрементирует счётчик неудачных попыток входа
     */
    public void incrementFailedLoginAttempts() {
        this.failedLoginAttempts++;
        this.lastFailedLoginAt = LocalDateTime.now();
        
        // Блокировка после 5 неудачных попыток
        if (this.failedLoginAttempts >= 5) {
            this.isLocked = true;
            this.lockReason = "Превышено количество попыток входа";
        }
    }

    /**
     * Сбрасывает счётчик неудачных попыток после успешного входа
     */
    public void resetFailedLoginAttempts() {
        this.failedLoginAttempts = 0;
        this.lastFailedLoginAt = null;
    }

    /**
     * Регистрирует успешный вход
     */
    public void recordSuccessfulLogin(String ipAddress) {
        this.lastLoginAt = LocalDateTime.now();
        this.lastLoginIp = ipAddress;
        resetFailedLoginAttempts();
    }
}
