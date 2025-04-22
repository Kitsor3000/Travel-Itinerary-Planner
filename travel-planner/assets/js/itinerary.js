document.addEventListener('DOMContentLoaded', () => {
  // Логіка додавання днів
  document.querySelector('.add-day-btn').addEventListener('click', addNewDay);
  
  // Логіка пошуку
  document.querySelector('.search-btn').addEventListener('click', handleSearch);
});

function addNewDay() {
  const dayCount = document.querySelectorAll('.day-tab').length;
  const newDay = document.createElement('div');
  newDay.className = 'day-tab';
  newDay.textContent = `День ${dayCount + 1}`;
  document.querySelector('.days-tabs').insertBefore(newDay, document.querySelector('.add-day-btn'));
}

function handleSearch() {
  const query = document.getElementById('place-search').value;
  if (query) searchPlaces(query);
}