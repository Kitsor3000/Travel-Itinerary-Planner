document.addEventListener('DOMContentLoaded', function() {
  // Анімація скролу шапки
  const header = document.querySelector('.header');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Генератор маршрутів
  const generateBtn = document.getElementById('generate-btn');
  generateBtn.addEventListener('click', function() {
    const destination = document.getElementById('destination-input').value.trim();
    if (destination) {
      const btnText = this.querySelector('span');
      const originalText = btnText.textContent;
      
      // Анімація завантаження
      btnText.textContent = 'Генерація...';
      this.disabled = true;
      
      // Імітація завантаження
      setTimeout(() => {
        window.location.href = `itinerary.html?destination=${encodeURIComponent(destination)}`;
        btnText.textContent = originalText;
        this.disabled = false;
      }, 2000);
    } else {
      // Анімація помилки
      const input = document.getElementById('destination-input');
      input.style.border = '1px solid #FF7E5F';
      setTimeout(() => {
        input.style.border = 'none';
      }, 1000);
    }
  });

  // Мобільне меню
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.main-nav');
  
  mobileMenuBtn.addEventListener('click', function() {
    nav.classList.toggle('active');
    this.classList.toggle('active');
  });

  // Плавний скрол
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Ініціалізація анімацій
  initAnimations();
});

function initAnimations() {
  // Анімація карток при скролі
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .destination-card').forEach(card => {
    observer.observe(card);
  });
}