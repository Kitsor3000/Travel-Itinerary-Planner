document.addEventListener("DOMContentLoaded", () => {
  const authBtn = document.getElementById("auth-btn");
  const modal = document.getElementById("auth-modal");
  const closeBtn = document.querySelector(".close-btn");

  // Показати модальне вікно
  authBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Закрити модальне вікно
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Закриття по кліку поза формою
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
