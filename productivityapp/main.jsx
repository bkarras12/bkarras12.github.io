/**
Your Next Mountain
Brady Karras
 */



// ==========================================
// 1. Configuration & Constants
// ==========================================
const { LayoutGrid, Clock, BookOpen, PenTool, Plus, Trash2, X, CheckCircle2, RefreshCw, Maximize2, Minimize2, Volume2, VolumeX, AlignLeft, ListChecks, 
       Sparkles, Moon, Sun, Play, Pause, RotateCcw, AlertTriangle, ArrowRight, Bell, Ghost, Mountain, Target, Quote } = lucide;

const APP_CONFIG = {
  name: "Your Next Mountain",
  defaults: {
    timerFocus: 25 * 60,
    timerShortBreak: 5 * 60,
    timerLongBreak: 15 * 60,
  }
};

const INITIAL_QUOTES = [
  { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
  { text: "The obstacle is the way.", author: "Marcus Aurelius" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "It is not what happens to you, but how you react to it that matters.", author: "Epictetus" },
  { text: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "He who fears death will never do anything worth of a man who is alive.", author: "Seneca" },
  { text: "No man is free who is not master of himself.", author: "Epictetus" },
  { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius" },
  { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca" },
  { text: "If it is not right do not do it; if it is not true do not say it.", author: "Marcus Aurelius" },
  { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus" },
  { text: "Man conquers the world by conquering himself.", author: "Zeno of Citium" }
];

const PLAYBOOK_LESSONS = [
  {
    title: "Amor Fati (Love of Fate)",
    analogy: "Treat every event like fuel for a fire.",
    explanation: "A fire turns everything thrown into it into flame and brightness. Don't wish for things to be different; use what happens to move forward.",
    icon: <Mountain className="w-5 h-5" />
  },
  {
    title: "The 'Eat the Frog' Rule",
    analogy: "If you have to eat a live frog, it doesn't pay to sit and look at it for very long.",
    explanation: "Do your hardest, most daunting task first thing in the morning. Once the 'frog' is gone, everything else is like eating dessert.",
    icon: <Target className="w-5 h-5" />
  },
  {
    title: "Monk Mode",
    analogy: "Put blinders on the horse.",
    explanation: "Horses wear blinders so they don't get spooked by the crowd. Monk Mode removes the UI so you don't get spooked by your other tasks.",
    icon: <Maximize2 className="w-5 h-5" />
  }
];

const MATRIX_CONFIG = {
  q1: { 
    label: "Do First", 
    subLabel: "The Emergency Room", 
    icon: AlertTriangle, 
    lightClass: "bg-[#E7E5E4] text-stone-800",
    darkClass: "bg-[#292524] text-stone-200 border-stone-700",
    description: "Urgent & Important"
  },
  q2: { 
    label: "Schedule", 
    subLabel: "The Gym / Strategy", 
    icon: ArrowRight, 
    lightClass: "bg-white border-stone-200 text-stone-600",
    darkClass: "bg-[#1c1917] border-stone-800 text-stone-400",
    description: "Not Urgent & Important"
  },
  q3: { 
    label: "Delegate", 
    subLabel: "The Doorbell / Noise", 
    icon: Bell, 
    lightClass: "bg-[#F5F5F4] text-stone-500",
    darkClass: "bg-[#292524] text-stone-500",
    description: "Urgent & Not Important"
  },
  q4: { 
    label: "Delete", 
    subLabel: "The Sofa / Waste", 
    icon: Ghost, 
    lightClass: "bg-white border-stone-200 text-stone-400",
    darkClass: "bg-[#0c0a09] border-stone-800 text-stone-600",
    description: "Not Urgent & Not Important"
  }
};

// ==========================================
// 2. Custom Hooks (Logic Abstraction)
// ==========================================

/**
 * Hook to manage timer logic, intervals, and audio feedback.
 */
const useProductivityTimer = () => {
  const [timeLeft, setTimeLeft] = React.useState(APP_CONFIG.defaults.timerFocus);
  const [isActive, setIsActive] = React.useState(false);
  const [mode, setMode] = React.useState('focus');
  const [soundEnabled, setSoundEnabled] = React.useState(false);

  const resetTimer = React.useCallback(() => {
    setIsActive(false);
    if (mode === 'focus') setTimeLeft(APP_CONFIG.defaults.timerFocus);
    else if (mode === 'short-break') setTimeLeft(APP_CONFIG.defaults.timerShortBreak);
    else setTimeLeft(APP_CONFIG.defaults.timerLongBreak);
  }, [mode]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === 'focus') setTimeLeft(APP_CONFIG.defaults.timerFocus);
    else if (newMode === 'short-break') setTimeLeft(APP_CONFIG.defaults.timerShortBreak);
    else setTimeLeft(APP_CONFIG.defaults.timerLongBreak);
  };

  React.useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Simple beep or notification sound
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(e => console.warn("Audio play blocked by browser policy"));
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  return {
    timeLeft,
    isActive,
    mode,
    soundEnabled,
    toggleTimer: () => setIsActive(!isActive),
    resetTimer,
    setMode: handleModeChange,
    toggleSound: () => setSoundEnabled(!soundEnabled)
  };
};

/**
 * Hook to manage task CRUD operations.
 */
const useTaskManager = () => {
  const [tasks, setTasks] = React.useState([
    { id: 1, text: "Client server outage response", category: "q1", completed: false },
    { id: 2, text: "Learn Rust language", category: "q2", completed: false },
    { id: 3, text: "Reply to LinkedIn messages", category: "q3", completed: false },
    { id: 4, text: "Organize desktop icons", category: "q4", completed: false },
  ]);

  const addTask = (text, category) => {
    if (!text.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text, category, completed: false }]);
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const getProgress = () => {
    if (tasks.length === 0) return 0;
    return (tasks.filter(t => t.completed).length / tasks.length) * 100;
  };

  return { tasks, addTask, toggleTask, deleteTask, getProgress };
};

// ==========================================
// 3. Presentation Components
// ==========================================

const Sidebar = ({ activeTab, setActiveTab, dailyQuote, onShuffleQuote, progress, isDarkMode, toggleTheme }) => (
  <aside className={`w-full md:w-72 flex flex-col h-screen p-8 border-r transition-colors duration-500 
    ${isDarkMode ? 'bg-[#1C1917] text-stone-400 border-stone-800' : 'bg-[#EBE9E4] text-stone-700 border-[#D6D3D1]'}`}>
    
    {/* Brand Header */}
    <div className="flex items-center gap-3 mb-12 opacity-80 hover:opacity-100 transition-opacity">
      <div className={`p-2 rounded-md transition-colors ${isDarkMode ? 'bg-stone-800 text-stone-200' : 'bg-[#5C5A56] text-[#EBE9E4]'}`}>
        <Mountain className="w-5 h-5" />
      </div>
      <h1 className={`text-sm font-bold tracking-widest uppercase transition-colors ${isDarkMode ? 'text-stone-300' : 'text-[#5C5A56]'}`}>
        {APP_CONFIG.name}
      </h1>
    </div>
    
    {/* Navigation */}
    <nav className="space-y-4 flex-1">
      {[
        { id: 'tasks', label: 'Matrix', icon: LayoutGrid },
        { id: 'timer', label: 'Focus', icon: Clock },
        { id: 'journal', label: 'Journal', icon: PenTool }, 
        { id: 'learn', label: 'Playbook', icon: BookOpen },
      ].map((item) => (
        <button 
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 
            ${activeTab === item.id 
              ? (isDarkMode ? 'bg-stone-800 text-stone-200 shadow-sm' : 'bg-[#D6D3D1] text-stone-800 font-semibold shadow-sm') 
              : 'hover:opacity-100 opacity-60'}`}
        >
          <item.icon size={18} />
          <span className="text-sm tracking-wide">{item.label}</span>
        </button>
      ))}
    </nav>

    {/* Theme Toggle */}
    <div className="mb-8">
      <button 
        onClick={toggleTheme}
        className={`flex items-center gap-3 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all w-full
          ${isDarkMode ? 'bg-stone-800 text-stone-400 hover:text-stone-200' : 'bg-[#D6D3D1] text-stone-600 hover:text-stone-800'}`}
      >
        {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
        <span>{isDarkMode ? 'Light Mode' : 'Night Mode'}</span>
      </button>
    </div>

    {/* Footer Status */}
    <div className={`mt-auto pt-8 border-t transition-colors ${isDarkMode ? 'border-stone-800' : 'border-[#D6D3D1]'}`}>
      <div className="mb-6 group relative">
        <div className="flex justify-between items-start mb-2">
           <Quote size={16} className="text-stone-500" />
           <button 
              onClick={onShuffleQuote}
              className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'text-stone-600 hover:text-stone-400' : 'text-stone-400 hover:text-stone-600'}`}
              title="Shuffle Wisdom"
           >
              <RefreshCw size={12} />
           </button>
        </div>
        <p className="text-xs font-serif italic leading-relaxed mb-2 opacity-80 line-clamp-3">
          "{dailyQuote.text}"
        </p>
        <p className="text-[10px] uppercase tracking-widest opacity-60">— {dailyQuote.author}</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-60">
          <span>Daily Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className={`h-1 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-stone-800' : 'bg-[#D6D3D1]'}`}>
          <div 
            className={`h-full transition-all duration-700 ease-out ${isDarkMode ? 'bg-stone-500' : 'bg-[#5C5A56]'}`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  </aside>
);

const TaskItem = ({ task, onToggle, onDelete, onFocus, isDarkMode }) => (
  <div className={`group flex items-center justify-between p-4 rounded-md border transition-all duration-300 
    ${task.completed 
      ? (isDarkMode ? 'bg-stone-900/50 border-transparent opacity-40' : 'bg-[#F5F5F4] border-transparent opacity-50')
      : (isDarkMode ? 'bg-[#292524] border-stone-800 hover:border-stone-600' : 'bg-white border-[#E7E5E4] hover:border-[#A8A29E] shadow-sm')
    }`}>
    <div className="flex items-center gap-4 flex-1 overflow-hidden">
      <button 
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors 
          ${task.completed 
            ? (isDarkMode ? 'bg-stone-600 border-stone-600 text-stone-200' : 'bg-[#78716C] border-[#78716C] text-[#EBE9E4]')
            : (isDarkMode ? 'border-stone-600 hover:border-stone-400' : 'border-stone-300 hover:border-[#78716C]')
          }`}
      >
        {task.completed && <CheckCircle2 size={12} />}
      </button>
      <span className={`text-sm tracking-tight truncate 
        ${task.completed 
          ? 'line-through opacity-60 font-serif italic' 
          : (isDarkMode ? 'text-stone-300' : 'text-stone-700')
        }`}>
        {task.text}
      </span>
    </div>
    
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
       {!task.completed && (
        <button 
            onClick={onFocus}
            className={`p-1.5 rounded transition-colors ${isDarkMode ? 'text-stone-500 hover:text-stone-300 hover:bg-stone-800' : 'text-stone-400 hover:text-stone-700 hover:bg-[#EBE9E4]'}`}
            title="Enter Monk Mode (Focus)"
        >
            <Maximize2 size={14} />
        </button>
       )}
        <button 
        onClick={() => onDelete(task.id)}
        className={`p-1.5 rounded transition-colors ${isDarkMode ? 'text-stone-600 hover:text-stone-400 hover:bg-stone-800' : 'text-stone-300 hover:text-stone-600 hover:bg-[#EBE9E4]'}`}
        title="Delete"
        >
        <Trash2 size={14} />
        </button>
    </div>
  </div>
);

const MonkModeOverlay = ({ task, timeLeft, isActive, toggleTimer, toggleTask, exitMode, formatTime, isDarkMode }) => (
  <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-8 animate-in fade-in duration-700 
    ${isDarkMode ? 'bg-[#1C1917] text-stone-300' : 'bg-[#F5F5F0] text-stone-700'}`}>
    
    <button 
      onClick={exitMode}
      className={`absolute top-8 right-8 p-3 rounded-full transition-colors ${isDarkMode ? 'hover:bg-stone-800 text-stone-500' : 'hover:bg-[#EBE9E4] text-stone-400'}`}
    >
      <X size={24} />
      <span className="sr-only">Exit Monk Mode</span>
    </button>

    <div className="max-w-3xl text-center space-y-12">
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest 
        ${isDarkMode ? 'bg-stone-800 text-stone-400' : 'bg-[#EBE9E4] text-stone-500'}`}>
        <Maximize2 size={12} />
        Monk Mode Active
      </div>

      <h2 className={`text-4xl md:text-6xl font-light leading-tight ${isDarkMode ? 'text-stone-200' : 'text-stone-700'}`}>
        {task.text}
      </h2>

      <div className="flex flex-col items-center gap-8">
        <div className={`text-8xl font-thin tabular-nums ${isDarkMode ? 'text-stone-600' : 'text-stone-400'}`}>
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex items-center gap-6">
            <button 
              onClick={toggleTimer}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg 
                ${isDarkMode ? 'bg-stone-700 text-stone-100 hover:bg-stone-600 shadow-stone-900' : 'bg-[#5C5A56] text-[#EBE9E4] hover:bg-[#44403C] shadow-[#D6D3D1]'}`}
            >
              {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            
            <button
              onClick={() => toggleTask(task.id)}
              className={`px-8 py-4 rounded-full border-2 text-sm font-bold tracking-widest uppercase transition-all duration-300 
                ${task.completed 
                  ? (isDarkMode ? 'bg-stone-700 border-stone-700 text-stone-100' : 'bg-[#5C5A56] border-[#5C5A56] text-[#EBE9E4]') 
                  : (isDarkMode ? 'border-stone-700 text-stone-500 hover:bg-stone-700 hover:text-stone-100' : 'border-[#5C5A56] text-[#5C5A56] hover:bg-[#5C5A56] hover:text-[#EBE9E4]')}`}
            >
              {task.completed ? 'Completed' : 'Complete Task'}
            </button>
        </div>
      </div>

      <p className="font-serif italic text-sm mt-12 animate-pulse opacity-50">
        "Do it as if it were the last thing you were doing in your life."
      </p>
    </div>
  </div>
);

// ==========================================
// 4. Feature Views (Sub-Screens)
// ==========================================

const MatrixView = ({ tasks, onAddTask, onToggleTask, onDeleteTask, onFocusTask, isDarkMode }) => {
  const [newTask, setNewTask] = React.useState("");
  const [newCategory, setNewCategory] = React.useState("q1");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask(newTask, newCategory);
    setNewTask("");
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
      <header className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b pb-6 transition-colors ${isDarkMode ? 'border-stone-800' : 'border-[#E7E5E4]'}`}>
        <div>
          <h2 className={`text-3xl font-light mb-1 tracking-tight ${isDarkMode ? 'text-stone-200' : 'text-stone-700'}`}>The Matrix</h2>
          <p className={`font-serif italic text-sm ${isDarkMode ? 'text-stone-500' : 'text-stone-500'}`}>Visualize your priorities.</p>
        </div>
        
        <form onSubmit={handleSubmit} className={`flex gap-0 shadow-sm rounded-lg overflow-hidden border w-full md:w-auto transition-colors ${isDarkMode ? 'border-stone-700' : 'border-[#D6D3D1]'}`}>
          <input 
            type="text" 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Capture task..." 
            className={`px-4 py-2 text-sm focus:outline-none flex-grow md:w-64 placeholder:text-stone-500 transition-colors 
              ${isDarkMode ? 'bg-[#292524] text-stone-200' : 'bg-white text-stone-700'}`}
          />
          <select 
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className={`border-l px-3 text-xs focus:outline-none max-w-[120px] transition-colors
              ${isDarkMode ? 'bg-[#292524] border-stone-700 text-stone-400 hover:bg-stone-800' : 'bg-[#EBE9E4] border-[#D6D3D1] text-stone-600 hover:bg-[#E0DED9]'}`}
          >
            {Object.entries(MATRIX_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          <button type="submit" className={`px-3 transition-colors ${isDarkMode ? 'bg-stone-700 text-stone-200 hover:bg-stone-600' : 'bg-[#5C5A56] text-[#EBE9E4] hover:bg-[#44403C]'}`}>
            <Plus size={16} />
          </button>
        </form>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(MATRIX_CONFIG).map(([key, config]) => (
          <div key={key} className={`rounded-lg border p-6 flex flex-col h-[320px] transition-all duration-300 shadow-sm group 
            ${isDarkMode 
              ? `border-stone-800 hover:border-stone-600 ${key === 'q4' ? 'bg-[#0c0a09] opacity-60 hover:opacity-100' : 'bg-[#1c1917]'}` 
              : `border-[#E7E5E4] hover:border-[#D6D3D1] ${key === 'q2' ? 'bg-[#FAFAF9]' : key === 'q4' ? 'bg-[#F5F5F4] opacity-80 hover:opacity-100' : 'bg-white'}`
            }`}>
            <div className={`flex items-start justify-between mb-4 pb-3 border-b transition-colors ${isDarkMode ? 'border-stone-800' : 'border-[#F5F5F0]'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? config.darkClass : config.lightClass}`}>
                  <config.icon size={14} />
                </div>
                <div>
                  <h3 className={`font-bold text-xs uppercase tracking-widest transition-colors ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>{config.label}</h3>
                  <p className="text-[10px] text-stone-500 font-serif italic">"{config.subLabel}"</p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {tasks.filter(t => t.category === key).map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={onToggleTask} 
                  onDelete={onDeleteTask} 
                  onFocus={() => onFocusTask(task)}
                  isDarkMode={isDarkMode}
                />
              ))}
              {tasks.filter(t => t.category === key).length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
                  <div className="w-12 h-1 bg-current mb-4 rounded-full opacity-20" />
                  <p className="text-xs font-serif italic">{config.description}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const JournalView = ({ mode, setMode, isDarkMode, quotes, addQuote }) => {
  const [entry, setEntry] = React.useState({ habit: "", better: "", actions: "" });
  const [freeText, setFreeText] = React.useState("");
  const [quoteText, setQuoteText] = React.useState("");
  const [quoteAuthor, setQuoteAuthor] = React.useState("");

  const handleAddQuote = () => {
    addQuote(quoteText, quoteAuthor);
    setQuoteText("");
    setQuoteAuthor("");
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-700">
      <div className="mb-10 text-center">
        <h2 className={`text-3xl font-light mb-2 transition-colors ${isDarkMode ? 'text-stone-200' : 'text-stone-700'}`}>The Journal</h2>
        <p className="text-stone-500 font-serif italic mb-8">"I examine my entire day and go back over what I've done and said, hiding nothing from myself." — Seneca</p>
        
        <div className={`inline-flex p-1 rounded-full transition-colors ${isDarkMode ? 'bg-stone-800' : 'bg-[#EBE9E4]'}`}>
          {[
            { id: 'audit', label: 'Daily Audit', icon: ListChecks },
            { id: 'free', label: 'Free Write', icon: AlignLeft },
            { id: 'quotes', label: 'My Mantras', icon: Sparkles }
          ].map((m) => (
            <button 
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all 
                ${mode === m.id
                  ? (isDarkMode ? 'bg-stone-600 text-stone-100 shadow-sm' : 'bg-white text-stone-700 shadow-sm') 
                  : 'text-stone-500 hover:text-stone-400'}`}
            >
              <div className="flex items-center gap-2">
                <m.icon size={14} />
                <span>{m.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {mode === 'audit' && (
        <div className="space-y-6">
          {[
            { id: 'habit', label: '1. What bad habit did I curb today?', placeholder: 'Did I resist anger? Did I avoid procrastination?...' },
            { id: 'better', label: '2. In what way am I better?', placeholder: 'Did I learn something? Was I kind when I could have been cruel?...' },
            { id: 'actions', label: '3. Were my actions just?', placeholder: 'Did I treat others with fairness? Did I fulfill my duties?...' }
          ].map((field) => (
            <div key={field.id} className={`p-6 rounded-lg border shadow-sm transition-all 
              ${isDarkMode ? 'bg-[#292524] border-stone-800 hover:border-stone-600' : 'bg-white border-[#E7E5E4] hover:border-[#D6D3D1]'}`}>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">{field.label}</label>
              <textarea 
                className={`w-full p-4 rounded-md focus:outline-none focus:ring-1 min-h-[80px] resize-none text-sm transition-colors
                  ${isDarkMode 
                    ? 'bg-[#1c1917] text-stone-300 placeholder:text-stone-600 focus:ring-stone-600' 
                    : 'bg-[#FAFAF9] text-stone-700 placeholder:text-stone-300 focus:ring-[#D6D3D1]'}`}
                placeholder={field.placeholder}
                value={entry[field.id]}
                onChange={(e) => setEntry({...entry, [field.id]: e.target.value})}
              />
            </div>
          ))}
          <div className="flex justify-end mt-6">
            <button className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors shadow-md 
              ${isDarkMode ? 'bg-stone-700 text-stone-100 hover:bg-stone-600' : 'bg-[#5C5A56] text-[#EBE9E4] hover:bg-[#44403C]'}`}>
              Save Audit
            </button>
          </div>
        </div>
      )}

      {mode === 'free' && (
        <div className="animate-in fade-in duration-500">
          <div className={`p-8 rounded-lg border shadow-sm min-h-[400px] flex flex-col relative overflow-hidden transition-all
            ${isDarkMode ? 'bg-[#292524] border-stone-800' : 'bg-white border-[#E7E5E4]'}`}>
            <textarea 
              className={`w-full flex-1 bg-transparent focus:outline-none text-lg leading-relaxed resize-none font-serif z-10 transition-colors
                ${isDarkMode ? 'text-stone-300 placeholder:text-stone-600' : 'text-stone-700 placeholder:text-stone-300'}`}
              placeholder="Empty your mind..."
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
            />
            <div className="absolute bottom-0 right-0 p-8 opacity-10 pointer-events-none">
              <PenTool size={120} className="text-stone-500" />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors shadow-md 
              ${isDarkMode ? 'bg-stone-700 text-stone-100 hover:bg-stone-600' : 'bg-[#5C5A56] text-[#EBE9E4] hover:bg-[#44403C]'}`}>
              Save Entry
            </button>
          </div>
        </div>
      )}

      {mode === 'quotes' && (
        <div className="animate-in fade-in duration-500 max-w-xl mx-auto">
          <div className={`p-8 rounded-lg border shadow-sm transition-all mb-8
            ${isDarkMode ? 'bg-[#292524] border-stone-800' : 'bg-white border-[#E7E5E4]'}`}>
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Quote</label>
                <textarea 
                  className={`w-full p-4 rounded-md focus:outline-none focus:ring-1 min-h-[100px] resize-none text-lg font-serif italic transition-colors
                    ${isDarkMode 
                      ? 'bg-[#1c1917] text-stone-300 placeholder:text-stone-600 focus:ring-stone-600' 
                      : 'bg-[#FAFAF9] text-stone-700 placeholder:text-stone-300 focus:ring-[#D6D3D1]'}`}
                  placeholder="Type your mantra here..."
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Author (Optional)</label>
                <input 
                  type="text"
                  className={`w-full p-3 rounded-md focus:outline-none focus:ring-1 text-sm transition-colors
                    ${isDarkMode 
                      ? 'bg-[#1c1917] text-stone-300 placeholder:text-stone-600 focus:ring-stone-600' 
                      : 'bg-[#FAFAF9] text-stone-700 placeholder:text-stone-300 focus:ring-[#D6D3D1]'}`}
                  placeholder="e.g. Me, Marcus Aurelius..."
                  value={quoteAuthor}
                  onChange={(e) => setQuoteAuthor(e.target.value)}
                />
              </div>
              <button 
                onClick={handleAddQuote}
                disabled={!quoteText.trim()}
                className={`w-full py-3 rounded-md text-xs font-bold uppercase tracking-widest transition-colors shadow-md 
                  ${!quoteText.trim() 
                    ? (isDarkMode ? 'bg-stone-800 text-stone-600 cursor-not-allowed' : 'bg-stone-200 text-stone-400 cursor-not-allowed')
                    : (isDarkMode ? 'bg-stone-700 text-stone-100 hover:bg-stone-600' : 'bg-[#5C5A56] text-[#EBE9E4] hover:bg-[#44403C]')}`}
              >
                Add to Wisdom Library
              </button>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">Your Custom Collection</h3>
             {quotes.length > INITIAL_QUOTES.length ? (
                <div className="space-y-3">
                  {quotes.slice(INITIAL_QUOTES.length).map((q, idx) => (
                    <div key={idx} className={`p-4 rounded-md border text-left flex justify-between items-start group
                      ${isDarkMode ? 'bg-[#1c1917] border-stone-800' : 'bg-white border-[#E7E5E4]'}`}>
                      <div>
                        <p className={`font-serif italic text-sm mb-1 ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>"{q.text}"</p>
                        <p className="text-[10px] uppercase tracking-widest text-stone-400">— {q.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
             ) : (
               <div className={`p-6 rounded-md border border-dashed text-center
                  ${isDarkMode ? 'border-stone-800 text-stone-600' : 'border-[#D6D3D1] text-stone-400'}`}>
                 <p className="text-sm">No custom mantras added yet.</p>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

const FocusTimerView = ({ timer, formatTime, isDarkMode }) => (
  <div className="max-w-xl mx-auto mt-16 animate-in slide-in-from-bottom-10 duration-700">
    <div className="flex flex-col items-center">
      <div className={`flex justify-center gap-2 mb-12 p-1.5 rounded-full transition-colors ${isDarkMode ? 'bg-stone-800' : 'bg-[#EBE9E4]'}`}>
        {['focus', 'short-break', 'long-break'].map((m) => (
           <button 
            key={m}
            onClick={() => timer.setMode(m)}
            className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 
              ${timer.mode === m 
                ? (isDarkMode ? 'bg-stone-600 text-stone-100 shadow-sm' : 'bg-white text-stone-700 shadow-sm') 
                : 'text-stone-500 hover:text-stone-400'}`}
          >
            {m.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="relative mb-12 group cursor-default">
        <div className={`text-9xl font-light tracking-tighter tabular-nums select-none transition-colors ${isDarkMode ? 'text-stone-200' : 'text-stone-700'}`}>
          {formatTime(timer.timeLeft)}
        </div>
      </div>

      <div className="flex justify-center items-center gap-8 mb-12">
        <button 
          onClick={timer.resetTimer}
          className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300 
            ${isDarkMode 
              ? 'border-stone-700 text-stone-500 hover:text-stone-300 hover:border-stone-500' 
              : 'border-[#D6D3D1] text-stone-400 hover:text-stone-700 hover:border-[#A8A29E]'}`}
        >
          <RotateCcw size={20} />
        </button>
        <button 
          onClick={timer.toggleTimer}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg 
            ${isDarkMode ? 'bg-stone-700 text-stone-100 hover:bg-stone-600 shadow-stone-900' : 'bg-[#5C5A56] text-[#EBE9E4] hover:bg-[#44403C] shadow-[#D6D3D1]'}`}
        >
          {timer.isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
        <button 
          className={`w-14 h-14 rounded-full border transition-all duration-300 flex items-center justify-center 
            ${timer.soundEnabled 
              ? (isDarkMode ? 'border-stone-500 text-stone-300 bg-stone-800' : 'border-[#5C5A56] text-[#5C5A56] bg-[#EBE9E4]') 
              : (isDarkMode ? 'border-stone-700 text-stone-500 hover:border-stone-500' : 'border-[#D6D3D1] text-stone-400 hover:border-[#A8A29E]')}`}
          onClick={timer.toggleSound}
          title="White Noise (Simulated)"
        >
          {timer.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      {timer.soundEnabled && (
        <div className={`mb-8 px-4 py-2 rounded-lg text-xs flex items-center gap-2 animate-in fade-in transition-colors ${isDarkMode ? 'bg-stone-800 text-stone-400' : 'bg-[#EBE9E4] text-stone-500'}`}>
            <div className="flex gap-1">
                <div className="w-1 h-3 bg-stone-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-1 h-3 bg-stone-400 rounded-full animate-pulse delay-150"></div>
                <div className="w-1 h-3 bg-stone-400 rounded-full animate-pulse delay-300"></div>
            </div>
            <span>White noise ambience active (Visual mode)</span>
        </div>
      )}

      <div className="mt-8 text-center max-w-sm">
        <p className="text-stone-500 text-xs font-serif italic">
          "Concentrate every minute like a Roman—like a man—on doing what's in front of you with precise and genuine seriousness."
        </p>
        <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-2">— Marcus Aurelius</p>
      </div>
    </div>
  </div>
);

const PlaybookView = ({ isDarkMode }) => (
  <div className="max-w-4xl mx-auto animate-in fade-in duration-700">
    <div className={`mb-12 border-b pb-6 transition-colors ${isDarkMode ? 'border-stone-800' : 'border-[#E7E5E4]'}`}>
      <h2 className={`text-3xl font-light mb-2 transition-colors ${isDarkMode ? 'text-stone-200' : 'text-stone-700'}`}>The Playbook</h2>
      <p className="text-stone-500 font-serif italic">Operating principles for a focused life.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {PLAYBOOK_LESSONS.map((lesson, idx) => (
        <div key={idx} className={`p-8 rounded-lg border shadow-sm transition-colors 
          ${isDarkMode ? 'bg-[#292524] border-stone-800 hover:border-stone-600' : 'bg-white border-[#E7E5E4] hover:border-[#D6D3D1]'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-md transition-colors ${isDarkMode ? 'bg-stone-800 text-stone-400' : 'bg-[#F5F5F0] text-stone-600'}`}>
              {lesson.icon}
            </div>
            <h3 className={`text-lg font-semibold transition-colors ${isDarkMode ? 'text-stone-200' : 'text-stone-700'}`}>{lesson.title}</h3>
          </div>
          <div className={`pl-4 border-l-2 mb-4 transition-colors ${isDarkMode ? 'border-stone-700' : 'border-[#E7E5E4]'}`}>
            <p className="text-sm font-serif italic text-stone-500">
              "{lesson.analogy}"
            </p>
          </div>
          <p className="text-stone-500 text-sm leading-relaxed">
            {lesson.explanation}
          </p>
        </div>
      ))}
    </div>
  </div>
);

// ==========================================
// 5. Main Application Logic
// ==========================================

const App = () => {
  // --- Global State ---
  const [activeTab, setActiveTab] = React.useState('tasks');
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
  // --- Feature Hooks ---
  const taskManager = useTaskManager();
  const timer = useProductivityTimer();

  // --- Quote Logic ---
  const [quotes, setQuotes] = React.useState(INITIAL_QUOTES);
  const [dailyQuote, setDailyQuote] = React.useState(INITIAL_QUOTES[0]);

  // --- UI State ---
  const [monkModeTask, setMonkModeTask] = React.useState(null);
  const [journalMode, setJournalMode] = React.useState('audit'); 

  // --- Effects ---
  React.useEffect(() => {
    // Pick random quote on mount
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setDailyQuote(randomQuote);
  }, []); // Intentional empty dependency array

  // --- Helper Functions ---
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShuffleQuote = () => {
    let newQuote;
    do {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    } while (newQuote === dailyQuote && quotes.length > 1);
    setDailyQuote(newQuote);
  };

  const handleAddCustomQuote = (text, author) => {
    if (!text.trim()) return;
    const newQuote = { text, author: author.trim() || "Self" };
    setQuotes(prev => [...prev, newQuote]);
    setDailyQuote(newQuote); // Immediate gratification
  };

  const handleTaskCompletion = (id) => {
    taskManager.toggleTask(id);
    // If completing the monk-mode task, exit mode after a delay
    if (monkModeTask && monkModeTask.id === id) {
      setTimeout(() => setMonkModeTask(null), 800);
    }
  };

  // --- Render ---

  if (monkModeTask) {
    return (
      <MonkModeOverlay 
        task={monkModeTask}
        timeLeft={timer.timeLeft}
        isActive={timer.isActive}
        toggleTimer={timer.toggleTimer}
        toggleTask={handleTaskCompletion}
        exitMode={() => setMonkModeTask(null)}
        formatTime={formatTime}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <div className={`flex flex-col md:flex-row min-h-screen font-sans transition-colors duration-500 
      ${isDarkMode 
        ? 'bg-[#191716] text-stone-300 selection:bg-stone-700 selection:text-stone-200' 
        : 'bg-[#F5F5F0] text-stone-700 selection:bg-[#E7E5E4] selection:text-stone-800'}`}>
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        dailyQuote={dailyQuote} 
        onShuffleQuote={handleShuffleQuote}
        progress={taskManager.getProgress()}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      
      <main className="flex-1 p-6 md:p-12 max-h-screen overflow-y-auto custom-scrollbar">
        {activeTab === 'tasks' && (
          <MatrixView 
            tasks={taskManager.tasks}
            onAddTask={taskManager.addTask}
            onToggleTask={handleTaskCompletion}
            onDeleteTask={taskManager.deleteTask}
            onFocusTask={setMonkModeTask}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'timer' && (
          <FocusTimerView 
            timer={timer} 
            formatTime={formatTime}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'journal' && (
          <JournalView 
            mode={journalMode}
            setMode={setJournalMode}
            isDarkMode={isDarkMode}
            quotes={quotes}
            addQuote={handleAddCustomQuote}
          />
        )}

        {activeTab === 'learn' && (
          <PlaybookView isDarkMode={isDarkMode} />
        )}
      </main>

      {/* Global Styles for Scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#57534E' : '#D6D3D1'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? '#78716C' : '#A8A29E'};
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-from-bottom-10 {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-in {
          animation-fill-mode: both;
        }
      `}} />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
