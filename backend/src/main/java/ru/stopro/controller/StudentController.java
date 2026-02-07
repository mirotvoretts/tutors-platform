package ru.stopro.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.stopro.domain.entity.User;
import ru.stopro.dto.student.StudentDashboardDto;
import ru.stopro.repository.UserRepository;
import ru.stopro.service.StudentDashboardService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Контроллер личного кабинета ученика
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/student")
@RequiredArgsConstructor
@Tag(name = "Student", description = "API личного кабинета ученика")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

    private final StudentDashboardService dashboardService;
    private final UserRepository userRepository;

    /**
     * Получить полный дашборд ученика
     */
    @Operation(summary = "Дашборд", description = "Возвращает полную информацию для дашборда ученика")
    @GetMapping("/dashboard")
    public ResponseEntity<StudentDashboardDto> getDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        StudentDashboardDto dashboard = dashboardService.getDashboard(user.getId());
        return ResponseEntity.ok(dashboard);
    }

    /**
     * Получить активные задания
     */
    @Operation(summary = "Активные задания", description = "Возвращает список активных тестов и ДЗ")
    @GetMapping("/assignments/active")
    public ResponseEntity<List<StudentDashboardDto.AssignmentInfo>> getActiveAssignments(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<StudentDashboardDto.AssignmentInfo> assignments = 
                dashboardService.getActiveAssignments(user.getId());
        return ResponseEntity.ok(assignments);
    }

    /**
     * Получить прогресс по темам
     */
    @Operation(summary = "Прогресс по темам", description = "Возвращает статистику по каждой теме")
    @GetMapping("/progress/topics")
    public ResponseEntity<List<StudentDashboardDto.TopicProgress>> getTopicProgress(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<StudentDashboardDto.TopicProgress> progress = 
                dashboardService.getTopicProgress(user.getId());
        return ResponseEntity.ok(progress);
    }

    /**
     * Получить активность за неделю
     */
    @Operation(summary = "Недельная активность", description = "Возвращает статистику решённых задач по дням")
    @GetMapping("/activity/weekly")
    public ResponseEntity<List<StudentDashboardDto.DailyActivity>> getWeeklyActivity(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<StudentDashboardDto.DailyActivity> activity = 
                dashboardService.getWeeklyActivity(user.getId());
        return ResponseEntity.ok(activity);
    }

    /**
     * Получить рекомендации ИИ
     */
    @Operation(summary = "Рекомендации", description = "Возвращает персональные рекомендации от ИИ")
    @GetMapping("/recommendations")
    public ResponseEntity<List<StudentDashboardDto.Recommendation>> getRecommendations(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<StudentDashboardDto.Recommendation> recommendations = 
                dashboardService.getRecommendations(user.getId());
        return ResponseEntity.ok(recommendations);
    }

    /**
     * Получить достижения
     */
    @Operation(summary = "Достижения", description = "Возвращает список достижений ученика")
    @GetMapping("/achievements")
    public ResponseEntity<List<StudentDashboardDto.Achievement>> getAchievements(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<StudentDashboardDto.Achievement> achievements = 
                dashboardService.getAchievements(user.getId());
        return ResponseEntity.ok(achievements);
    }

    /**
     * Обновить профиль ученика
     */
    @Operation(summary = "Обновить профиль", description = "Изменяет данные профиля ученика")
    @PutMapping("/profile")
    public ResponseEntity<Map<String, String>> updateProfile(
            @Valid @RequestBody Map<String, Object> profileData,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        dashboardService.updateProfile(user.getId(), profileData);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Профиль обновлён");
        return ResponseEntity.ok(response);
    }

    /**
     * Установить целевой балл
     */
    @Operation(summary = "Установить цель", description = "Устанавливает целевой балл ЕГЭ")
    @PutMapping("/target-score")
    public ResponseEntity<Map<String, String>> setTargetScore(
            @RequestParam int targetScore,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        dashboardService.setTargetScore(user.getId(), targetScore);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Целевой балл установлен: " + targetScore);
        return ResponseEntity.ok(response);
    }
}
