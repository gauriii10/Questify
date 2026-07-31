'use client';

import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

// Reliable SVG Data URLs
const AVATAR_OPTIONS = [
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23ffd1dc"/><circle cx="50" cy="40" r="20" fill="%234a3e3d"/><path d="M 25 80 C 25 60, 75 60, 75 80 Z" fill="%234a3e3d"/><circle cx="50" cy="42" r="15" fill="%23fcd5ce"/><circle cx="43" cy="40" r="2" fill="%232b2d42"/><circle cx="57" cy="40" r="2" fill="%232b2d42"/><path d="M 46 48 Q 50 52 54 48" stroke="%23e76f51" stroke-width="2" fill="none"/></svg>`,
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23c8e6c9"/><circle cx="50" cy="38" r="18" fill="%232d3142"/><path d="M 20 85 C 20 62, 80 62, 80 85 Z" fill="%232d3142"/><circle cx="50" cy="40" r="15" fill="%23ffdbac"/><circle cx="44" cy="38" r="2" fill="%23000"/><circle cx="56" cy="38" r="2" fill="%23000"/><path d="M 45 46 Q 50 49 55 46" stroke="%23d81b60" stroke-width="2" fill="none"/></svg>`,
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23bbdefb"/><path d="M 30 25 Q 50 10 70 25 Q 80 50 70 75 L 30 75 Q 20 50 30 25 Z" fill="%233f37c9"/><circle cx="50" cy="42" r="15" fill="%23f1c27d"/><circle cx="43" cy="40" r="2" fill="%23111"/><circle cx="57" cy="40" r="2" fill="%23111"/><path d="M 47 48 Q 50 51 53 48" stroke="%23d00000" stroke-width="2" fill="none"/><path d="M 22 85 C 22 62, 78 62, 78 85 Z" fill="%234361ee"/></svg>`,
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23e1bee7"/><circle cx="50" cy="38" r="20" fill="%236a040f"/><path d="M 22 85 C 22 60, 78 60, 78 85 Z" fill="%239d0208"/><circle cx="50" cy="42" r="14" fill="%23ffdbac"/><circle cx="43" cy="40" r="2" fill="%23000"/><circle cx="57" cy="40" r="2" fill="%23000"/><path d="M 45 47 Q 50 50 55 47" stroke="%23d81b60" stroke-width="2" fill="none"/></svg>`,
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23ffe0b2"/><circle cx="50" cy="35" r="16" fill="%23f48c06"/><path d="M 25 85 C 25 62, 75 62, 75 85 Z" fill="%23dc2f02"/><circle cx="50" cy="40" r="15" fill="%23f1c27d"/><circle cx="44" cy="38" r="2" fill="%23111"/><circle cx="56" cy="38" r="2" fill="%23111"/><path d="M 46 47 Q 50 51 54 47" stroke="%239d0208" stroke-width="2" fill="none"/></svg>`,
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23b2dfdb"/><circle cx="50" cy="38" r="19" fill="%232b2d42"/><path d="M 20 85 C 20 60, 80 60, 80 85 Z" fill="%238d99ae"/><circle cx="50" cy="40" r="14" fill="%23e0ac69"/><circle cx="43" cy="39" r="2" fill="%23000"/><circle cx="57" cy="39" r="2" fill="%23000"/><path d="M 46 46 Q 50 49 54 46" stroke="%23d00000" stroke-width="2" fill="none"/></svg>`,
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'todo' | 'timer' | 'leaderboard' | 'analytics'>('todo');

  const [user, setUser] = useState<{ name: string; email: string; xp: number; avatar: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [xp, setXp] = useState(0);

  // Calendar Navigation State
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Analytics state
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [productiveDays, setProductiveDays] = useState(0);
  const [focusSessionsCount, setFocusSessionsCount] = useState(0);

  // Weekly Active Days State (Mon-Sun)
  const [weeklyActivity, setWeeklyActivity] = useState({
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false,
  });

  // Tier System
  const getTierInfo = (currentXp: number) => {
    if (currentXp < 200) {
      return { name: 'Bronze', label: 'TIER 1', nextXp: 200, color: 'text-amber-400 bg-amber-950/40 border-amber-800/50' };
    }
    if (currentXp < 600) {
      return { name: 'Silver', label: 'TIER 2', nextXp: 600, color: 'text-slate-300 bg-slate-800/60 border-slate-700' };
    }
    if (currentXp < 1200) {
      return { name: 'Gold', label: 'TIER 3', nextXp: 1200, color: 'text-yellow-300 bg-yellow-950/40 border-yellow-800/50' };
    }
    if (currentXp < 2200) {
      return { name: 'Platinum', label: 'TIER 4', nextXp: 2200, color: 'text-cyan-300 bg-cyan-950/40 border-cyan-800/50' };
    }
    if (currentXp < 3500) {
      return { name: 'Diamond', label: 'TIER 5', nextXp: 3500, color: 'text-blue-300 bg-blue-950/40 border-blue-800/50' };
    }
    if (currentXp < 5000) {
      return { name: 'Ace', label: 'TIER 6', nextXp: 5000, color: 'text-purple-300 bg-purple-950/40 border-purple-800/50' };
    }
    return { name: 'Conqueror', label: 'MAX TIER', nextXp: 5000, color: 'text-rose-300 bg-rose-950/40 border-rose-800/50' };
  };

  const currentTier = getTierInfo(xp);

  // To-do Quests State
  const [quests, setQuests] = useState([
    { id: 1, title: 'Design onboarding', desc: 'Discuss project roadmap and tech stack.', completed: false, color: 'bg-[#d1e5dd] text-[#1c3a32]' },
    { id: 2, title: 'Weekly design review', desc: 'Design new logos and color palette.', completed: false, color: 'bg-[#d8b4e2] text-[#4a1c59]' },
  ]);

  const [inputTitle, setInputTitle] = useState('');
  const [inputDesc, setInputDesc] = useState('');

  // Time Tracker State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [loggedSessions, setLoggedSessions] = useState<{ id: number; duration: string; date: string; xpEarned: number }[]>([]);
  
  const timerCardRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Friends State
  const [friends, setFriends] = useState<{ id: number; name: string; xp: number }[]>([]);
  const [newFriendName, setNewFriendName] = useState('');

  const colorOptions = [
    'bg-[#d1e5dd] text-[#1c3a32]', 
    'bg-[#d8b4e2] text-[#4a1c59]', 
    'bg-[#f3f4f6] text-[#1f2937]', 
    'bg-[#e2e8f0] text-[#334155]', 
  ];

  const markTodayActive = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
    const todayName = days[new Date().getDay()];
    if (todayName in weeklyActivity) {
      setWeeklyActivity((prev) => ({ ...prev, [todayName]: true }));
    }
  };

  // Stopwatch Logic
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => setTimerSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Click outside listener to close calendar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatStopwatch = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStopAndSaveTimer = () => {
    if (timerSeconds < 60) return;
    setIsTimerRunning(false);

    const earnedXp = Math.floor((timerSeconds / 3600) * 10);
    
    setLoggedSessions([
      {
        id: Date.now(),
        duration: formatStopwatch(timerSeconds),
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        xpEarned: earnedXp,
      },
      ...loggedSessions,
    ]);

    setXp((prev) => prev + earnedXp);
    setFocusSessionsCount((prev) => prev + 1);
    setTimerSeconds(0);

    if (productiveDays === 0) setProductiveDays(1);
    markTodayActive();

    if (timerCardRef.current) {
      const rect = timerCardRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x, y }
      });
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;

    const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    const newTask = {
      id: Date.now(),
      title: inputTitle.trim(),
      desc: inputDesc.trim() || 'Working on general quest items.',
      completed: false,
      color: randomColor,
    };

    setQuests([newTask, ...quests]);
    setInputTitle('');
    setInputDesc('');
  };

  const handleComplete = (id: number) => {
    setQuests(quests.map((q) => (q.id === id ? { ...q, completed: true } : q)));
    setXp((prev) => prev + 10);
    setCompletedTasksCount((prev) => prev + 1);

    if (productiveDays === 0) setProductiveDays(1);
    markTodayActive();

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
  };

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;

    setFriends([
      ...friends,
      { id: Date.now(), name: newFriendName.trim(), xp: 0 },
    ]);
    setNewFriendName('');
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;

    const userName = authName.trim() || authEmail.split('@')[0];
    setUser({ name: userName, email: authEmail, xp: 0, avatar: selectedAvatar });
    setXp(0);
    setIsAuthModalOpen(false);
  };

  // Dynamic Calendar Navigation Logic
  const prevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const currentMonthName = calendarDate.toLocaleString('default', { month: 'long' });
  const currentYear = calendarDate.getFullYear();
  const today = new Date();
  
  const totalDaysInMonth = new Date(currentYear, calendarDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, calendarDate.getMonth(), 1).getDay();

  return (
    <div className="min-h-screen bg-[#f3f3f5] text-slate-800 font-sans flex flex-col md:flex-row relative overflow-x-hidden">
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-[#111113] text-zinc-300 p-5 flex flex-col justify-between shrink-0 border-r border-zinc-800 z-40 transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold tracking-tight text-white">
              Questify
            </span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden text-zinc-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-5">
            <div>
              <p className="text-[#c084fc] font-semibold text-xs mb-2.5 px-1 uppercase tracking-wider">Overview</p>
              <div className="space-y-1 text-sm font-normal">
                <button 
                  onClick={() => { setActiveTab('todo'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${
                    activeTab === 'todo' ? 'bg-zinc-800/80 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  To-do's
                </button>

                <button 
                  onClick={() => { setActiveTab('timer'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${
                    activeTab === 'timer' ? 'bg-zinc-800/80 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  Time-Tracker
                </button>

                <button 
                  onClick={() => { setActiveTab('leaderboard'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${
                    activeTab === 'leaderboard' ? 'bg-zinc-800/80 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  Leaderboard
                </button>

                <button 
                  onClick={() => { setActiveTab('analytics'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${
                    activeTab === 'analytics' ? 'bg-zinc-800/80 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  Analytics
                </button>
              </div>
            </div>

            {/* Friends Section */}
            <div className="pt-3 border-t border-zinc-800/80">
              <p className="text-[#c084fc] font-semibold text-xs mb-2 px-1 uppercase tracking-wider">Friends</p>
              <div className="space-y-1 text-xs text-zinc-400">
                {friends.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic px-1">No friends added yet</p>
                ) : (
                  friends.map((friend) => (
                    <div key={friend.id} className="flex justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-900">
                      <span>{friend.name}</span>
                      <span className="font-semibold text-purple-400">{friend.xp} XP</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </nav>
        </div>

        {/* Tier Widget */}
        <div className="mt-4 p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-200 font-medium truncate max-w-[100px]">{user ? user.name : 'Guest User'}</span>
            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold tracking-wider ${currentTier.color}`}>
              {currentTier.label}
            </span>
          </div>
          <div className="text-[11px] text-zinc-400 flex justify-between">
            <span>{currentTier.name}</span>
            <span>{xp} / {currentTier.nextXp} XP</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all duration-300" 
              style={{ width: `${Math.min((xp / currentTier.nextXp) * 100, 100)}%` }} 
            />
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 w-full">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-zinc-200 px-4 sm:px-6 flex items-center justify-between gap-2 shrink-0 relative">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg bg-zinc-100 text-zinc-700 font-bold"
            >
              ☰
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('todo')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all ${
                  activeTab === 'todo' ? 'bg-zinc-900 text-white font-medium' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                To-do's
              </button>
              <button 
                onClick={() => setActiveTab('timer')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all ${
                  activeTab === 'timer' ? 'bg-zinc-900 text-white font-medium' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                Timer
              </button>
              <button 
                onClick={() => setActiveTab('leaderboard')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all ${
                  activeTab === 'leaderboard' ? 'bg-zinc-900 text-white font-medium' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                Ranks
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all ${
                  activeTab === 'analytics' ? 'bg-zinc-900 text-white font-medium' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                Analytics
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <form onSubmit={handleAddFriend} className="hidden lg:flex gap-2">
              <input 
                type="text"
                placeholder="Add friend..."
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                className="bg-zinc-100 border border-zinc-200 rounded-xl px-3 py-1 text-xs outline-none focus:border-zinc-400 w-32"
              />
              <button type="submit" className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium px-2.5 py-1 rounded-xl transition-all">+ Add</button>
            </form>

            {/* CALENDAR BUTTON */}
            <div className="relative" ref={calendarRef}>
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isCalendarOpen ? 'ring-2 ring-purple-400 shadow-sm' : 'hover:opacity-85'
                }`}
                title="Open Calendar"
              >
                <svg className="w-8 h-8" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="50" fill="#0f0f10"/>
                  <rect x="25" y="30" width="50" height="45" rx="8" fill="white"/>
                  <path d="M36 24 V 32 M64 24 V 32" stroke="#0f0f10" strokeWidth="5" strokeLinecap="round"/>
                  <line x1="25" y1="42" x2="75" y2="42" stroke="#0f0f10" strokeWidth="3"/>
                  <rect x="32" y="48" width="8" height="6" rx="1" fill="#0f0f10"/>
                  <rect x="46" y="48" width="8" height="6" rx="1" fill="#0f0f10"/>
                  <rect x="60" y="48" width="8" height="6" rx="1" fill="#0f0f10"/>
                  <rect x="32" y="58" width="8" height="6" rx="1" fill="#0f0f10"/>
                  <rect x="46" y="58" width="8" height="6" rx="1" fill="#0f0f10"/>
                  <rect x="60" y="58" width="8" height="6" rx="1" fill="#0f0f10"/>
                </svg>
              </button>

              {/* CALENDAR DROPDOWN */}
              {isCalendarOpen && (
                <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-2xl shadow-xl border border-zinc-200 p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                    <button 
                      onClick={prevMonth}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-600 font-bold text-sm"
                    >
                      ‹
                    </button>
                    <span className="font-bold text-sm text-zinc-900">{currentMonthName} {currentYear}</span>
                    <button 
                      onClick={nextMonth}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-600 font-bold text-sm"
                    >
                      ›
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['S','M','T','W','T','F','S'].map((d, i) => (
                      <span key={i} className="text-[11px] text-zinc-400 font-semibold py-1">{d}</span>
                    ))}
                    
                    {Array.from({ length: firstDayIndex }).map((_, i) => (
                      <span key={`empty-${i}`} className="h-7" />
                    ))}

                    {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const isToday = dayNum === today.getDate() && 
                                      calendarDate.getMonth() === today.getMonth() && 
                                      calendarDate.getFullYear() === today.getFullYear();
                      return (
                        <span 
                          key={dayNum} 
                          className={`h-7 flex items-center justify-center text-xs rounded-lg font-medium transition-all cursor-pointer ${
                            isToday ? 'bg-[#d8b4e2] text-[#4a1c59] font-bold shadow-xs' : 'text-zinc-700 hover:bg-zinc-100'
                          }`}
                        >
                          {dayNum}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-2 bg-zinc-100 border border-zinc-200 pl-1.5 pr-3 py-1 rounded-xl">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-purple-100 border border-purple-300 shrink-0">
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-medium text-zinc-800 max-w-[100px] sm:max-w-none truncate">{user.name}</span>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="bg-zinc-900 hover:bg-black text-white text-xs font-medium px-3.5 py-2 rounded-xl shadow-sm transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: TO-DO'S */}
          {activeTab === 'todo' && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <input 
                  type="text" 
                  placeholder="Task title..."
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-zinc-400"
                />
                <input 
                  type="text" 
                  placeholder="Description..."
                  value={inputDesc}
                  onChange={(e) => setInputDesc(e.target.value)}
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-zinc-400"
                />

                <button 
                  onClick={handleAddTask}
                  className="bg-zinc-900 hover:bg-black text-white font-medium text-sm px-5 py-2 rounded-xl transition-all whitespace-nowrap"
                >
                  + Create Task
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quests.map((quest) => (
                  <div 
                    key={quest.id}
                    className={`p-5 rounded-2xl shadow-sm border border-black/5 flex flex-col justify-between gap-4 transition-all ${quest.color} ${quest.completed ? 'opacity-40 grayscale' : ''}`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <input 
                            type="checkbox"
                            checked={quest.completed}
                            disabled={quest.completed}
                            onChange={() => handleComplete(quest.id)}
                            className="w-4 h-4 rounded cursor-pointer accent-zinc-800"
                          />
                          <h3 className={`font-semibold text-sm sm:text-base ${quest.completed ? 'line-through' : ''}`}>
                            {quest.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-xs opacity-75 line-clamp-2 leading-relaxed">{quest.desc}</p>
                    </div>

                    <div className="flex justify-end items-center text-[11px] font-medium pt-2 border-t border-black/5">
                      <span className="bg-white/70 px-2 py-0.5 rounded font-bold">+ 10 XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TIME TRACKER */}
          {activeTab === 'timer' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div 
                ref={timerCardRef}
                className="bg-white text-zinc-800 p-6 sm:p-8 rounded-3xl border border-zinc-200 flex flex-col items-center justify-center gap-6 shadow-sm relative overflow-hidden"
              >
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest bg-zinc-100 px-3 py-1 rounded-full">
                  Time Tracker
                </div>

                <div className="w-full bg-zinc-100/90 border border-zinc-200/80 rounded-2xl py-8 px-4 sm:px-6 flex items-center justify-center shadow-inner">
                  <span className="font-mono text-4xl sm:text-6xl font-bold text-zinc-900 tracking-wider">
                    {formatStopwatch(timerSeconds)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {!isTimerRunning ? (
                    <button 
                      onClick={() => setIsTimerRunning(true)}
                      className="bg-zinc-900 hover:bg-black text-white font-medium px-8 py-2.5 rounded-xl transition-all text-sm shadow-sm"
                    >
                      Start Session
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsTimerRunning(false)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-8 py-2.5 rounded-xl transition-all text-sm shadow-sm"
                    >
                      Pause
                    </button>
                  )}

                  <button 
                    onClick={handleStopAndSaveTimer}
                    disabled={timerSeconds === 0}
                    className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium px-6 py-2.5 rounded-xl border border-zinc-200 transition-all text-sm disabled:opacity-40"
                  >
                    Finish & Claim XP
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
                <h3 className="font-bold text-zinc-800 text-sm">Recorded Sessions</h3>
                {loggedSessions.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">No session recorded yet.</p>
                ) : (
                  <div className="space-y-2">
                    {loggedSessions.map((s) => (
                      <div key={s.id} className="flex justify-between items-center bg-zinc-50 p-3 rounded-xl border border-zinc-200/60 text-xs font-medium">
                        <span className="text-zinc-600">Worked for <strong className="text-zinc-900">{s.duration}</strong></span>
                        <span className="text-zinc-400">{s.date}</span>
                        <span className="bg-purple-100 text-purple-900 px-2.5 py-1 rounded font-bold">+{s.xpEarned} XP</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: LEADERBOARD */}
          {activeTab === 'leaderboard' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                  <h2 className="text-base font-bold text-zinc-900">Leaderboard</h2>
                  <span className="text-xs font-semibold text-purple-600">Global Rankings</span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50/70 border border-purple-200/60">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xs bg-purple-200 text-purple-900 px-2 py-0.5 rounded">RANK 1</span>
                      {user?.avatar && (
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-rose-100 border border-purple-300 shrink-0">
                          <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-sm text-zinc-900">{user ? user.name : 'You (Guest)'}</p>
                        <p className="text-[11px] text-zinc-500">{currentTier.name} Tier</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-purple-900">{xp} XP</span>
                  </div>

                  {friends.map((friend, index) => {
                    const friendTier = getTierInfo(friend.xp);
                    return (
                      <div key={friend.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-200/60">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-xs bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded">RANK {index + 2}</span>
                          <div>
                            <p className="font-semibold text-sm text-zinc-900">{friend.name}</p>
                            <p className="text-[11px] text-zinc-500">{friendTier.name} Tier</p>
                          </div>
                        </div>
                        <span className="font-semibold text-sm text-zinc-700">{friend.xp} XP</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* TOP LIGHT PURPLE STAT CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* STREAK CARD */}
                <div className="p-6 rounded-2xl bg-[#f8f2fc] border border-[#ebd8f5] shadow-xs flex flex-col justify-between space-y-4">
                  <p className="text-xs font-bold text-zinc-900 uppercase tracking-wider">STREAK</p>
                  <div>
                    <h3 className="text-3xl font-extrabold text-[#7e22ce]">{productiveDays} Days</h3>
                    <p className="text-xs text-zinc-900 font-medium mt-1">Consecutive days active</p>
                  </div>
                </div>

                {/* TASKS COMPLETED CARD */}
                <div className="p-6 rounded-2xl bg-[#f8f2fc] border border-[#ebd8f5] shadow-xs flex flex-col justify-between space-y-4">
                  <p className="text-xs font-bold text-zinc-900 uppercase tracking-wider">TASKS COMPLETED</p>
                  <div>
                    <h3 className="text-3xl font-extrabold text-[#7e22ce]">{completedTasksCount} Quests</h3>
                    <p className="text-xs text-zinc-900 font-medium mt-1">+10 XP earned per quest</p>
                  </div>
                </div>

                {/* FOCUS SESSIONS CARD */}
                <div className="p-6 rounded-2xl bg-[#f8f2fc] border border-[#ebd8f5] shadow-xs flex flex-col justify-between space-y-4">
                  <p className="text-xs font-bold text-zinc-900 uppercase tracking-wider">FOCUS SESSIONS</p>
                  <div>
                    <h3 className="text-3xl font-extrabold text-[#7e22ce]">{focusSessionsCount} Sessions</h3>
                    <p className="text-xs text-zinc-900 font-medium mt-1">Tracked with stopwatch</p>
                  </div>
                </div>

              </div>

              {/* MON - SUN WEEKLY ACTIVITY CHECKBOXES SECTION */}
              <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900">Weekly Activity</h3>
                    <p className="text-xs text-zinc-400">Track active days for this week</p>
                  </div>
                  <span className="text-xs font-bold bg-[#f5edfa] text-[#7e22ce] px-2.5 py-1 rounded-full">
                    {Object.values(weeklyActivity).filter(Boolean).length} / 7 Days Active
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-2 pt-2">
                  {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map((day) => {
                    const isActive = weeklyActivity[day];
                    return (
                      <div 
                        key={day}
                        onClick={() => setWeeklyActivity((prev) => ({ ...prev, [day]: !prev[day] }))}
                        className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                          isActive 
                            ? 'bg-[#f5edfa] border-[#c084fc] text-[#4a1c59] shadow-xs' 
                            : 'bg-zinc-50 border-zinc-200/80 text-zinc-400 hover:bg-zinc-100'
                        }`}
                      >
                        <span className="text-xs font-bold">{day}</span>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          isActive 
                            ? 'bg-[#7e22ce] border-[#7e22ce] text-white' 
                            : 'bg-white border-zinc-300'
                        }`}>
                          {isActive && <span className="text-xs font-black">✓</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* AUTH MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="font-bold text-lg text-zinc-900">
                {authMode === 'signup' ? 'Create Account' : 'Sign In'}
              </h3>
              <button 
                onClick={() => setIsAuthModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">Display Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="John Doe"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-zinc-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-zinc-400"
                />
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-2">Choose Avatar</label>
                  <div className="grid grid-cols-6 gap-2">
                    {AVATAR_OPTIONS.map((avatar, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                          selectedAvatar === avatar ? 'border-purple-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={avatar} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-zinc-900 hover:bg-black text-white font-medium py-2.5 rounded-xl transition-all text-sm mt-2"
              >
                {authMode === 'signup' ? 'Complete Sign Up' : 'Sign In'}
              </button>
            </form>

            <div className="text-center pt-2">
              <button 
                onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
                className="text-xs text-purple-600 hover:underline font-medium"
              >
                {authMode === 'signup' ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}