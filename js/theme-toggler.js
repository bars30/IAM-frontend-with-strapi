export function setupThemeToggle() {
  const toggle = document.getElementById("modeToggle");
  const root = document.documentElement;
  const logoLight = document.getElementById("logo-light");
  const logoDark = document.getElementById("logo-dark");

  if (!toggle || !root || !logoLight || !logoDark) return;

  function applyDarkTheme() {
    root.style.setProperty('--bg-page', '#19212E');
    root.style.setProperty('--bg-chatbox', '#333942');
    root.style.setProperty('--bg-language-switch', '#2D343E');
    root.style.setProperty('--prompt-bg', '#2E343F');
    root.style.setProperty('--prompt-text', '#F1F2F2');
    root.style.setProperty('--border-color', '#3A414B');
    root.style.setProperty('--text-subtitle', '#B0B8C1');
    root.style.setProperty('--text-placeholder', '#A0AAB4');
    root.style.setProperty('--text-dark', '#ffffff');
    root.style.setProperty('--header-footer', '#333942');
    root.style.setProperty('--button-shadow', '#6c788d');

    logoLight.style.display = "none";
    logoDark.style.display = "inline";
  }

  function applyLightTheme() {
    root.style.setProperty('--bg-page', '#F2F7FD');
    root.style.setProperty('--bg-chatbox', '#ffffffff');
    root.style.setProperty('--bg-language-switch', '#F9F9F9');
    root.style.setProperty('--prompt-bg', '#FDFEFF');
    root.style.setProperty('--prompt-text', '#4A5362');
    root.style.setProperty('--border-color', '#F0F3F7');
    root.style.setProperty('--text-subtitle', '#536073');
    root.style.setProperty('--text-placeholder', '#6F7E93');
    root.style.setProperty('--text-dark', '#1a1a1a');
    root.style.setProperty('--header-footer', '#ffffff');
    root.style.setProperty('--button-shadow', '#c4cfe3');

    logoLight.style.display = "inline";
    logoDark.style.display = "none";
  }

  toggle.checked = true;
  applyDarkTheme();

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      applyDarkTheme();
    } else {
      applyLightTheme();
    }
  });
}
