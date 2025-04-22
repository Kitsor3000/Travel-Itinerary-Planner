document.addEventListener('DOMContentLoaded', function() {
  // Перемикання вкладок
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Видаляємо активний клас у всіх кнопках і вмісті
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Додаємо активний клас до обраної кнопки і вмісту
      this.classList.add('active');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });

  // Завантаження даних профілю
  function loadProfileData() {
    // Тут можна додати завантаження даних з API
    console.log('Завантаження даних профілю...');
  }

  // Обробник зміни аватара
  const editAvatarBtn = document.querySelector('.edit-avatar-btn');
  editAvatarBtn.addEventListener('click', function(e) {
    e.preventDefault();
    // Тут можна додати логіку завантаження нового аватара
    alert('Функція зміни аватара буде реалізована пізніше');
  });

  // Ініціалізація
  loadProfileData();
});