const pages = document.querySelectorAll('.page');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentPageIndex = 0;

function showPage(index) {
  pages[currentPageIndex].style.opacity = 0;
  setTimeout(() => {
    pages[currentPageIndex].style.display = 'none';
    pages[index].style.display = 'block';
    setTimeout(() => {
      pages[index].style.opacity = 1;
    }, 10);
    currentPageIndex = index;
    updateButtonState();
  }, 500);
}

function updateButtonState() {
  prevBtn.disabled = currentPageIndex === 0;
  nextBtn.disabled = currentPageIndex === pages.length - 1;
}

prevBtn.addEventListener('click', () => {
  if (currentPageIndex > 0) {
    showPage(currentPageIndex - 1);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPageIndex < pages.length - 1) {
    showPage(currentPageIndex + 1);
  }
});

showPage(currentPageIndex);
