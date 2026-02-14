import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
// Temporary placeholders until tasks/topics are fetched from backend
const tasks: any[] = [];
const topics: any[] = [];
import {
  Search,
  Filter,
  Shuffle,
  ChevronRight,
  Clock,
  Star,
} from 'lucide-react';
import type { Task } from '@/types';

export function TasksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    if (searchQuery && !task.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedTopic && task.topicId !== selectedTopic) {
      return false;
    }
    if (selectedDifficulty && task.difficulty !== selectedDifficulty) {
      return false;
    }
    return true;
  });

  const handleCheckAnswer = () => {
    setShowResult(true);
  };

  const handleNextTask = () => {
    setSelectedTask(null);
    setUserAnswer('');
    setShowResult(false);
  };

  const getDifficultyBadge = (difficulty: Task['difficulty']) => {
    switch (difficulty) {
      case 'EASY':
        return <Badge variant="success">Лёгкая</Badge>;
      case 'MEDIUM':
        return <Badge variant="warning">Средняя</Badge>;
      case 'HARD':
        return <Badge variant="danger">Сложная</Badge>;
    }
  };

  if (selectedTask) {
    const isCorrect = userAnswer.trim() === selectedTask.answer;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleNextTask}>
            ← Назад к списку
          </Button>
          <div className="flex items-center gap-2">
            {getDifficultyBadge(selectedTask.difficulty)}
            <Badge>Задание {selectedTask.egeNumber}</Badge>
          </div>
        </div>

        <Card padding="lg">
          <div className="mb-6">
            <p className="text-sm text-slate-500 mb-2">{selectedTask.topicName}</p>
            <p className="text-lg text-slate-900 leading-relaxed">
              {selectedTask.content}
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Ваш ответ"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Введите ответ..."
              disabled={showResult}
            />

            {!showResult ? (
              <Button onClick={handleCheckAnswer} className="w-full" size="lg">
                Проверить ответ
              </Button>
            ) : (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-xl ${
                    isCorrect
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <p
                    className={`font-semibold ${
                      isCorrect ? 'text-emerald-700' : 'text-red-700'
                    }`}
                  >
                    {isCorrect ? '✓ Правильно!' : '✗ Неправильно'}
                  </p>
                  {!isCorrect && (
                    <p className="text-slate-600 mt-1">
                      Правильный ответ: <strong>{selectedTask.answer}</strong>
                    </p>
                  )}
                </div>

                {selectedTask.solution && (
                  <Card className="bg-slate-50">
                    <CardHeader title="Решение" />
                    <p className="text-slate-700">{selectedTask.solution}</p>
                  </Card>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleNextTask} className="flex-1">
                    Следующая задача
                  </Button>
                  <Button onClick={() => setShowResult(false)} className="flex-1">
                    Попробовать ещё
                  </Button>
                </div>
              </div>
            )}
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
          <h1 className="text-2xl font-bold text-slate-900">База задач</h1>
          <p className="text-slate-500 mt-1">
            Актуальные задания профильного ЕГЭ по математике
          </p>
        </div>
        <Button>
          <Shuffle size={18} className="mr-2" />
          Сгенерировать вариант
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Поиск задач..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={18} />}
            />
          </div>
          <div className="w-48">
            <Select
              options={[
                { value: '', label: 'Все темы' },
                ...topics.map((t) => ({ value: t.id, label: `${t.egeNumber}. ${t.name}` })),
              ]}
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
            />
          </div>
          <div className="w-40">
            <Select
              options={[
                { value: '', label: 'Сложность' },
                { value: 'EASY', label: 'Лёгкая' },
                { value: 'MEDIUM', label: 'Средняя' },
                { value: 'HARD', label: 'Сложная' },
              ]}
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter size={18} className="mr-2" />
            Фильтры
          </Button>
        </div>
      </Card>

      {/* Task list */}
      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <Card
            key={task.id}
            className="hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedTask(task)}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
                {task.egeNumber}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-slate-500">{task.topicName}</span>
                  {getDifficultyBadge(task.difficulty)}
                </div>
                <p className="text-slate-900 line-clamp-2">{task.content}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    ~3 мин
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={14} />
                    {task.points} балл
                  </span>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-400" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
