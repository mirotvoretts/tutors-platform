import { useState, useEffect } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { groups as mockGroups } from '@/data/mockData';
import {
  Search,
  Plus,
  Mail,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Users,
  UserPlus,
  Settings,
  Edit,
  X,
  ChevronRight,
} from 'lucide-react';
import type { Student, Group } from '@/types';
import api from '@/lib/axios';

export function StudentsPage() {
  const [activeTab, setActiveTab] = useState<'students' | 'groups'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showStudentDetail, setShowStudentDetail] = useState<Student | null>(null);
  const [showGroupDetail, setShowGroupDetail] = useState<Group | null>(null);
  
  // Real data
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [newStudent, setNewStudent] = useState({ email: '', firstName: '', lastName: '', groupId: '', grade: '11', targetScore: '70' });
  const [newGroup, setNewGroup] = useState({ name: '', level: 'INTERMEDIATE', maxStudents: '20' });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get('/teacher/students');
        // Transform DTO to frontend Type (if needed, but usually similar)
        // Here we assume simple mapping for demo
        setStudents(response.data);
      } catch (error) {
        console.error("Failed to fetch students", error);
      }
    };

    if (activeTab === 'students') {
      fetchStudents();
    }
  }, [activeTab]);

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    if (searchQuery && !fullName.includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedGroup && student.groupId !== selectedGroup) {
      return false;
    }
    return true;
  });

  const filteredGroups = groups.filter((group) => {
    if (searchQuery && !group.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Generate random progress for demo
  const getStudentProgress = (studentId: string) => {
    const seed = studentId.charCodeAt(0) || 0;
    return {
      successRate: 50 + (seed % 45),
      tasksCompleted: 20 + (seed % 100),
      trend: seed % 2 === 0 ? 'up' : 'down',
    };
  };

  const handleAddStudent = async () => {
    try {
      await api.post('/teacher/students', {
        email: newStudent.email,
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        grade: parseInt(newStudent.grade),
        targetScore: parseInt(newStudent.targetScore)
      });
      alert(`Приглашение отправлено на ${newStudent.email}`);
      setShowAddStudentModal(false);
      setNewStudent({ email: '', firstName: '', lastName: '', groupId: '', grade: '11', targetScore: '70' });
      // Refresh list
      const response = await api.get('/teacher/students');
      setStudents(response.data);
    } catch (e) {
      alert('Ошибка при добавлении');
    }
  };

  const handleAddGroup = () => {
    alert(`Группа "${newGroup.name}" создана`);
    setShowAddGroupModal(false);
    setNewGroup({ name: '', level: 'INTERMEDIATE', maxStudents: '20' });
  };

  // Student detail view
  if (showStudentDetail) {
    const progress = getStudentProgress(showStudentDetail.id);
    const group = groups.find(g => g.id === showStudentDetail.groupId);
    
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setShowStudentDetail(null)}>
          ← Назад к списку
        </Button>

        <Card padding="lg">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {showStudentDetail.firstName[0]}{showStudentDetail.lastName[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">
                {showStudentDetail.firstName} {showStudentDetail.lastName}
              </h1>
              <p className="text-slate-500">{showStudentDetail.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="info">{showStudentDetail.grade} класс</Badge>
                {group && <Badge variant="default">{group.name}</Badge>}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Mail size={16} className="mr-1" />
                Написать
              </Button>
              <Button variant="outline" size="sm">
                <Edit size={16} className="mr-1" />
                Редактировать
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <p className="text-3xl font-bold text-indigo-600">{progress.tasksCompleted}</p>
            <p className="text-slate-500">Задач решено</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-emerald-600">{progress.successRate}%</p>
            <p className="text-slate-500">Успешность</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-amber-600">{showStudentDetail.targetScore}</p>
            <p className="text-slate-500">Целевой балл</p>
          </Card>
        </div>

        <Card>
          <CardHeader title="Прогресс по темам" />
          <div className="space-y-4">
            {[
              { name: 'Вычисления', rate: 95 },
              { name: 'Уравнения', rate: 88 },
              { name: 'Вероятности', rate: 75 },
              { name: 'Тригонометрия', rate: 62 },
              { name: 'Параметры', rate: 45 },
            ].map((topic) => (
              <div key={topic.name} className="flex items-center gap-4">
                <span className="w-32 text-sm font-medium text-slate-700">{topic.name}</span>
                <div className="flex-1">
                  <ProgressBar
                    value={topic.rate}
                    color={topic.rate >= 80 ? 'success' : topic.rate >= 60 ? 'warning' : 'danger'}
                    size="md"
                  />
                </div>
                <span className="w-12 text-right text-sm font-semibold text-slate-700">{topic.rate}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // Group detail view
  if (showGroupDetail) {
    const groupStudents = students.filter(s => s.groupId === showGroupDetail.id);
    
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setShowGroupDetail(null)}>
          ← Назад к списку
        </Button>

        <Card padding="lg">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{showGroupDetail.name}</h1>
              <p className="text-slate-500 mt-1">{groupStudents.length} учеников</p>
              <Badge 
                variant={showGroupDetail.level === 'ADVANCED' ? 'success' : showGroupDetail.level === 'INTERMEDIATE' ? 'info' : 'default'}
                className="mt-2"
              >
                {showGroupDetail.level === 'ADVANCED' ? 'Продвинутый' : showGroupDetail.level === 'INTERMEDIATE' ? 'Средний' : 'Начальный'}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings size={16} className="mr-1" />
                Настройки
              </Button>
              <Button size="sm">
                <UserPlus size={16} className="mr-1" />
                Добавить ученика
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader 
            title="Ученики группы" 
            subtitle={`${groupStudents.length} учеников`}
          />
          <div className="space-y-3">
            {groupStudents.map((student) => {
              const progress = getStudentProgress(student.id);
              return (
                <div 
                  key={student.id}
                  onClick={() => setShowStudentDetail(student)}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {student.firstName[0]}{student.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{student.firstName} {student.lastName}</p>
                      <p className="text-sm text-slate-500">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-slate-900">{progress.successRate}%</span>
                        {progress.trend === 'up' ? (
                          <TrendingUp size={14} className="text-emerald-500" />
                        ) : (
                          <TrendingDown size={14} className="text-red-500" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{progress.tasksCompleted} задач</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ученики и группы</h1>
          <p className="text-slate-500 mt-1">
            Управляйте учениками и распределяйте их по группам
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowAddGroupModal(true)}>
            <Users size={18} className="mr-2" />
            Создать группу
          </Button>
          <Button onClick={() => setShowAddStudentModal(true)}>
            <Plus size={18} className="mr-2" />
            Добавить ученика
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'students'
              ? 'text-indigo-600 border-indigo-600'
              : 'text-slate-500 border-transparent hover:text-slate-700'
          }`}
        >
          Ученики ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'groups'
              ? 'text-indigo-600 border-indigo-600'
              : 'text-slate-500 border-transparent hover:text-slate-700'
          }`}
        >
          Группы ({groups.length})
        </button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder={activeTab === 'students' ? 'Поиск по имени...' : 'Поиск группы...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={18} />}
            />
          </div>
          {activeTab === 'students' && (
            <div className="w-56">
              <Select
                options={[
                  { value: '', label: 'Все группы' },
                  ...groups.map((g) => ({ value: g.id, label: g.name })),
                ]}
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.length === 0 && (
            <div className="col-span-full text-center py-8 text-slate-500">
              Список учеников пуст. Добавьте первого ученика!
            </div>
          )}
          {filteredStudents.map((student) => {
            const progress = getStudentProgress(student.id);
            const group = groups.find((g) => g.id === student.groupId);

            return (
              <Card
                key={student.id}
                className="hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
                onClick={() => setShowStudentDetail(student)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {student.firstName[0]}
                      {student.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-slate-500">{student.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); alert('Меню действий'); }}
                    className="p-1 hover:bg-slate-100 rounded-lg"
                  >
                    <MoreVertical size={18} className="text-slate-400" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Группа</span>
                    <Badge variant="info">{group?.name || 'Без группы'}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Класс</span>
                    <span className="font-medium text-slate-900">{student.grade}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Целевой балл</span>
                    <span className="font-medium text-slate-900">{student.targetScore}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-500">Успешность</span>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-slate-900">
                          {progress.successRate}%
                        </span>
                        {progress.trend === 'up' ? (
                          <TrendingUp size={14} className="text-emerald-500" />
                        ) : (
                          <TrendingDown size={14} className="text-red-500" />
                        )}
                      </div>
                    </div>
                    <ProgressBar
                      value={progress.successRate}
                      color={
                        progress.successRate >= 80
                          ? 'success'
                          : progress.successRate >= 60
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    />
                  </div>

                  <p className="text-xs text-slate-400 text-center">
                    Решено {progress.tasksCompleted} задач
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Groups Tab */}
      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group) => {
            const groupStudents = students.filter(s => s.groupId === group.id);
            const avgSuccess = groupStudents.length > 0 
              ? Math.round(groupStudents.reduce((acc, s) => acc + getStudentProgress(s.id).successRate, 0) / groupStudents.length)
              : 0;

            return (
              <Card
                key={group.id}
                className="hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
                onClick={() => setShowGroupDetail(group)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white">
                      <Users size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{group.name}</h3>
                      <p className="text-sm text-slate-500">{groupStudents.length} учеников</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); alert('Меню группы'); }}
                    className="p-1 hover:bg-slate-100 rounded-lg"
                  >
                    <MoreVertical size={18} className="text-slate-400" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Уровень</span>
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

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Средний балл</span>
                    <span className="font-semibold text-slate-900">{avgSuccess}%</span>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-500">Заполненность</span>
                      <span className="text-sm font-medium text-slate-700">
                        {groupStudents.length}/{group.studentsCount}
                      </span>
                    </div>
                    <ProgressBar
                      value={groupStudents.length}
                      max={group.studentsCount}
                      color="primary"
                      size="sm"
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => { e.stopPropagation(); alert('Настройки группы'); }}
                  >
                    <Settings size={14} className="mr-1" />
                    Настройки
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => { e.stopPropagation(); alert('Добавить ученика в группу'); }}
                  >
                    <UserPlus size={14} className="mr-1" />
                    Добавить
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

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
                  { value: '', label: 'Без группы' },
                  ...groups.map(g => ({ value: g.id, label: g.name }))
                ]}
                value={newStudent.groupId}
                onChange={(e) => setNewStudent(prev => ({ ...prev, groupId: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Класс"
                  options={[
                    { value: '10', label: '10 класс' },
                    { value: '11', label: '11 класс' },
                  ]}
                  value={newStudent.grade}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, grade: e.target.value }))}
                />
                <Input
                  label="Целевой балл"
                  type="number"
                  min={0}
                  max={100}
                  value={newStudent.targetScore}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, targetScore: e.target.value }))}
                />
              </div>
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

      {/* Add Group Modal */}
      {showAddGroupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Создать группу</h2>
              <button
                onClick={() => setShowAddGroupModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <Input
                label="Название группы"
                placeholder="Например: Группа 11А - Продвинутые"
                value={newGroup.name}
                onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
              />
              <Select
                label="Уровень"
                options={[
                  { value: 'BEGINNER', label: 'Начальный' },
                  { value: 'INTERMEDIATE', label: 'Средний' },
                  { value: 'ADVANCED', label: 'Продвинутый' },
                ]}
                value={newGroup.level}
                onChange={(e) => setNewGroup(prev => ({ ...prev, level: e.target.value }))}
              />
              <Input
                label="Максимум учеников"
                type="number"
                min={1}
                max={50}
                value={newGroup.maxStudents}
                onChange={(e) => setNewGroup(prev => ({ ...prev, maxStudents: e.target.value }))}
              />
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddGroupModal(false)}>
                Отмена
              </Button>
              <Button className="flex-1" onClick={handleAddGroup} disabled={!newGroup.name}>
                Создать группу
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
