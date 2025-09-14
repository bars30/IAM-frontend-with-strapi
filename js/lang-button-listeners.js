import { setCurrentLang, updateUIText } from "./lang-handler.js";

export function setupLangButtonListeners() {
  document.querySelectorAll(".lang-option").forEach(button => {
    button.addEventListener("click", () => {
      let lang = button.getAttribute("data-lang");
      setCurrentLang(lang);
      localStorage.setItem("lang", lang);
      updateUIText();
    });
  });
}
