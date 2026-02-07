import { StatsCard } from '@/components/dashboard/StatsCard';
import { TopicProgressChart } from '@/components/dashboard/TopicProgressChart';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { RecommendationsList } from '@/components/dashboard/RecommendationsList';
import { HomeworkList } from '@/components/dashboard/HomeworkList';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { studentProgress, homeworks, aiRecommendations } from '@/data/mockData';
import { 
  BookOpen, 
  Target, 
  CheckCircle, 
  Clock, 
  Sparkles,
  Flame,
  Trophy,
  ArrowRight,
  Calendar,
  Brain,
  Zap,
} from 'lucide-react';

export function StudentDashboard() {
  const { user } = useAuthStore();
  const { setActiveTab } = useAppStore();
  const { completedTasks, correctAnswers, averageTime, weeklyProgress, topicStats } = studentProgress;
  const successRate = Math.round((correctAnswers / completedTasks) * 100);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  // Calculate days until exam (примерная дата ЕГЭ - конец мая)
  const examDate = new Date(2025, 4, 29); // 29 мая 2025
  const today = new Date();
  const daysUntilExam = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Streak calculation (mock)
  const currentStreak = 7;

  // Predicted score based on current success rate
  const predictedScore = Math.min(100, Math.round(successRate * 1.1));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-8 text-white">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-white/10 rounded-full" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={20} className="text-yellow-300" />
                <span className="text-emerald-100 text-sm font-medium">СТОПРО • Профильная математика</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {getGreeting()}, {user?.firstName}! 🎯
              </h1>
              <p className="text-emerald-100 text-lg mb-4">
                Продолжай в том же духе! Ты уже решил {completedTasks} задач.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <Flame size={18} className="text-orange-300" />
                  <span className="font-semibold">{currentStreak}</span>
                  <span className="text-emerald-200">дней подряд</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <Calendar size={18} />
                  <span className="font-semibold">{daysUntilExam}</span>
                  <span className="text-emerald-200">дней до ЕГЭ</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <Trophy size={18} className="text-yellow-300" />
                  <span className="font-semibold">~{predictedScore}</span>
                  <span className="text-emerald-200">прогноз балла</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:flex flex-col gap-3">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-lg"
                onClick={() => setActiveTab('practice')}
              >
                <Zap size={18} className="mr-2" />
                Начать практику
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => setActiveTab('ai-assistant')}
              >
                <Brain size={18} className="mr-2" />
                ИИ-помощник
              </Button>
            </div>
          </div>

          {/* Progress to target score */}
          <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target size={18} />
                <span className="font-medium">Путь к цели: 85 баллов</span>
              </div>
              <span className="text-emerald-200">{successRate}% готовности</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white rounded-full h-3 transition-all duration-500"
                style={{ width: `${Math.min(100, (successRate / 85) * 100)}%` }}
              />
            </div>
            <p className="text-sm text-emerald-200 mt-2">
              Ещё немного! Сосредоточься на тригонометрии и параметрах.
            </p>
          </div>
        </div>
      </div>

      {/* Quick actions for mobile */}
      <div className="lg:hidden grid grid-cols-2 gap-3">
        <Button onClick={() => setActiveTab('practice')} className="w-full">
          <Zap size={18} className="mr-2" />
          Практика
        </Button>
        <Button variant="outline" onClick={() => setActiveTab('ai-assistant')} className="w-full">
          <Brain size={18} className="mr-2" />
          ИИ-помощник
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => setActiveTab('analytics')} className="cursor-pointer">
          <StatsCard
            title="Решено задач"
            value={completedTasks}
            change={{ value: 12, label: 'за неделю' }}
            icon={BookOpen}
            color="indigo"
          />
        </div>
        <div onClick={() => setActiveTab('analytics')} className="cursor-pointer">
          <StatsCard
            title="Правильных ответов"
            value={`${successRate}%`}
            change={{ value: 5, label: 'vs прошлая неделя' }}
            icon={CheckCircle}
            color="emerald"
          />
        </div>
        <StatsCard
          title="Целевой балл"
          value="85"
          icon={Target}
          color="amber"
        />
        <div onClick={() => setActiveTab('analytics')} className="cursor-pointer">
          <StatsCard
            title="Среднее время"
            value={`${Math.round(averageTime / 60)} мин`}
            change={{ value: -8, label: 'улучшение' }}
            icon={Clock}
            color="blue"
          />
        </div>
      </div>

      {/* Today's goals */}
      <Card>
        <CardHeader 
          title="Цели на сегодня" 
          subtitle="Выполни задания и получи достижения"
          action={
            <Badge variant="info">
              <Flame size={12} className="mr-1" />
              {currentStreak} дней
            </Badge>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            onClick={() => setActiveTab('practice')}
            className="p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-emerald-700 font-medium">Решить 10 задач</span>
              <CheckCircle size={20} className="text-emerald-500" />
            </div>
            <ProgressBar value={7} max={10} color="success" size="md" />
            <p className="text-sm text-emerald-600 mt-2">7 из 10 выполнено</p>
          </div>
          
          <div 
            onClick={() => setActiveTab('practice')}
            className="p-4 bg-amber-50 rounded-xl border-2 border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-amber-700 font-medium">Тригонометрия</span>
              <Target size={20} className="text-amber-500" />
            </div>
            <ProgressBar value={3} max={5} color="warning" size="md" />
            <p className="text-sm text-amber-600 mt-2">3 из 5 задач</p>
          </div>
          
          <div 
            onClick={() => setActiveTab('homework')}
            className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-blue-700 font-medium">Домашнее задание</span>
              <Clock size={20} className="text-blue-500" />
            </div>
            <ProgressBar value={1} max={3} color="primary" size="md" />
            <p className="text-sm text-blue-600 mt-2">1 из 3 ДЗ сдано</p>
          </div>
        </div>
      </Card>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyChart data={weeklyProgress} />
        <TopicProgressChart topics={topicStats} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div onClick={() => setActiveTab('homework')} className="cursor-pointer">
          <HomeworkList homeworks={homeworks.slice(0, 3)} viewType="student" />
        </div>
        <RecommendationsList recommendations={aiRecommendations} />
      </div>

      {/* Quick practice section */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-2xl shadow-sm">
              <Zap size={32} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Быстрая практика</h3>
              <p className="text-slate-600">
                Реши 5 случайных задач из твоих слабых тем
              </p>
            </div>
          </div>
          <Button onClick={() => setActiveTab('practice')} size="lg">
            Начать
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
