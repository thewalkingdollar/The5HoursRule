// Save checkbox state to localStorage
document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = document.querySelectorAll('.block input[type="checkbox"]');
  
  // Load saved state
  checkboxes.forEach(box => {
    const saved = localStorage.getItem(box.id);
    if (saved === 'true') box.checked = true;
    
    box.addEventListener('change', () => {
      localStorage.setItem(box.id, box.checked);
    });
  });
});

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
        cards.forEach(c => c.classList.remove('active-step'));
        entry.target.classList.add('active-step');
        panels.forEach(p => p.classList.remove('active'));
        const activePanel = document.querySelector(`.reveal-panel[data-panel="${step}"]`);
        if (activePanel) activePanel.classList.add('active');
        dots.forEach(d => d.classList.remove('active'));
        const activeDot = document.querySelector(`.progress-dot[data-dot="${step}"]`);
        if (activeDot) activeDot.classList.add('active');
        if (window.lucide) lucide.createIcons();
      }
    });
  }, { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 });
  cards.forEach(card => observer.observe(card));
  cards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => card.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  });
});
