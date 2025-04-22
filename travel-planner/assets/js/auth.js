document.addEventListener('DOMContentLoaded', function() {
  // Елементи
  const authBtn = document.getElementById('auth-btn');
  const modal = document.getElementById('auth-modal');
  const closeBtn = document.querySelector('.close-btn');
  const toggleAuth = document.getElementById('toggle-auth');
  const authForm = document.getElementById('auth-form');
  const modalTitle = document.getElementById('modal-title');
  const submitBtn = document.querySelector('.submit-btn');
  
  let isLoginMode = true;

  // Відкриття модалки
  authBtn.addEventListener('click', function() {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });

  // Закриття модалки
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  closeBtn.addEventListener('click', closeModal);

  // Закриття при кліку на затемнення
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Перемикання між входом/реєстрацією
  toggleAuth.addEventListener('click', function() {
    isLoginMode = !isLoginMode;
    
    modalTitle.textContent = isLoginMode ? 'Увійти' : 'Реєстрація';
    submitBtn.textContent = isLoginMode ? 'Увійти' : 'Зареєструватись';
    toggleAuth.textContent = isLoginMode 
      ? 'Немає акаунту? Зареєструватись' 
      : 'Вже є акаунт? Увійти';
  });

  // Обробка форми
  authForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (isLoginMode) {
      console.log('Увійти з:', email);
      // Тут буде логіка входу
    } else {
      console.log('Реєстрація:', email);
      // Тут буде логіка реєстрації
    }
    
    closeModal();
  });

  // Перевірка авторизації при завантаженні
  if (localStorage.getItem('isLoggedIn')) {
    authBtn.innerHTML = '<i class="fas fa-user"></i> Профіль';
    authBtn.onclick = () => window.location.href = 'profile.html';
  }
});