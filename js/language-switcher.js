import { setCurrentLang, updateUIText, getCurrentLang } from "./lang-handler.js";

export function setupLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-option');
  const langSwitcher = document.querySelector('.language-switcher');

  if (!langButtons.length) return;

  langButtons.forEach(button => {
    button.addEventListener('click', () => {
      langButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const selectedLang = button.dataset.lang;
      setCurrentLang(selectedLang);
      localStorage.setItem('lang', selectedLang);

      updateUIText();
    });
  });

  const storedLang = localStorage.getItem('lang');
  if (storedLang) {
    langButtons.forEach(btn => btn.classList.remove('active'));
    langButtons.forEach(button => {
      if (button.dataset.lang === storedLang) {
        button.classList.add('active');
      }
    });
    setTimeout(() => {
      updateUIText();
    }, 100);
  }
  
  return { langSwitcher };
}
