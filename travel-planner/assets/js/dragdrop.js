document.addEventListener('DOMContentLoaded', () => {
  const placesList = document.querySelector('.places-list');
  
  placesList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggingCard = document.querySelector('.dragging');
    if (!draggingCard) return;
    
    const afterElement = getDragAfterElement(placesList, e.clientY);
    if (afterElement) {
      placesList.insertBefore(draggingCard, afterElement);
    } else {
      placesList.appendChild(draggingCard);
    }
  });
});

function getDragAfterElement(container, y) {
  // Логіка визначення позиції
}