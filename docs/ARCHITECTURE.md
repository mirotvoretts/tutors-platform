# СТОПРО - Архитектура платформы

## Обзор системы

СТОПРО - EdTech платформа для подготовки к профильной математике ЕГЭ/ОГЭ.

## Компоненты

### 1. Backend (Java Spring Boot 3.4+)
- **Порт**: 8080
- **База данных**: PostgreSQL 16
- **Аутентификация**: JWT + Spring Security
- **Слои**: Controller → Service → Repository → Entity

### 2. AI Microservice (Python FastAPI)
- **Порт**: 8000
- **Очередь задач**: Celery + Redis
- **Функции**:
  - OCR для рукописных решений
  - Анализ ошибок через SymPy
  - Генерация рекомендаций через LLM

### 3. Frontend (React + TypeScript)
- **Порт**: 3000 (dev) / 80 (prod через nginx)
- **Стейт**: Zustand
- **API клиент**: Axios + React Query

### 4. Gateway (Nginx)
- **Порт**: 80/443
- **Роутинг**:
  - `/api/v1/*` → Backend
  - `/ai/*` → AI Service
  - `/*` → Frontend

## Схема базы данных

```
users (id, email, password_hash, role, created_at)
students (id, user_id, grade, target_score, group_id)
teachers (id, user_id, specialization)
groups (id, teacher_id, name, level)
tasks (id, topic_id, difficulty, content, answer, solution)
topics (id, name, parent_id, ege_number)
task_results (id, student_id, task_id, answer, is_correct, time_spent, ai_feedback)
homework (id, teacher_id, group_id, title, deadline, tasks[])
progress_stats (id, student_id, topic_id, success_rate, total_attempts)
```

## API Endpoints

### Backend API
- `POST /api/v1/auth/register` - Регистрация
- `POST /api/v1/auth/login` - Авторизация
- `GET /api/v1/tasks` - Получить задачи
- `POST /api/v1/tasks/generate` - Генерация варианта
- `GET /api/v1/students/{id}/stats` - Статистика ученика
- `POST /api/v1/homework` - Создать ДЗ
- `GET /api/v1/groups` - Группы учителя

### AI Service API
- `POST /ai/analyze-solution` - Анализ решения
- `POST /ai/ocr` - Распознавание рукописного текста
- `GET /ai/recommendations/{student_id}` - Рекомендации
