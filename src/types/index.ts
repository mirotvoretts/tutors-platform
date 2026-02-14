// СТОПРО - Type Definitions (aligned with backend DTOs)// СТОПРО - Type Definitions



export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';



export interface User {export interface User {

  id: string;  id: string;

  username: string;  email: string;

  fullName: string;  firstName: string;

  role: UserRole;  lastName: string;

}  role: UserRole;

  avatarUrl?: string;

// DTO, возвращаемый POST /api/v1/groups  createdAt: string;

export interface StudyGroup {}

  id: string;

  name: string;export interface Student extends User {

  teacherId: string;  role: 'STUDENT';

  inviteCode: string;  grade: number; // 10 или 11

  studentsCount: number;  targetScore: number; // Целевой балл ЕГЭ

}  groupId?: string;

  teacherId?: string;

// Учётные данные ученика (возвращается при добавлении)}

export interface StudentCredentials {

  fullName: string;export interface Teacher extends User {

  username: string;  role: 'TEACHER';

  password: string;  specialization: string;

}  studentsCount: number;

  groupsCount: number;

// Ответ при добавлении учеников в группу}

export interface AddStudentsResponse {

  groupId: string;export interface Group {

  credentials: StudentCredentials[];  id: string;

}  name: string;

  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

// Auth types  teacherId: string;

export interface LoginRequest {  studentsCount: number;

  username: string;  createdAt: string;

  password: string;}

}

export interface Topic {

export interface RegisterRequest {  id: string;

  username: string;  name: string;

  password: string;  egeNumber?: number; // Номер задания ЕГЭ (1-19)

  fullName: string;  parentId?: string;

  role: UserRole;  tasksCount: number;

}}



export interface AuthResponse {export interface Task {

  accessToken: string;  id: string;

  refreshToken: string;  topicId: string;

  user: User;  topicName: string;

}  egeNumber: number;

  difficulty: 'EASY' | 'MEDIUM' | 'HARD';

// ========================================  content: string; // Условие задачи (может содержать LaTeX)

// Типы ниже — заглушки для будущих фич.  answer: string;

// Страницы, которые их используют, пока  solution?: string;

// показывают пустое состояние.  imageUrl?: string;

// ========================================  points: number;

}

export interface Topic {

  id: string;export interface TaskResult {

  name: string;  id: string;

  egeNumber?: number;  taskId: string;

  questionsCount: number;  studentId: string;

}  answer: string;

  isCorrect: boolean;

export interface Question {  timeSpent: number; // в секундах

  id: string;  aiFeedback?: string;

  content: string;  createdAt: string;

  answer?: string;}

  solution?: string;

  difficulty: 'EASY' | 'MEDIUM' | 'HARD';export interface Homework {

  egeNumber?: number;  id: string;

  topicName?: string;  teacherId: string;

}  groupId: string;

  groupName: string;

export interface Assignment {  title: string;

  id: string;  description?: string;

  title: string;  deadline: string;

  deadline?: string;  tasks: Task[];

  status: 'ACTIVE' | 'COMPLETED' | 'OVERDUE';  status: 'ACTIVE' | 'COMPLETED' | 'OVERDUE';

  completedCount: number;  completedCount: number;

  totalCount: number;  totalCount: number;

}}



export interface AIRecommendation {export interface StudentProgress {

  id: string;  studentId: string;

  type: 'FOCUS_TOPIC' | 'REVIEW' | 'PRACTICE' | 'TAKE_BREAK';  studentName: string;

  title: string;  topicId: string;

  description: string;  topicName: string;

  priority: 'HIGH' | 'MEDIUM' | 'LOW';  totalAttempts: number;

}  correctAttempts: number;

  successRate: number;

export interface TopicStat {  lastAttempt: string;

  topicId: string;}

  topicName: string;

  egeNumber: number;export interface ProgressStats {

  totalAttempts: number;  totalTasks: number;

  successRate: number;  completedTasks: number;

  status: 'WEAK' | 'NORMAL' | 'STRONG';  correctAnswers: number;

}  averageTime: number;

  weeklyProgress: WeeklyProgress[];

export interface WeeklyProgress {  topicStats: TopicStat[];

  date: string;}

  solved: number;

  correct: number;export interface WeeklyProgress {

}  date: string;

  solved: number;
  correct: number;
}

export interface TopicStat {
  topicId: string;
  topicName: string;
  egeNumber: number;
  totalAttempts: number;
  successRate: number;
  status: 'WEAK' | 'NORMAL' | 'STRONG';
}

export interface AIRecommendation {
  id: string;
  studentId: string;
  type: 'FOCUS_TOPIC' | 'REVIEW' | 'PRACTICE' | 'TAKE_BREAK';
  title: string;
  description: string;
  topicId?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
}

export interface AIAnalysis {
  id: string;
  imageUrl: string;
  recognizedText: string;
  errors: AnalysisError[];
  recommendations: string[];
  score: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
}

export interface AnalysisError {
  type: 'CALCULATION' | 'CONCEPT' | 'LOGIC' | 'NOTATION';
  description: string;
  location?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  grade?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
