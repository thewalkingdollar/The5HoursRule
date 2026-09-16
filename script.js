// Initialize Lucide icons
  lucide.createIcons();

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });

  // Set current date
  const dateEl = document.getElementById('current-date');
  const now = new Date();
  dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Timer functionality
  let timerInterval;
  let totalSeconds = 5 * 60 * 60; // 5 hours in seconds
  let remainingSeconds = totalSeconds;
  let isRunning = false;

  const timerDisplay = document.getElementById('timer-display');
  const startBtn = document.getElementById('start-timer');
  const resetBtn = document.getElementById('reset-timer');
  const progressRing = document.getElementById('progress-ring');
  const circumference = 2 * Math.PI * 36;

  function updateTimerDisplay() {
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const offset = circumference - (remainingSeconds / totalSeconds) * circumference;
    progressRing.style.strokeDashoffset = offset;
  }

  function startTimer() {
    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4"></i> Resume';
      lucide.createIcons();
    } else {
      isRunning = true;
      startBtn.innerHTML = '<i data-lucide="pause" class="w-4 h-4"></i> Pause';
      lucide.createIcons();
      timerInterval = setInterval(() => {
        if (remainingSeconds > 0) {
          remainingSeconds--;
          updateTimerDisplay();
        } else {
          clearInterval(timerInterval);
          isRunning = false;
          startBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Complete';
          lucide.createIcons();
          alert('5 Hours Complete! Review your wins and log intel for tomorrow.');
        }
      }, 1000);
    }
  }

  function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    remainingSeconds = totalSeconds;
    updateTimerDisplay();
    startBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4"></i> Start Timer';
    lucide.createIcons();
  }

  startBtn.addEventListener('click', startTimer);
  resetBtn.addEventListener('click', resetTimer);
  updateTimerDisplay();

  // Checklist functionality
  let tasks = [
    { id: 1, text: 'Review yesterday\'s intel & notes', done: false },
    { id: 2, text: 'Identify top 3 high-impact actions', done: false },
    { id: 3, text: 'Execute priority #1 - deep work mode', done: false },
    { id: 4, text: 'Execute priority #2', done: false },
    { id: 5, text: 'Execute priority #3 & log wins', done: false }
  ];

  let taskIdCounter = 6;

  function renderChecklist() {
    const checklist = document.getElementById('checklist');
    checklist.innerHTML = '';
    
    tasks.forEach(task => {
      const taskEl = document.createElement('div');
      taskEl.className = 'flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition group';
      taskEl.innerHTML = `
        <input type="checkbox" id="task-${task.id}" class="checkbox-custom hidden" ${task.done ? 'checked' : ''}>
        <label for="task-${task.id}" class="flex items-center gap-4 flex-1 cursor-pointer">
          <div class="checkbox-icon w-6 h-6 border-2 border-slate-300 rounded-lg flex items-center justify-center transition flex-shrink-0">
            <svg class="w-4 h-4 text-white opacity-0 transform scale-50 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span class="text-slate-700 font-medium flex-1 ${task.done ? 'line-through text-slate-400' : ''}">${task.text}</span>
          <button class="delete-task opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded-lg transition" data-id="${task.id}">
            <i data-lucide="trash-2" class="w-4 h-4 text-red-500"></i>
          </button>
        </label>
      `;
      checklist.appendChild(taskEl);
    });
    
    lucide.createIcons();
    updateProgress();
    attachTaskListeners();
  }

  function attachTaskListeners() {
    document.querySelectorAll('.checkbox-custom').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const id = parseInt(e.target.id.split('-')[1]);
        const task = tasks.find(t => t.id === id);
        if (task) {
          task.done = e.target.checked;
          renderChecklist();
        }
      });
    });

    document.querySelectorAll('.delete-task').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = parseInt(btn.dataset.id);
        tasks = tasks.filter(t => t.id !== id);
        renderChecklist();
      });
    });
  }

  function updateProgress() {
    const completed = tasks.filter(t => t.done).length;
    const total = tasks.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    document.getElementById('progress-bar').style.width = `${percentage}%`;
    document.getElementById('progress-text').textContent = `${completed}/${total} Complete`;
  }

  function addTask() {
    const taskText = prompt('Enter your attack task:');
    if (taskText && taskText.trim()) {
      tasks.push({
        id: taskIdCounter++,
        text: taskText.trim(),
        done: false
      });
      renderChecklist();
    }
  }

  document.getElementById('add-task').addEventListener('click', addTask);
  renderChecklist();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 64;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

(function(){document.addEventListener("click",function(e){var a=e.target.closest("[data-product-id]");if(!a)return;e.preventDefault();var pid=a.getAttribute("data-product-id");if(pid)parent.postMessage({type:"ecto-artifact-link-click",productId:pid},"*")})})();


// Smooth scroll-linked reveal for How to Apply section
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.apply-card');
  const panels = document.querySelectorAll('.reveal-panel');
  const dots = document.querySelectorAll('.progress-dot');
  
  if (!cards.length || !panels.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const step = entry.target.dataset.step;
        
        // update cards
        cards.forEach(c => c.classList.remove('active-step'));
        entry.target.classList.add('active-step');
        
        // update panels with smooth fade
        panels.forEach(p => p.classList.remove('active'));
        const activePanel = document.querySelector(`.reveal-panel[data-panel="${step}"]`);
        if (activePanel) activePanel.classList.add('active');
        
        // update dots
        dots.forEach(d => d.classList.remove('active'));
        const activeDot = document.querySelector(`.progress-dot[data-dot="${step}"]`);
        if (activeDot) activeDot.classList.add('active');
        
        // re-init lucide icons for new panel
        if (window.lucide) lucide.createIcons();
      }
    });
  }, {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
  });

  cards.forEach(card => observer.observe(card));
  
  // Click to scroll to card = smooth right reveal
  cards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // Timer animation
  let seconds = 13931;
  const timerEl = document.getElementById('focus-timer');
  setInterval(() => {
    if (timerEl && document.querySelector('.reveal-panel[data-panel="2"].active')) {
      seconds--;
      const h = String(Math.floor(seconds/3600)).padStart(2,'0');
      const m = String(Math.floor((seconds%3600)/60)).padStart(2,'0');
      const s = String(seconds%60).padStart(2,'0');
      timerEl.textContent = `${h}:${m}:${s}`;
    }
  }, 1000);
});
