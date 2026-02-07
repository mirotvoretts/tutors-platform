package ru.stopro.dto.question;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.stopro.domain.entity.Question;
import ru.stopro.domain.enums.QuestionType;
import ru.stopro.domain.enums.TaskDifficulty;
import ru.stopro.domain.enums.TaskSource;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO для вопроса/задачи
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDto {

    private UUID id;
    private UUID topicId;
    private String topicName;
    private Integer egeNumber;
    private TaskDifficulty difficulty;
    private QuestionType questionType;
    
    // Содержимое
    private String content;
    private String contentPlain;
    private String answer;
    private String solution;
    private String hint;
    private String imageUrl;
    
    // Метаданные
    private Integer points;
    private Integer estimatedTimeMinutes;
    private TaskSource source;
    private Integer sourceYear;
    
    // Статистика
    private Double successRate;
    private Integer timesAttempted;
    private Integer averageTimeSeconds;
    
    // Авторство
    private UUID authorId;
    private String authorName;
    private Boolean isVerified;
    
    // Теги
    private String tags;
    private String keywords;
    
    private LocalDateTime createdAt;

    /**
     * Конвертация из Entity
     */
    public static QuestionDto fromEntity(Question question) {
        QuestionDtoBuilder builder = QuestionDto.builder()
                .id(question.getId())
                .egeNumber(question.getEgeNumber())
                .difficulty(question.getDifficulty())
                .questionType(question.getQuestionType())
                .content(question.getContent())
                .contentPlain(question.getContentPlain())
                .answer(question.getAnswer())
                .solution(question.getSolution())
                .hint(question.getHint())
                .imageUrl(question.getImageUrl())
                .points(question.getPoints())
                .estimatedTimeMinutes(question.getEstimatedTimeMinutes())
                .source(question.getSource())
                .sourceYear(question.getSourceYear())
                .successRate(question.getSuccessRate())
                .timesAttempted(question.getTimesAttempted())
                .averageTimeSeconds(question.getAverageTimeSeconds())
                .isVerified(question.getIsVerified())
                .tags(question.getTags())
                .keywords(question.getKeywords())
                .createdAt(question.getCreatedAt());

        if (question.getTopic() != null) {
            builder.topicId(question.getTopic().getId());
            builder.topicName(question.getTopic().getName());
        }

        if (question.getAuthor() != null) {
            builder.authorId(question.getAuthor().getId());
            if (question.getAuthor().getUser() != null) {
                builder.authorName(question.getAuthor().getUser().getFullName());
            }
        }

        return builder.build();
    }
    
    /**
     * Конвертация для ученика (без ответа и решения)
     */
    public static QuestionDto fromEntityForStudent(Question question) {
        QuestionDto dto = fromEntity(question);
        dto.setAnswer(null);
        dto.setSolution(null);
        return dto;
    }
}
