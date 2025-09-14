export function setupClearChatButtons() {
  const clearBtns = document.querySelectorAll('.chatbox-footer-btn.clear-btn');
  clearBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.removeItem('chatHistory');
      location.reload();
    });
  });
}
