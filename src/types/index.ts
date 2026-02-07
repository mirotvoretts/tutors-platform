// СТОПРО - Type Definitions

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface Student extends User {
  role: 'STUDENT';
  grade: number; // 10 или 11
  targetScore: number; // Целевой балл ЕГЭ
  groupId?: string;
  teacherId?: string;
}

export interface Teacher extends User {
  role: 'TEACHER';
  specialization: string;
  studentsCount: number;
  groupsCount: number;
}

export interface Group {
  id: string;
  name: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  teacherId: string;
  studentsCount: number;
  createdAt: string;
}

export interface Topic {
  id: string;
  name: string;
  egeNumber?: number; // Номер задания ЕГЭ (1-19)
  parentId?: string;
  tasksCount: number;
}

export interface Task {
  id: string;
  topicId: string;
  topicName: string;
  egeNumber: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  content: string; // Условие задачи (может содержать LaTeX)
  answer: string;
  solution?: string;
  imageUrl?: string;
  points: number;
}

export interface TaskResult {
  id: string;
  taskId: string;
  studentId: string;
  answer: string;
  isCorrect: boolean;
  timeSpent: number; // в секундах
  aiFeedback?: string;
  createdAt: string;
}

export interface Homework {
  id: string;
  teacherId: string;
  groupId: string;
  groupName: string;
  title: string;
  description?: string;
  deadline: string;
  tasks: Task[];
  status: 'ACTIVE' | 'COMPLETED' | 'OVERDUE';
  completedCount: number;
  totalCount: number;
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  topicId: string;
  topicName: string;
  totalAttempts: number;
  correctAttempts: number;
  successRate: number;
  lastAttempt: string;
}

export interface ProgressStats {
  totalTasks: number;
  completedTasks: number;
  correctAnswers: number;
  averageTime: number;
  weeklyProgress: WeeklyProgress[];
  topicStats: TopicStat[];
}

export interface WeeklyProgress {
  date: string;
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
