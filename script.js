document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  // --- THEME SWITCHER ---
  const html = document.documentElement;
  const themeBtns = document.querySelectorAll('[data-theme-btn]');
  const savedTheme = localStorage.getItem('5h_theme') || 'attack';
  
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('5h_theme', theme);
    themeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.themeBtn === theme);
    });
    if (window.lucide) lucide.createIcons();
  }

  applyTheme(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.themeBtn;
      applyTheme(theme);
      // haptic feedback on mobile
      if (navigator.vibrate) navigator.vibrate(20);
    });
  });

  // Mobile menu
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => menu.classList.toggle('hidden'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.add('hidden')));
  }

  // Date
  const dateEl = document.getElementById('current-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  // TIMER
  const timerDisplay = document.getElementById('timer-display');
  const startBtn = document.getElementById('start-timer');
  const resetBtn = document.getElementById('reset-timer');
  const progressRing = document.getElementById('progress-ring');
  const CIRCUMFERENCE = 2 * Math.PI * 36;
  if (progressRing) progressRing.style.strokeDasharray = `${CIRCUMFERENCE}`;

  let totalSeconds = 5 * 60 * 60;
  let remainingSeconds = totalSeconds;
  let timerInterval = null;
  let isRunning = false;

  const savedRemaining = localStorage.getItem('5h_remaining');
  if (savedRemaining) {
    const parsed = parseInt(savedRemaining, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= totalSeconds) remainingSeconds = parsed;
  }

  function updateDisplay() {
    if (!timerDisplay) return;
    const h = Math.floor(remainingSeconds / 3600);
    const m = Math.floor((remainingSeconds % 3600) / 60);
    const s = remainingSeconds % 60;
    timerDisplay.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    if (progressRing) {
      const offset = CIRCUMFERENCE - (remainingSeconds / totalSeconds) * CIRCUMFERENCE;
      progressRing.style.strokeDashoffset = offset;
    }
  }

  function setButtonState(state) {
    if (!startBtn) return;
    if (state === 'running') startBtn.innerHTML = '<i data-lucide="pause" class="w-4 h-4"></i> Pause';
    else if (state === 'paused') startBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4"></i> Resume';
    else startBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4"></i> Start Timer';
    if (window.lucide) lucide.createIcons();
  }

  function startPause() {
    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
      setButtonState('paused');
      localStorage.setItem('5h_running', 'false');
    } else {
      if (remainingSeconds <= 0) remainingSeconds = totalSeconds;
      isRunning = true;
      setButtonState('running');
      localStorage.setItem('5h_running', 'true');
      timerInterval = setInterval(() => {
        if (remainingSeconds > 0) {
          remainingSeconds--;
          updateDisplay();
          localStorage.setItem('5h_remaining', remainingSeconds);
        } else {
          clearInterval(timerInterval);
          isRunning = false;
          startBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Complete';
          if (window.lucide) lucide.createIcons();
          localStorage.removeItem('5h_remaining');
          localStorage.removeItem('5h_running');
          alert('5 Hours Complete!');
        }
      }, 1000);
    }
  }

  function reset() {
    clearInterval(timerInterval);
    isRunning = false;
    remainingSeconds = totalSeconds;
    localStorage.removeItem('5h_remaining');
    localStorage.removeItem('5h_running');
    updateDisplay();
    setButtonState('idle');
  }

  if (startBtn) startBtn.addEventListener('click', startPause);
  if (resetBtn) resetBtn.addEventListener('click', reset);
  updateDisplay();
  if (localStorage.getItem('5h_running') === 'true' && remainingSeconds < totalSeconds && remainingSeconds > 0) {
    startPause();
  }

  // Checklist
  let tasks = [];
  try { tasks = JSON.parse(localStorage.getItem('5h_tasks') || '[]'); } catch(e) {}
  if (!tasks.length) {
    tasks = [
      { id: 1, text: "Review yesterday's intel & notes", done: false },
      { id: 2, text: "Identify top 3 high-impact actions", done: false },
      { id: 3, text: "Execute priority #1 - deep work mode", done: false },
      { id: 4, text: "Execute priority #2", done: false },
      { id: 5, text: "Execute priority #3 & log wins", done: false }
    ];
  }
  let nextId = tasks.length ? Math.max(...tasks.map(t=>t.id))+1 : 6;
  function saveTasks() { localStorage.setItem('5h_tasks', JSON.stringify(tasks)); }
  function render() {
    const list = document.getElementById('checklist');
    if (!list) return;
    list.innerHTML = '';
    tasks.forEach(t => {
      const div = document.createElement('div');
      div.className = 'flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition group w-full max-w-full overflow-hidden theme-card';
      div.innerHTML = `<input type="checkbox" id="task-${t.id}" class="checkbox-custom hidden" ${t.done ? 'checked' : ''}><label for="task-${t.id}" class="flex items-center gap-4 flex-1 cursor-pointer min-w-0"><div class="checkbox-icon w-6 h-6 border-2 border-slate-300 rounded-lg flex items-center justify-center transition flex-shrink-0"><svg class="w-4 h-4 text-white opacity-0 scale-50 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div><span class="flex-1 min-w-0 break-words text-slate-700 font-medium ${t.done ? 'line-through text-slate-400' : ''}">${t.text}</span><button class="delete-task opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded-lg transition flex-shrink-0" data-id="${t.id}"><i data-lucide="trash-2" class="w-4 h-4 text-red-500"></i></button></label>`;
      list.appendChild(div);
    });
    if (window.lucide) lucide.createIcons();
    const completed = tasks.filter(t=>t.done).length;
    const bar = document.getElementById('progress-bar');
    const txt = document.getElementById('progress-text');
    if (bar) bar.style.width = `${tasks.length ? (completed/tasks.length)*100 : 0}%`;
    if (txt) txt.textContent = `${completed}/${tasks.length} Complete`;
    list.querySelectorAll('.checkbox-custom').forEach(cb => {
      cb.addEventListener('change', e => {
        const id = parseInt(e.target.id.split('-')[1]);
        const task = tasks.find(x=>x.id===id);
        if (task) { task.done = e.target.checked; saveTasks(); render(); }
      });
    });
    list.querySelectorAll('.delete-task').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        tasks = tasks.filter(x=>x.id!==parseInt(btn.dataset.id));
        saveTasks(); render();
      });
    });
    saveTasks();
  }
  const addBtn = document.getElementById('add-task');
  if (addBtn) addBtn.addEventListener('click', () => {
    const text = prompt('Enter your attack task:');
    if (text && text.trim()) { tasks.push({ id: nextId++, text: text.trim(), done: false }); render(); }
  });
  render();

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        const top = target.getBoundingClientRect().top + window.pageYOffset - 64;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});
