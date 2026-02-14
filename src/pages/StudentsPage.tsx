import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ProgressBar } from '@/components/ui/ProgressBar';
// groups coming from backend
import {
  Search,
  Plus,
  Mail,
  TrendingUp,
  TrendingDown,
  Users,
  UserPlus,
  Settings,
  Edit,
  Trash,
  X,
  ChevronRight,
} from 'lucide-react';
import type { User as Student, StudyGroup as Group } from '@/types';
import api from '@/lib/axios';

export function StudentsPage() {
  const [activeTab, setActiveTab] = useState<'students' | 'groups'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showStudentDetail, setShowStudentDetail] = useState<Student | null>(null);
  const [showGroupDetail, setShowGroupDetail] = useState<Group | null>(null);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState<Group | null>(null);
  // Remove-from-group confirmation
  const [studentToRemove, setStudentToRemove] = useState<Student | null>(null);
  const [lastRemoval, setLastRemoval] = useState<{ studentId: string; groupId: string | null; name: string } | null>(null);
  const undoTimerRef = useRef<number | null>(null);
  // Undo for group deletion
  const [lastGroupDeletion, setLastGroupDeletion] = useState<{ group: Group; studentIds: string[] } | null>(null);
  const groupUndoTimerRef = useRef<number | null>(null);

  // Delete student confirmation / pending deletion (deferred finalization)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [pendingStudentDeletion, setPendingStudentDeletion] = useState<{ student: Student } | null>(null);
  const pendingDeleteTimerRef = useRef<number | null>(null);

  // Confirm removing student from group (not deleting account)
  const handleConfirmRemove = async () => {
    if (!studentToRemove) return;
    const sid = studentToRemove.id;
    const name = studentToRemove.fullName || studentToRemove.username || sid;
    const prevGroupId = studentToRemove.groupId || null;
    try {
      await api.put(`/teacher/students/${sid}`, { groupId: null });
      const resp = await api.get('/teacher/students');
      setStudents(resp.data);
      const gresp = await api.get('/teacher/groups');
      setGroups(gresp.data || []);
      setStudentToRemove(null);
      setLastRemoval({ studentId: sid, groupId: prevGroupId, name });
      // start undo timer (5s)
      if (undoTimerRef.current) { clearTimeout(undoTimerRef.current); }
      // @ts-ignore window.setTimeout typing
      undoTimerRef.current = window.setTimeout(() => { setLastRemoval(null); undoTimerRef.current = null; }, 5000);
    } catch (err: any) {
      console.error('Failed to remove student from group', err);
      alert(err?.response?.data?.message || 'Ошибка при удалении ученика из группы');
    }
  };

  const handleUndoRemoval = async () => {
    if (!lastRemoval) return;
    try {
      await api.put(`/teacher/students/${lastRemoval.studentId}`, { groupId: lastRemoval.groupId });
      const resp = await api.get('/teacher/students');
      setStudents(resp.data);
      const gresp = await api.get('/teacher/groups');
      setGroups(gresp.data || []);
      setLastRemoval(null);
      if (undoTimerRef.current) { clearTimeout(undoTimerRef.current); undoTimerRef.current = null; }
    } catch (err: any) {
      console.error('Failed to undo removal', err);
      alert(err?.response?.data?.message || 'Ошибка при восстановлении ученика в группу');
    }
  };

  // Start deferred deletion for a student (user can undo before final API call)
  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    const s = studentToDelete;
    try {
      // optimistically remove from UI
      setStudents(prev => prev.filter(p => p.id !== s.id));
      setPendingStudentDeletion({ student: s });
      setStudentToDelete(null);
      if (pendingDeleteTimerRef.current) { clearTimeout(pendingDeleteTimerRef.current); }
      // finalize after 5s
      // @ts-ignore window.setTimeout typing
      pendingDeleteTimerRef.current = window.setTimeout(async () => {
        try {
          await api.delete(`/teacher/students/${s.id}`);
        } catch (err) {
          console.warn('Failed finalizing student deletion', err);
        }
        setPendingStudentDeletion(null);
        pendingDeleteTimerRef.current = null;
      }, 5000);
    } catch (err: any) {
      console.error('Failed to start student deletion', err);
      alert(err?.response?.data?.message || 'Ошибка при удалении ученика');
    }
  };

  const handleUndoStudentDelete = () => {
    if (!pendingStudentDeletion) return;
    const s = pendingStudentDeletion.student;
    if (pendingDeleteTimerRef.current) { clearTimeout(pendingDeleteTimerRef.current); pendingDeleteTimerRef.current = null; }
    setStudents(prev => [s, ...prev]);
    setPendingStudentDeletion(null);
  };

  const handleUndoDeleteGroup = async () => {
    if (!lastGroupDeletion) return;
    try {
      // recreate group
      const resp = await api.post('/groups', { name: lastGroupDeletion.group.name });
      const created = resp.data;
      // reassign students back to recreated group
      for (const sid of lastGroupDeletion.studentIds) {
        try {
          await api.put(`/teacher/students/${sid}`, { groupId: created.id });
        } catch (err) {
          // continue restoring others even if one fails
          console.warn('Failed to reassign student', sid, err);
        }
      }
      const sresp = await api.get('/teacher/students');
      setStudents(sresp.data);
      const gresp = await api.get('/teacher/groups');
      setGroups(gresp.data || []);
      setLastGroupDeletion(null);
      if (groupUndoTimerRef.current) { clearTimeout(groupUndoTimerRef.current); groupUndoTimerRef.current = null; }
    } catch (err: any) {
      console.error('Failed to undo group deletion', err);
      alert(err?.response?.data?.message || 'Ошибка при восстановлении группы');
    }
  };

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) { clearTimeout(undoTimerRef.current); }
      if (groupUndoTimerRef.current) { clearTimeout(groupUndoTimerRef.current); }
      if (pendingDeleteTimerRef.current) { clearTimeout(pendingDeleteTimerRef.current); }
    };
  }, []);

  // State for selecting existing student when adding, and mode for add modal
  const [selectedExistingStudentId, setSelectedExistingStudentId] = useState<string>('');
  const [addMode, setAddMode] = useState<'new' | 'existing'>('new');
  const [addOriginGroupId, setAddOriginGroupId] = useState<string>('');

  // Reusable modal wrapper with enter/exit animation and overlay click/ESC support
  function Modal({ children, onClose }: { children: any; onClose: () => void }) {
    const [visible, setVisible] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      setVisible(true);
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setVisible(false); setTimeout(onClose, 180); } };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, []);

    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${visible ? 'opacity-100' : 'opacity-0'} transition-opacity`}> 
        <div className="absolute inset-0 bg-black/50" onClick={() => { setVisible(false); setTimeout(onClose, 180); }} />
        <div ref={wrapperRef} className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-200 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {children}
        </div>
      </div>
    );
  }
  
  // Small animated toast wrapper for nicer entrance animation
  function AnimatedToast({ children }: { children: any }) {
    const [visible, setVisible] = useState(false);
    useEffect(() => { const t = window.setTimeout(() => setVisible(true), 10); return () => { clearTimeout(t); }; }, []);
    return (
      <div className={`transform transition-all duration-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
        {children}
      </div>
    );
  }
  
  // Real data
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [newStudent, setNewStudent] = useState({ firstName: '', lastName: '', groupId: '', grade: '11', targetScore: '70' });
  const [newGroup, setNewGroup] = useState({ name: '' });

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

  // Handlers for group actions
  const openEditGroup = (group: Group) => {
    setEditingGroup(group);
    setEditGroupName(group.name);
    setShowEditGroupModal(true);
  };

  const submitEditGroup = async () => {
    if (!editingGroup) return;
    const name = editGroupName.trim();
    if (!name) return alert('Название не может быть пустым');
    try {
      const resp = await api.put(`/groups/${editingGroup.id}`, { name });
      const updated = resp.data;
      setGroups(prev => prev.map(g => (g.id === updated.id ? updated : g)));
      setShowEditGroupModal(false);
      setEditingGroup(null);
    } catch (err: any) {
      console.error('Failed to update group', err);
      alert(err.response?.data?.message || 'Ошибка при обновлении группы');
    }
  };

  const confirmDeleteGroup = async () => {
    if (!showDeleteGroupModal) return;
    const group = showDeleteGroupModal;
    const studentIds = students.filter(s => s.groupId === group.id).map(s => s.id);
    try {
      await api.delete(`/groups/${group.id}`);
      // optimistically remove
      setGroups(prev => prev.filter(g => g.id !== group.id));
      setShowDeleteGroupModal(null);
      setLastGroupDeletion({ group, studentIds });
      // start undo timer (5s)
      if (groupUndoTimerRef.current) { clearTimeout(groupUndoTimerRef.current); }
      // @ts-ignore window.setTimeout typing
      groupUndoTimerRef.current = window.setTimeout(() => { setLastGroupDeletion(null); groupUndoTimerRef.current = null; }, 5000);

      // refresh latest lists
      const sresp = await api.get('/teacher/students');
      setStudents(sresp.data);
      const gresp = await api.get('/teacher/groups');
      setGroups(gresp.data || []);
    } catch (err: any) {
      console.error('Failed to delete group', err);
      alert(err.response?.data?.message || 'Ошибка при удалении группы');
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get('/teacher/groups');
        setGroups(response.data || []);
      } catch (error) {
        console.error('Failed to fetch groups', error);
      }
    };

    if (activeTab === 'groups' || activeTab === 'students') {
      fetchGroups();
    }
  }, [activeTab]);

  const filteredStudents = students.filter((student) => {
    const fullName = (student.fullName || '').toLowerCase();
    if (searchQuery && !fullName.includes(searchQuery.toLowerCase())) {
      return false;
    }
    // group membership is not provided in StudentDto; skip group filtering for now
    return true;
  });

  const filteredGroups = groups.filter((group) => {
    if (searchQuery && !group.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Generate random progress for demo
  /** Статистика только из БД; пока нет отдельного API — нули */
  const getStudentProgress = (_studentId: string) => ({
    successRate: 0,
    tasksCompleted: 0,
    trend: 'up' as const,
  });

  const handleAddStudent = async () => {
    try {
      const targetGroupId = addOriginGroupId || newStudent.groupId || '';
      if (addMode === 'existing') {
        if (!selectedExistingStudentId) return alert('Выберите ученика');
        await api.put(`/teacher/students/${selectedExistingStudentId}`, { groupId: targetGroupId || null });
      } else {
        const fullName = `${newStudent.firstName.trim()} ${newStudent.lastName.trim()}`;
        if (!fullName) return alert('Укажите имя и фамилию');

        if (targetGroupId) {
          const response = await api.post(`/groups/${targetGroupId}/students`, {
            studentNames: [fullName],
          });
          alert(`Создан пользователь: ${JSON.stringify(response.data.credentials, null, 2)}`);
        } else {
          await api.post('/teacher/students', {
            fullName,
            groupId: null,
          });
        }
      }

  setShowAddStudentModal(false);
  setAddOriginGroupId('');
      setNewStudent({ firstName: '', lastName: '', groupId: '', grade: '11', targetScore: '70' });
      setSelectedExistingStudentId('');
      const resp = await api.get('/teacher/students');
      setStudents(resp.data);
      const gresp = await api.get('/teacher/groups');
      setGroups(gresp.data || []);
    } catch (e) {
      console.error('Error adding/assigning student', e);
      alert('Ошибка при добавлении/назначении');
    }
  };

  const handleAddGroup = async () => {
    const name = newGroup.name?.trim() || '';
    if (name.length < 2) {
      alert('Название группы должно быть от 2 до 255 символов');
      return;
    }
    try {
      const response = await api.post('/groups', { name });
      const created = response.data;
      setGroups((prev) => [{ ...created, level: (created.level || 'INTERMEDIATE') as Group['level'], createdAt: created.createdAt || new Date().toISOString() }, ...prev]);
      setShowAddGroupModal(false);
      setNewGroup({ name: '' });
    } catch (err: any) {
      console.error('Failed to create group', err);
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.response?.data?.error;
      if (status === 401) {
        alert('Сессия истекла. Войдите снова.');
        return;
      }
      if (status === 403) {
        alert('Нет прав для создания группы. Войдите как учитель.');
        return;
      }
      if (status === 400 && msg) {
        alert(msg);
        return;
      }
      if (err.code === 'ERR_NETWORK' || !status) {
        alert('Не удалось связаться с сервером. Проверьте, что бэкенд запущен (например, порт 8080).');
        return;
      }
      alert(msg || `Ошибка создания группы${status ? ` (${status})` : ''}`);
    }
  };

  if (showStudentDetail) {
    const progress = getStudentProgress(showStudentDetail.id);
    
    return (
      <>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setShowStudentDetail(null)}>
          ← Назад к списку
        </Button>

        <Card padding="lg">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {(() => {
                const name = showStudentDetail.fullName || '';
                if (!name) return '';
                return name.split(' ').map((s: string) => s[0] || '').slice(0,2).join('');
              })()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">{showStudentDetail.fullName}</h1>
              <p className="text-slate-500">{showStudentDetail.username}</p>
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
            <p className="text-3xl font-bold text-amber-600">{showStudentDetail.targetScore ?? '—'}</p>
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
      {/* Remove student from group confirmation (styled modal) */}
      {studentToRemove && (
        <Modal onClose={() => setStudentToRemove(null)}>
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Убрать ученика из группы</h2>
            <button onClick={() => setStudentToRemove(null)} className="p-2 hover:bg-slate-100 rounded-lg">
              <X size={20} className="text-slate-500" />
            </button>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-700 mb-4">Вы действительно хотите удалить ученика "{studentToRemove.fullName || studentToRemove.username}" из группы?</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" className="flex-1" onClick={() => setStudentToRemove(null)}>Отмена</Button>
              <Button variant="danger" className="flex-1" onClick={handleConfirmRemove}>Удалить</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete student confirmation (deferred delete with undo) */}
      {studentToDelete && (
        <Modal onClose={() => setStudentToDelete(null)}>
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Удалить ученика</h2>
            <button onClick={() => setStudentToDelete(null)} className="p-2 hover:bg-slate-100 rounded-lg">
              <X size={20} className="text-slate-500" />
            </button>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-700 mb-4">Вы действительно хотите навсегда удалить ученика "{studentToDelete.fullName || studentToDelete.username}"? Действие будет выполнено через несколько секунд — вы сможете отменить его.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" className="flex-1" onClick={() => setStudentToDelete(null)}>Отмена</Button>
              <Button variant="danger" className="flex-1" onClick={confirmDeleteStudent}>Удалить</Button>
            </div>
          </div>
        </Modal>
      )}

      {lastRemoval && (
        <div className="fixed right-6 bottom-6 z-50">
          <AnimatedToast>
            <div className="bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-4 border">
              <div className="flex-1">
                <div className="text-sm text-slate-800">Ученик "{lastRemoval.name}" удалён из группы</div>
                <div className="text-xs text-slate-500">Можно отменить действие в течение нескольких секунд</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleUndoRemoval}>Отменить</Button>
              </div>
            </div>
          </AnimatedToast>
        </div>
      )}

      {lastGroupDeletion && (
        <div className="fixed right-6 bottom-6 z-50">
          <AnimatedToast>
            <div className="bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-4 border">
              <div className="flex-1">
                <div className="text-sm text-slate-800">Группа "{lastGroupDeletion.group.name}" удалена</div>
                <div className="text-xs text-slate-500">Можно отменить действие в течение нескольких секунд</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleUndoDeleteGroup}>Отменить</Button>
              </div>
            </div>
          </AnimatedToast>
        </div>
      )}

      {pendingStudentDeletion && (
        <div className="fixed right-6 bottom-6 z-50">
          <AnimatedToast>
            <div className="bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-4 border">
              <div className="flex-1">
                <div className="text-sm text-slate-800">Ученик "{pendingStudentDeletion.student.fullName || pendingStudentDeletion.student.username}" удалён</div>
                <div className="text-xs text-slate-500">Можно отменить действие в течение нескольких секунд</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleUndoStudentDelete}>Отменить</Button>
              </div>
            </div>
          </AnimatedToast>
        </div>
      )}

    </>
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
                      {(() => {
                        const name = student.fullName || '';
                        if (!name) return '';
                        return name.split(' ').map((s: string) => s[0] || '').slice(0,2).join('');
                      })()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{student.fullName}</p>
                      <p className="text-sm text-slate-500">{student.username}</p>
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
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setStudentToDelete(student); }}
                        className="p-1 hover:bg-slate-100 rounded-md text-sm text-red-600"
                        title="Удалить ученика"
                      >
                        <Trash size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStudentToRemove(student);
                        }}
                        type="button"
                        className="p-1 hover:bg-slate-100 rounded-md text-sm text-red-600"
                        title="Удалить из группы"
                      >
                        Удалить
                      </button>
                      <ChevronRight size={18} className="text-slate-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      
        {/* Modals & toasts for actions while viewing a single group */}
        {/* Remove student from group confirmation (styled modal) */}
        {studentToRemove && (
          <Modal onClose={() => setStudentToRemove(null)}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Убрать ученика из группы</h2>
              <button onClick={() => setStudentToRemove(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-700 mb-4">Вы действительно хотите удалить ученика "{studentToRemove.fullName || studentToRemove.username}" из группы?</p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" className="flex-1" onClick={() => setStudentToRemove(null)}>Отмена</Button>
                <Button variant="danger" className="flex-1" onClick={handleConfirmRemove}>Удалить</Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Delete student confirmation (deferred delete with undo) */}
        {studentToDelete && (
          <Modal onClose={() => setStudentToDelete(null)}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Удалить ученика</h2>
              <button onClick={() => setStudentToDelete(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-700 mb-4">Вы действительно хотите навсегда удалить ученика "{studentToDelete.fullName || studentToDelete.username}"? Действие будет выполнено через несколько секунд — вы сможете отменить его.</p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" className="flex-1" onClick={() => setStudentToDelete(null)}>Отмена</Button>
                <Button variant="danger" className="flex-1" onClick={confirmDeleteStudent}>Удалить</Button>
              </div>
            </div>
          </Modal>
        )}

        {lastRemoval && (
          <div className="fixed right-6 bottom-6 z-50">
            <AnimatedToast>
              <div className="bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-4 border">
                <div className="flex-1">
                  <div className="text-sm text-slate-800">Ученик "{lastRemoval.name}" удалён из группы</div>
                  <div className="text-xs text-slate-500">Можно отменить действие в течение нескольких секунд</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleUndoRemoval}>Отменить</Button>
                </div>
              </div>
            </AnimatedToast>
          </div>
        )}

        {lastGroupDeletion && (
          <div className="fixed right-6 bottom-6 z-50">
            <AnimatedToast>
              <div className="bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-4 border">
                <div className="flex-1">
                  <div className="text-sm text-slate-800">Группа "{lastGroupDeletion.group.name}" удалена</div>
                  <div className="text-xs text-slate-500">Можно отменить действие в течение нескольких секунд</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleUndoDeleteGroup}>Отменить</Button>
                </div>
              </div>
            </AnimatedToast>
          </div>
        )}

        {pendingStudentDeletion && (
          <div className="fixed right-6 bottom-6 z-50">
            <AnimatedToast>
              <div className="bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-4 border">
                <div className="flex-1">
                  <div className="text-sm text-slate-800">Ученик "{pendingStudentDeletion.student.fullName || pendingStudentDeletion.student.username}" удалён</div>
                  <div className="text-xs text-slate-500">Можно отменить действие в течение нескольких секунд</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleUndoStudentDelete}>Отменить</Button>
                </div>
              </div>
            </AnimatedToast>
          </div>
        )}

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
          <Button variant="outline" onClick={() => setShowAddGroupModal(true)} className="rounded-full">
            <Users size={18} className="mr-2" />
            Создать группу
          </Button>
          <Button onClick={() => { setAddMode('new'); setAddOriginGroupId(''); setShowAddStudentModal(true); }} className="rounded-full">
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
                      {(() => {
                        const name = student.fullName || `${student.username || ''}`;
                        if (!name) return '';
                        return name.split(' ').map((s: string) => s[0] || '').slice(0,2).join('');
                      })()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{student.fullName || `${student.username || ''}`}</h3>
                      <p className="text-sm text-slate-500">{student.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setStudentToDelete(student); }}
                      className="p-1 hover:bg-slate-100 rounded-md text-sm text-red-600"
                      title="Удалить ученика"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Группа</span>
                    <Badge variant="info">{group?.name || 'Без группы'}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Класс</span>
                    <span className="font-medium text-slate-900">{student.grade ?? '—'}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Целевой балл</span>
                    <span className="font-medium text-slate-900">{student.targetScore ?? '—'}</span>
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

      {/* Edit Group Modal */}
      {showEditGroupModal && editingGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Редактировать группу</h2>
              <button onClick={() => { setShowEditGroupModal(false); setEditingGroup(null); }} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input label="Название группы" value={editGroupName} onChange={(e) => setEditGroupName(e.target.value)} />
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setShowEditGroupModal(false); setEditingGroup(null); }}>Отмена</Button>
              <Button className="flex-1" onClick={submitEditGroup}>Сохранить</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Group Confirmation Modal */}
      {showDeleteGroupModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-2">Удалить группу</h3>
            <p className="text-sm text-slate-600 mb-4">Вы действительно хотите удалить группу "{showDeleteGroupModal.name}"? Это действие можно отменить только вручную.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowDeleteGroupModal(null)}>Отмена</Button>
              <Button className="flex-1" onClick={confirmDeleteGroup}>Удалить</Button>
            </div>
          </div>
        </div>
      )}

      {/* Remove student from group confirmation (styled modal) */}
      {studentToRemove && (
        <Modal onClose={() => setStudentToRemove(null)}>
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Убрать ученика из группы</h2>
            <button onClick={() => setStudentToRemove(null)} className="p-2 hover:bg-slate-100 rounded-lg">
              <X size={20} className="text-slate-500" />
            </button>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-700 mb-4">Вы действительно хотите удалить ученика "{studentToRemove.fullName || studentToRemove.username}" из группы?</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" className="flex-1" onClick={() => setStudentToRemove(null)}>Отмена</Button>
              <Button variant="danger" className="flex-1" onClick={handleConfirmRemove}>Удалить</Button>
            </div>
          </div>
        </Modal>
      )}

        {/* Delete student confirmation (deferred delete with undo) */}
        {studentToDelete && (
          <Modal onClose={() => setStudentToDelete(null)}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Удалить ученика</h2>
              <button onClick={() => setStudentToDelete(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-700 mb-4">Вы действительно хотите навсегда удалить ученика "{studentToDelete.fullName || studentToDelete.username}"?</p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" className="flex-1" onClick={() => setStudentToDelete(null)}>Отмена</Button>
                <Button variant="danger" className="flex-1" onClick={confirmDeleteStudent}>Удалить</Button>
              </div>
            </div>
          </Modal>
        )}

      {/* Undo toast after removing student from group */}
      {lastRemoval && (
        <div className="fixed right-6 bottom-6 z-50">
          <AnimatedToast>
            <div className="bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-4 border">
              <div className="flex-1">
                <div className="text-sm text-slate-800">Ученик "{lastRemoval.name}" удалён из группы</div>
                <div className="text-xs text-slate-500">Можно отменить действие в течение нескольких секунд</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleUndoRemoval}>Отменить</Button>
              </div>
            </div>
          </AnimatedToast>
        </div>
      )}

      {lastGroupDeletion && (
        <div className="fixed right-6 bottom-6 z-50">
          <AnimatedToast>
            <div className="bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-4 border">
              <div className="flex-1">
                <div className="text-sm text-slate-800">Группа "{lastGroupDeletion.group.name}" удалена</div>
                <div className="text-xs text-slate-500">Можно отменить действие в течение нескольких секунд</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleUndoDeleteGroup}>Отменить</Button>
              </div>
            </div>
          </AnimatedToast>
        </div>
      )}

      {pendingStudentDeletion && (
        <div className="fixed right-6 bottom-6 z-50">
          <AnimatedToast>
            <div className="bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-4 border">
              <div className="flex-1">
                <div className="text-sm text-slate-800">Ученик "{pendingStudentDeletion.student.fullName || pendingStudentDeletion.student.username}" удалён</div>
                <div className="text-xs text-slate-500">Можно отменить действие в течение нескольких секунд</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleUndoStudentDelete}>Отменить</Button>
              </div>
            </div>
          </AnimatedToast>
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
                  <div className="flex items-center gap-2">
                    {/* Delete button moved to the right side of the card for quick access */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full text-red-600 border-red-200 hover:bg-red-50"
                      onClick={(e) => { e.stopPropagation(); setShowDeleteGroupModal(group); }}
                      title="Удалить группу"
                    >
                      <Trash size={18} />
                    </Button>
                  </div>
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

                  {/* Заполненность удалена по просьбе дизайна */}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-full"
                    onClick={(e) => { e.stopPropagation(); openEditGroup(group); }}
                  >
                    <Settings size={14} className="mr-1" />
                    Редактировать
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 rounded-full"
                    onClick={(e) => { e.stopPropagation(); setNewStudent(prev => ({ ...prev, groupId: group.id })); setAddMode('new'); setAddOriginGroupId(group.id); setShowAddStudentModal(true); }}
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

      {/* The assign-existing flow is merged into the Add Student modal (see below) */}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Добавить ученика</h2>
              <button
                onClick={() => { setShowAddStudentModal(false); setAddOriginGroupId(''); }}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <Button size="sm" variant={addMode === 'new' ? 'primary' : 'outline'} className="rounded-full" onClick={() => setAddMode('new')}>Создать нового</Button>
                <Button size="sm" variant={addMode === 'existing' ? 'primary' : 'outline'} className="rounded-full" onClick={() => setAddMode('existing')}>Добавить существующего</Button>
              </div>

              {addMode === 'new' ? (
                <>
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
                  {!addOriginGroupId && (
                    <Select
                      label="Группа"
                      options={[
                        { value: '', label: 'Без группы' },
                        ...groups.map(g => ({ value: g.id, label: g.name }))
                      ]}
                      value={newStudent.groupId}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, groupId: e.target.value }))}
                    />
                  )}
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
                </>
              ) : (
                <>
                  {!addOriginGroupId && (
                    <Select
                      label="Группа (куда назначить)"
                      options={[
                        { value: '', label: 'Без группы' },
                        ...groups.map(g => ({ value: g.id, label: g.name }))
                      ]}
                      value={newStudent.groupId}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, groupId: e.target.value }))}
                    />
                  )}
                  <Select
                    label="Ученики"
                    options={students
                      .filter(s => s.groupId !== (addOriginGroupId || newStudent.groupId))
                      .map(s => ({ value: s.id, label: s.fullName || s.username || 'Без имени' }))
                    }
                    value={selectedExistingStudentId}
                    onChange={(e) => setSelectedExistingStudentId(e.target.value)}
                  />
                </>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <Button variant="outline" className="flex-1 rounded-full" onClick={() => { setShowAddStudentModal(false); setAddOriginGroupId(''); }}>
                Отмена
              </Button>
              <Button
                className="flex-1 rounded-full"
                onClick={handleAddStudent}
                disabled={addMode === 'new' ? !(newStudent.firstName && newStudent.lastName) : !selectedExistingStudentId}
              >
                {addMode === 'new' ? 'Создать ученика' : 'Назначить'}
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
                placeholder="Например: Группа 11А"
                value={newGroup.name}
                onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
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
