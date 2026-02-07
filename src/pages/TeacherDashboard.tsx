import { useState } from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { HomeworkList } from '@/components/dashboard/HomeworkList';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { teacherStats, homeworks, groups } from '@/data/mockData';
import {
  Users,
  ClipboardList,
  TrendingUp,
  CheckCircle,
  Plus,
  ArrowRight,
  AlertTriangle,
  Trophy,
  Sparkles,
  Calendar,
  Target,
  BookOpen,
  X,
  Mail,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function TeacherDashboard() {
  const { user } = useAuthStore();
  const { setActiveTab } = useAppStore();
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showCreateHomeworkModal, setShowCreateHomeworkModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ email: '', firstName: '', lastName: '', groupId: '' });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  const getMotivationalText = () => {
    const texts = [
      'Сегодня отличный день для новых достижений! 🚀',
      'Ваши ученики ждут новых знаний! 📚',
      'Каждый урок — шаг к успеху на ЕГЭ! 🎯',
      'Вместе мы достигнем высоких результатов! ⭐',
    ];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  const handleAddStudent = async () => {
    try {
      const { default: api } = await import('@/lib/axios');
      await api.post('/teacher/students', {
        email: newStudent.email,
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        grade: 11, // Default
        level: 'BEGINNER' // Default
      });
      
      alert(`Ученик ${newStudent.firstName} добавлен!`);
      setShowAddStudentModal(false);
      setNewStudent({ email: '', firstName: '', lastName: '', groupId: '' });
    } catch (error: any) {
      console.error('Failed to add student', error);
      alert(error.response?.data?.message || 'Ошибка при добавлении ученика');
    }
  };

  const handleCreateHomework = () => {
    setShowCreateHomeworkModal(false);
    setActiveTab('homework');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-full" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-yellow-300" />
              <span className="text-indigo-200 text-sm font-medium">СТОПРО • Панель учителя</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {user?.firstName}! 👋
            </h1>
            <p className="text-indigo-100 text-lg mb-4">
              {getMotivationalText()}
            </p>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <Users size={18} />
                <span className="font-semibold">{teacherStats.totalStudents}</span>
                <span className="text-indigo-200">учеников</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <ClipboardList size={18} />
                <span className="font-semibold">{teacherStats.activeHomeworks}</span>
                <span className="text-indigo-200">активных ДЗ</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <Target size={18} />
                <span className="font-semibold">{teacherStats.averageScore}%</span>
                <span className="text-indigo-200">средний балл</span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex flex-col gap-3">
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg"
              onClick={() => setShowAddStudentModal(true)}
            >
              <Plus size={18} className="mr-2" />
              Добавить ученика
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => setShowCreateHomeworkModal(true)}
            >
              <BookOpen size={18} className="mr-2" />
              Создать ДЗ
            </Button>
          </div>
        </div>

        {/* Today's schedule hint */}
        <div className="relative z-10 mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar size={20} />
            <div>
              <p className="font-medium">Сегодняшний план</p>
              <p className="text-sm text-indigo-200">2 урока • 5 ДЗ на проверке • 3 ученика ждут обратную связь</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10"
            onClick={() => setActiveTab('homework')}
          >
            Подробнее
            <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>

      {/* Quick actions for mobile */}
      <div className="lg:hidden grid grid-cols-2 gap-3">
        <Button onClick={() => setShowAddStudentModal(true)} className="w-full">
          <Plus size={18} className="mr-2" />
          Добавить ученика
        </Button>
        <Button variant="outline" onClick={() => setShowCreateHomeworkModal(true)} className="w-full">
          <BookOpen size={18} className="mr-2" />
          Создать ДЗ
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => setActiveTab('students')} className="cursor-pointer">
          <StatsCard
            title="Всего учеников"
            value={teacherStats.totalStudents}
            change={{ value: 3, label: 'новых' }}
            icon={Users}
            color="indigo"
          />
        </div>
        <div onClick={() => setActiveTab('homework')} className="cursor-pointer">
          <StatsCard
            title="Активных ДЗ"
            value={teacherStats.activeHomeworks}
            icon={ClipboardList}
            color="amber"
          />
        </div>
        <div onClick={() => setActiveTab('analytics')} className="cursor-pointer">
          <StatsCard
            title="Средний балл"
            value={`${teacherStats.averageScore}%`}
            change={{ value: 2, label: 'рост' }}
            icon={TrendingUp}
            color="emerald"
          />
        </div>
        <div onClick={() => setActiveTab('homework')} className="cursor-pointer">
          <StatsCard
            title="Выполнение ДЗ"
            value={`${teacherStats.completionRate}%`}
            icon={CheckCircle}
            color="blue"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Activity chart + Homework */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly activity */}
          <Card>
            <CardHeader
              title="Активность учеников"
              subtitle="Количество решённых задач за неделю"
              action={
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('analytics')}>
                  Подробнее
                  <ArrowRight size={14} className="ml-1" />
                </Button>
              }
            />
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teacherStats.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar
                    dataKey="tasks"
                    fill="#818cf8"
                    radius={[4, 4, 0, 0]}
                    name="Задач решено"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Homework list */}
          <HomeworkList homeworks={homeworks} viewType="teacher" />
        </div>

        {/* Right column - Top performers + Needs attention */}
        <div className="space-y-6">
          {/* Groups */}
          <Card>
            <CardHeader
              title="Мои группы"
              action={
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('students')}>
                  Все
                  <ArrowRight size={14} className="ml-1" />
                </Button>
              }
            />
            <div className="space-y-3">
              {groups.slice(0, 3).map((group) => (
                <div
                  key={group.id}
                  onClick={() => setActiveTab('students')}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-slate-900">{group.name}</p>
                    <p className="text-sm text-slate-500">
                      {group.studentsCount} учеников
                    </p>
                  </div>
                  <Badge
                    variant={
                      group.level === 'ADVANCED'
                        ? 'success'
                        : group.level === 'INTERMEDIATE'
                        ? 'info'
                        : 'default'
                    }
                  >
                    {group.level === 'ADVANCED'
                      ? 'Продвинутый'
                      : group.level === 'INTERMEDIATE'
                      ? 'Средний'
                      : 'Начальный'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Top performers */}
          <Card>
            <CardHeader
              title="Лучшие результаты"
              action={<Trophy size={18} className="text-amber-500" />}
            />
            <div className="space-y-3">
              {teacherStats.topPerformers.map((student, index) => (
                <div
                  key={student.name}
                  onClick={() => setActiveTab('students')}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{student.name}</p>
                    <p className="text-xs text-slate-500">{student.group}</p>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">
                    {student.score}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Needs attention */}
          <Card>
            <CardHeader
              title="Требуют внимания"
              action={<AlertTriangle size={18} className="text-amber-500" />}
            />
            <div className="space-y-3">
              {teacherStats.needsAttention.map((student) => (
                <div
                  key={student.name}
                  onClick={() => setActiveTab('students')}
                  className="p-3 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-slate-900">{student.name}</p>
                    <span className="text-sm font-bold text-red-600">
                      {student.score}%
                    </span>
                  </div>
                  <p className="text-sm text-red-600">{student.issue}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Добавить ученика</h2>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <Input
                label="Email ученика"
                type="email"
                placeholder="student@example.com"
                value={newStudent.email}
                onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                icon={<Mail size={18} />}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Имя"
                  placeholder="Иван"
                  value={newStudent.firstName}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, firstName: e.target.value }))}
                />
                <Input
                  label="Фамилия"
                  placeholder="Иванов"
                  value={newStudent.lastName}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
              <Select
                label="Группа"
                options={[
                  { value: '', label: 'Выберите группу' },
                  ...groups.map(g => ({ value: g.id, label: g.name }))
                ]}
                value={newStudent.groupId}
                onChange={(e) => setNewStudent(prev => ({ ...prev, groupId: e.target.value }))}
              />
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddStudentModal(false)}>
                Отмена
              </Button>
              <Button className="flex-1" onClick={handleAddStudent} disabled={!newStudent.email}>
                Отправить приглашение
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Homework Quick Modal */}
      {showCreateHomeworkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md text-center p-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Создать домашнее задание</h2>
            <p className="text-slate-500 mb-6">
              Перейдите в раздел "Домашние задания" для создания нового ДЗ с выбором задач и групп.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowCreateHomeworkModal(false)}>
                Отмена
              </Button>
              <Button className="flex-1" onClick={handleCreateHomework}>
                Перейти
                <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
