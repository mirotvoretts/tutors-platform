package ru.stopro.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.stopro.domain.entity.Student;
import ru.stopro.domain.enums.RecommendationType;
import ru.stopro.domain.enums.TopicStatus;
import ru.stopro.dto.student.StudentDashboardDto;
import ru.stopro.repository.AiRecommendationRepository;
import ru.stopro.repository.AttemptRepository;
import ru.stopro.repository.AssignmentRepository;
import ru.stopro.repository.StudentRepository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudentDashboardService {

    private final StudentRepository studentRepository;
    private final AttemptRepository attemptRepository;
    private final AssignmentRepository assignmentRepository;
    private final AiRecommendationRepository aiRecommendationRepository;

    /**
     * Получить полный дашборд ученика
     */
    public StudentDashboardDto getDashboard(UUID userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return StudentDashboardDto.builder()
                .completedTasksTotal(student.getTotalSolved())
                .solvedProblemsTotal(student.getCorrectAnswers())
                .daysStreak(calculateStreak(userId))
                .targetScore(student.getTargetScore())
                .currentScore(calculatePredictedScore(student))
                .weeklyActivity(null) // Заглушка - в реальности Map<String, Integer>
                .topicProgress(getTopicProgress(userId))
                .activeAssignments(getActiveAssignments(userId))
                .recommendations(getRecommendations(userId))
                .achievements(getAchievements(userId))
                .build();
    }

    /**
     * Получить активные задания
     */
    public List<StudentDashboardDto.AssignmentInfo> getActiveAssignments(UUID userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Заглушка - в реальности получаем из assignmentRepository
        List<StudentDashboardDto.AssignmentInfo> assignments = new ArrayList<>();
        
        assignments.add(StudentDashboardDto.AssignmentInfo.builder()
                .id(UUID.randomUUID().toString())
                .title("Тренировочный вариант ЕГЭ")
                .deadline(LocalDateTime.now().plusDays(3))
                .tasksCount(19)
                .timeLimit(120)
                .build());

        return assignments;
    }

    /**
     * Получить прогресс по темам
     */
    public List<StudentDashboardDto.TopicProgress> getTopicProgress(UUID userId) {
        // Заглушка - в реальности получаем из progressStatsRepository
        List<StudentDashboardDto.TopicProgress> progress = new ArrayList<>();
        
        progress.add(StudentDashboardDto.TopicProgress.builder()
                .topicId(UUID.randomUUID().toString())
                .topicName("Уравнения")
                .progressPercent(84)
                .solvedCount(45)
                .totalCount(54)
                .status(TopicStatus.STRONG)
                .build());
        
        progress.add(StudentDashboardDto.TopicProgress.builder()
                .topicId(UUID.randomUUID().toString())
                .topicName("Тригонометрия")
                .progressPercent(60)
                .solvedCount(20)
                .totalCount(33)
                .status(TopicStatus.IN_PROGRESS)
                .build());
        
        progress.add(StudentDashboardDto.TopicProgress.builder()
                .topicId(UUID.randomUUID().toString())
                .topicName("Задачи с параметром")
                .progressPercent(30)
                .solvedCount(10)
                .totalCount(33)
                .status(TopicStatus.NOT_STARTED)
                .build());

        return progress;
    }

    /**
     * Получить активность за неделю
     */
    public List<StudentDashboardDto.DailyActivity> getWeeklyActivity(UUID userId) {
        List<StudentDashboardDto.DailyActivity> activity = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            activity.add(StudentDashboardDto.DailyActivity.builder()
                    .date(date)
                    .dayOfWeek(date.getDayOfWeek().toString().substring(0, 3))
                    .solved((int) (Math.random() * 15) + 1)
                    .correct((int) (Math.random() * 10) + 1)
                    .timeSpentMinutes((int) (Math.random() * 60) + 15)
                    .build());
        }
        
        return activity;
    }

    /**
     * Получить рекомендации ИИ
     */
    public List<StudentDashboardDto.Recommendation> getRecommendations(UUID userId) {
        List<StudentDashboardDto.Recommendation> recommendations = new ArrayList<>();
        
        recommendations.add(StudentDashboardDto.Recommendation.builder()
                .id(UUID.randomUUID().toString())
                .type(RecommendationType.WEAK_TOPIC)
                .priority("1")
                .title("Подтяни тригонометрию")
                .description("Твой процент решения задач по тригонометрии ниже среднего. Порешай ещё 10 задач.")
                .link("/tasks?topic=trigonometry")
                .build());
        
        recommendations.add(StudentDashboardDto.Recommendation.builder()
                .id(UUID.randomUUID().toString())
                .type(RecommendationType.STREAK)
                .priority("2")
                .title("Не теряй streak!")
                .description("Ты решаешь задачи 5 дней подряд. Продолжай!")
                .link("")
                .build());

        return recommendations;
    }

    /**
     * Получить достижения
     */
    public List<StudentDashboardDto.Achievement> getAchievements(UUID userId) {
        List<StudentDashboardDto.Achievement> achievements = new ArrayList<>();
        
        achievements.add(StudentDashboardDto.Achievement.builder()
                .id(UUID.randomUUID().toString())
                .title("Первые шаги")
                .description("Решено 10 задач")
                .iconUrl("🎯")
                .receivedAt(LocalDateTime.now().minusDays(10))
                .build());
        
        achievements.add(StudentDashboardDto.Achievement.builder()
                .id(UUID.randomUUID().toString())
                .title("На волне")
                .description("7 дней подряд")
                .iconUrl("🔥")
                .receivedAt(LocalDateTime.now().minusDays(2))
                .build());

        return achievements;
    }

    /**
     * Вычислить streak (дни подряд)
     */
    public int calculateStreak(UUID userId) {
        // Заглушка - в реальности считаем по attemptRepository
        return 5;
    }

    /**
     * Обновить профиль
     */
    @Transactional
    public void updateProfile(UUID userId, Map<String, Object> profileData) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        // Обновляем поля
        if (profileData.containsKey("grade")) {
            student.setGrade((Integer) profileData.get("grade"));
        }
        
        studentRepository.save(student);
    }

    /**
     * Установить целевой балл
     */
    @Transactional
    public void setTargetScore(UUID userId, int targetScore) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        student.setTargetScore(targetScore);
        studentRepository.save(student);
    }

    private int calculatePredictedScore(Student student) {
        if (student.getTotalSolved() == 0) return 0;
        double successRate = (double) student.getCorrectAnswers() / student.getTotalSolved() * 100;
        // Простая формула прогноза
        return (int) Math.min(100, successRate * 1.1);
    }
}
