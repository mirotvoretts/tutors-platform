import type {
  Student,
  Teacher,
  Group,
  Topic,
  Task,
  Homework,
  ProgressStats,
  AIRecommendation,
} from '@/types';

// Demo Teacher
export const demoTeacher: Teacher = {
  id: 't1',
  email: 'teacher@stopro.ru',
  firstName: 'Анна',
  lastName: 'Петрова',
  role: 'TEACHER',
  specialization: 'Профильная математика ЕГЭ',
  studentsCount: 45,
  groupsCount: 4,
  createdAt: '2024-01-15',
};

// Demo Student
export const demoStudent: Student = {
  id: 's1',
  email: 'student@stopro.ru',
  firstName: 'Максим',
  lastName: 'Иванов',
  role: 'STUDENT',
  grade: 11,
  targetScore: 85,
  groupId: 'g1',
  teacherId: 't1',
  createdAt: '2024-02-01',
};

// Groups
export const groups: Group[] = [
  { id: 'g1', name: 'Группа 11A - Продвинутые', level: 'ADVANCED', teacherId: 't1', studentsCount: 12, createdAt: '2024-01-15' },
  { id: 'g2', name: 'Группа 11Б - Средний уровень', level: 'INTERMEDIATE', teacherId: 't1', studentsCount: 15, createdAt: '2024-01-20' },
  { id: 'g3', name: 'Группа 10А - Начинающие', level: 'BEGINNER', teacherId: 't1', studentsCount: 10, createdAt: '2024-02-01' },
  { id: 'g4', name: 'Индивидуальные', level: 'ADVANCED', teacherId: 't1', studentsCount: 8, createdAt: '2024-02-15' },
];

// Students list
export const students: Student[] = [
  { id: 's1', email: 'ivanov@mail.ru', firstName: 'Максим', lastName: 'Иванов', role: 'STUDENT', grade: 11, targetScore: 85, groupId: 'g1', teacherId: 't1', createdAt: '2024-02-01' },
  { id: 's2', email: 'petrova@mail.ru', firstName: 'Анастасия', lastName: 'Петрова', role: 'STUDENT', grade: 11, targetScore: 90, groupId: 'g1', teacherId: 't1', createdAt: '2024-02-03' },
  { id: 's3', email: 'sidorov@mail.ru', firstName: 'Дмитрий', lastName: 'Сидоров', role: 'STUDENT', grade: 11, targetScore: 75, groupId: 'g2', teacherId: 't1', createdAt: '2024-02-05' },
  { id: 's4', email: 'kozlova@mail.ru', firstName: 'Елена', lastName: 'Козлова', role: 'STUDENT', grade: 10, targetScore: 80, groupId: 'g3', teacherId: 't1', createdAt: '2024-02-10' },
  { id: 's5', email: 'novikov@mail.ru', firstName: 'Артём', lastName: 'Новиков', role: 'STUDENT', grade: 11, targetScore: 95, groupId: 'g1', teacherId: 't1', createdAt: '2024-02-12' },
  { id: 's6', email: 'fedorova@mail.ru', firstName: 'Мария', lastName: 'Фёдорова', role: 'STUDENT', grade: 11, targetScore: 70, groupId: 'g2', teacherId: 't1', createdAt: '2024-02-15' },
];

// Topics (EGE structure)
export const topics: Topic[] = [
  { id: 't1', name: 'Вычисления и преобразования', egeNumber: 1, tasksCount: 150 },
  { id: 't2', name: 'Уравнения', egeNumber: 2, tasksCount: 120 },
  { id: 't3', name: 'Планиметрия (базовая)', egeNumber: 3, tasksCount: 100 },
  { id: 't4', name: 'Теория вероятностей', egeNumber: 4, tasksCount: 80 },
  { id: 't5', name: 'Теория вероятностей (продв.)', egeNumber: 5, tasksCount: 90 },
  { id: 't6', name: 'Уравнения (продв.)', egeNumber: 6, tasksCount: 110 },
  { id: 't7', name: 'Производная и первообразная', egeNumber: 7, tasksCount: 95 },
  { id: 't8', name: 'Стереометрия (базовая)', egeNumber: 8, tasksCount: 85 },
  { id: 't9', name: 'Текстовые задачи', egeNumber: 9, tasksCount: 130 },
  { id: 't10', name: 'Графики функций', egeNumber: 10, tasksCount: 75 },
  { id: 't11', name: 'Прикладные задачи', egeNumber: 11, tasksCount: 60 },
  { id: 't12', name: 'Тригонометрия', egeNumber: 13, tasksCount: 140 },
  { id: 't13', name: 'Стереометрия (сложная)', egeNumber: 14, tasksCount: 100 },
  { id: 't14', name: 'Неравенства', egeNumber: 15, tasksCount: 110 },
  { id: 't15', name: 'Финансовая математика', egeNumber: 16, tasksCount: 70 },
  { id: 't16', name: 'Планиметрия (сложная)', egeNumber: 17, tasksCount: 90 },
  { id: 't17', name: 'Задачи с параметром', egeNumber: 18, tasksCount: 80 },
  { id: 't18', name: 'Теория чисел', egeNumber: 19, tasksCount: 65 },
];

// Sample tasks
export const tasks: Task[] = [
  {
    id: 'task1',
    topicId: 't1',
    topicName: 'Вычисления и преобразования',
    egeNumber: 1,
    difficulty: 'EASY',
    content: 'Найдите значение выражения: (2³ × 3²) / 6²',
    answer: '2',
    solution: '(8 × 9) / 36 = 72 / 36 = 2',
    points: 1,
  },
  {
    id: 'task2',
    topicId: 't2',
    topicName: 'Уравнения',
    egeNumber: 2,
    difficulty: 'EASY',
    content: 'Решите уравнение: 3x - 7 = 2x + 5',
    answer: '12',
    solution: '3x - 2x = 5 + 7; x = 12',
    points: 1,
  },
  {
    id: 'task3',
    topicId: 't4',
    topicName: 'Теория вероятностей',
    egeNumber: 4,
    difficulty: 'MEDIUM',
    content: 'В урне 5 белых и 3 чёрных шара. Найдите вероятность того, что случайно вынутый шар окажется белым.',
    answer: '0.625',
    solution: 'P = 5 / (5 + 3) = 5/8 = 0.625',
    points: 1,
  },
  {
    id: 'task4',
    topicId: 't12',
    topicName: 'Тригонометрия',
    egeNumber: 13,
    difficulty: 'HARD',
    content: 'Решите уравнение: cos(2x) + sin²(x) = 0.5',
    answer: 'π/6 + πn, n ∈ Z',
    solution: '1 - 2sin²(x) + sin²(x) = 0.5; 1 - sin²(x) = 0.5; sin²(x) = 0.5; sin(x) = ±√2/2',
    points: 2,
  },
  {
    id: 'task5',
    topicId: 't17',
    topicName: 'Задачи с параметром',
    egeNumber: 18,
    difficulty: 'HARD',
    content: 'Найдите все значения параметра a, при которых уравнение x² + ax + 1 = 0 имеет ровно два различных корня.',
    answer: 'a ∈ (-∞; -2) ∪ (2; +∞)',
    solution: 'D > 0; a² - 4 > 0; a < -2 или a > 2',
    points: 4,
  },
];

// Homeworks
export const homeworks: Homework[] = [
  {
    id: 'hw1',
    teacherId: 't1',
    groupId: 'g1',
    groupName: 'Группа 11A - Продвинутые',
    title: 'Тригонометрия: базовые уравнения',
    description: 'Повторение простейших тригонометрических уравнений',
    deadline: '2025-01-20',
    tasks: tasks.slice(0, 3),
    status: 'ACTIVE',
    completedCount: 8,
    totalCount: 12,
  },
  {
    id: 'hw2',
    teacherId: 't1',
    groupId: 'g2',
    groupName: 'Группа 11Б - Средний уровень',
    title: 'Теория вероятностей',
    deadline: '2025-01-18',
    tasks: tasks.slice(2, 4),
    status: 'ACTIVE',
    completedCount: 10,
    totalCount: 15,
  },
  {
    id: 'hw3',
    teacherId: 't1',
    groupId: 'g1',
    groupName: 'Группа 11A - Продвинутые',
    title: 'Параметры и неравенства',
    deadline: '2025-01-10',
    tasks: tasks.slice(3, 5),
    status: 'COMPLETED',
    completedCount: 12,
    totalCount: 12,
  },
];

// Progress stats for student
export const studentProgress: ProgressStats = {
  totalTasks: 156,
  completedTasks: 142,
  correctAnswers: 118,
  averageTime: 245, // seconds
  weeklyProgress: [
    { date: '2025-01-06', solved: 12, correct: 10 },
    { date: '2025-01-07', solved: 8, correct: 7 },
    { date: '2025-01-08', solved: 15, correct: 12 },
    { date: '2025-01-09', solved: 10, correct: 9 },
    { date: '2025-01-10', solved: 18, correct: 15 },
    { date: '2025-01-11', solved: 5, correct: 4 },
    { date: '2025-01-12', solved: 14, correct: 11 },
  ],
  topicStats: [
    { topicId: 't1', topicName: 'Вычисления', egeNumber: 1, totalAttempts: 25, successRate: 92, status: 'STRONG' },
    { topicId: 't2', topicName: 'Уравнения', egeNumber: 2, totalAttempts: 20, successRate: 85, status: 'STRONG' },
    { topicId: 't4', topicName: 'Вероятности', egeNumber: 4, totalAttempts: 18, successRate: 78, status: 'NORMAL' },
    { topicId: 't7', topicName: 'Производная', egeNumber: 7, totalAttempts: 15, successRate: 60, status: 'WEAK' },
    { topicId: 't12', topicName: 'Тригонометрия', egeNumber: 13, totalAttempts: 22, successRate: 55, status: 'WEAK' },
    { topicId: 't17', topicName: 'Параметры', egeNumber: 18, totalAttempts: 10, successRate: 40, status: 'WEAK' },
  ],
};

// AI Recommendations
export const aiRecommendations: AIRecommendation[] = [
  {
    id: 'r1',
    studentId: 's1',
    type: 'FOCUS_TOPIC',
    title: 'Сосредоточьтесь на тригонометрии',
    description: 'Ваш показатель успешности 55% ниже среднего. Рекомендуем пройти дополнительные задания по теме "Тригонометрические уравнения".',
    topicId: 't12',
    priority: 'HIGH',
    createdAt: '2025-01-12',
  },
  {
    id: 'r2',
    studentId: 's1',
    type: 'REVIEW',
    title: 'Повторите производную',
    description: 'Заметили частые ошибки в применении правил дифференцирования. Посмотрите разбор типичных ошибок.',
    topicId: 't7',
    priority: 'MEDIUM',
    createdAt: '2025-01-11',
  },
  {
    id: 'r3',
    studentId: 's1',
    type: 'PRACTICE',
    title: 'Задачи с параметром',
    description: 'Для достижения целевого балла 85+ необходимо уверенно решать задание 18. Начните с базовых задач.',
    topicId: 't17',
    priority: 'HIGH',
    createdAt: '2025-01-10',
  },
];

// Teacher dashboard stats
export const teacherStats = {
  totalStudents: 45,
  activeHomeworks: 5,
  averageScore: 73.5,
  completionRate: 82,
  topPerformers: [
    { name: 'Артём Новиков', score: 94, group: 'Группа 11A' },
    { name: 'Анастасия Петрова', score: 91, group: 'Группа 11A' },
    { name: 'Максим Иванов', score: 88, group: 'Группа 11A' },
  ],
  needsAttention: [
    { name: 'Дмитрий Сидоров', score: 52, issue: 'Низкая активность' },
    { name: 'Мария Фёдорова', score: 58, issue: 'Проблемы с геометрией' },
  ],
  weeklyActivity: [
    { day: 'Пн', tasks: 145 },
    { day: 'Вт', tasks: 123 },
    { day: 'Ср', tasks: 178 },
    { day: 'Чт', tasks: 156 },
    { day: 'Пт', tasks: 189 },
    { day: 'Сб', tasks: 98 },
    { day: 'Вс', tasks: 67 },
  ],
};
