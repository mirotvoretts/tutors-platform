import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { demoTeacher, demoStudent } from '@/data/mockData';
import { Mail, Lock, GraduationCap, BookOpen } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Real API call
      const { default: api } = await import('@/lib/axios');
      const response = await api.post('/auth/login', { email, password });
      
      login(response.data.user, response.data.accessToken);
    } catch (error: any) {
      console.error('Login failed', error);
      alert(error.response?.data?.message || 'Ошибка входа');
      
      // Fallback to demo if API fails (for development without backend running)
      if (!error.response) {
        if (email.includes('teacher')) {
          login(demoTeacher, 'demo-token-teacher');
        } else {
          login(demoStudent, 'demo-token-student');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    const firstName = prompt('Имя:');
    const lastName = prompt('Фамилия:');
    if (!firstName || !lastName) return;

    setIsLoading(true);
    try {
      const { default: api } = await import('@/lib/axios');
      const response = await api.post('/auth/register', {
        email,
        password,
        firstName,
        lastName,
        role: 'TEACHER',
        dataProcessingConsent: true,
      });
      
      login(response.data.user, response.data.accessToken);
    } catch (error: any) {
      console.error('Register failed', error);
      alert(error.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'teacher' | 'student') => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    if (role === 'teacher') {
      login(demoTeacher, 'demo-token-teacher');
    } else {
      login(demoStudent, 'demo-token-student');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl shadow-indigo-200 mb-4">
            <span className="text-white font-bold text-3xl">С</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">СТОПРО</h1>
          <p className="text-slate-500 mt-2">
            Платформа для подготовки к профильной математике
          </p>
        </div>

        <Card padding="lg" className="shadow-xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} />}
            />
            <Input
              label="Пароль"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={18} />}
            />
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="rounded border-slate-300" />
                Запомнить меня
              </label>
              <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Забыли пароль?
              </a>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Войти
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">или войти как</span>
            </div>
          </div>

          {/* Demo login buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoLogin('student')}
              className="flex-col h-auto py-4"
            >
              <BookOpen size={24} className="mb-2 text-indigo-600" />
              <span className="font-semibold">Ученик</span>
              <span className="text-xs text-slate-500">Демо-доступ</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoLogin('teacher')}
              className="flex-col h-auto py-4"
            >
              <GraduationCap size={24} className="mb-2 text-purple-600" />
              <span className="font-semibold">Учитель</span>
              <span className="text-xs text-slate-500">Демо-доступ</span>
            </Button>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Нет аккаунта?{' '}
            <button 
              type="button"
              onClick={handleRegister} 
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Зарегистрироваться как Учитель
            </button>
          </p>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3">
            <div className="text-2xl mb-1">📚</div>
            <p className="text-xs text-slate-600">2000+ задач ЕГЭ</p>
          </div>
          <div className="p-3">
            <div className="text-2xl mb-1">🤖</div>
            <p className="text-xs text-slate-600">ИИ-анализ ошибок</p>
          </div>
          <div className="p-3">
            <div className="text-2xl mb-1">📊</div>
            <p className="text-xs text-slate-600">Детальная аналитика</p>
          </div>
        </div>
      </div>
    </div>
  );
}
