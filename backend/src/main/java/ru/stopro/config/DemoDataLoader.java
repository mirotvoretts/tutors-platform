package ru.stopro.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.stopro.domain.entity.User;
import ru.stopro.domain.enums.UserRole;
import ru.stopro.repository.UserRepository;

/**
 * Создаёт демо-пользователей при первом запуске,
 * чтобы «Войти как учитель» / «Войти как ученик» работали с бэкендом (создание групп и т.д.).
 */
@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class DemoDataLoader implements ApplicationRunner {

    public static final String DEMO_TEACHER_USERNAME = "demo_teacher";
    public static final String DEMO_STUDENT_USERNAME = "demo_student";
    public static final String DEMO_PASSWORD = "demo";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        createDemoTeacher();
        createDemoStudent();
    }

    private void createDemoTeacher() {
        if (userRepository.findByUsername(DEMO_TEACHER_USERNAME).isPresent()) {
            return;
        }
        User demo = User.builder()
                .username(DEMO_TEACHER_USERNAME)
                .passwordHash(passwordEncoder.encode(DEMO_PASSWORD))
                .role(UserRole.TEACHER)
                .fullName("Демо Учитель")
                .dataConsentStatus(true)
                .build();
        userRepository.save(demo);
        log.info("Создан демо-учитель: {}", DEMO_TEACHER_USERNAME);
    }

    private void createDemoStudent() {
        if (userRepository.findByUsername(DEMO_STUDENT_USERNAME).isPresent()) {
            return;
        }
        User demo = User.builder()
                .username(DEMO_STUDENT_USERNAME)
                .passwordHash(passwordEncoder.encode(DEMO_PASSWORD))
                .role(UserRole.STUDENT)
                .fullName("Демо Ученик")
                .dataConsentStatus(true)
                .build();
        userRepository.save(demo);
        log.info("Создан демо-ученик: {}", DEMO_STUDENT_USERNAME);
    }
}
