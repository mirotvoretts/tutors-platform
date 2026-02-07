package ru.stopro.service;

import org.springframework.stereotype.Service;
import ru.stopro.domain.entity.Attempt;

import java.util.concurrent.CompletableFuture;

@Service
public class AiAnalysisService {

    public CompletableFuture<Void> analyzeAttempt(Attempt attempt) {
        // Заглушка для компиляции. Реальная логика будет добавлена при интеграции с AI-сервисом.
        return CompletableFuture.completedFuture(null);
    }
}
