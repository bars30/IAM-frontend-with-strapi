import { questionsBtn } from "./dom-elements.js";
import { setupThemeToggle } from './theme-toggler.js';
import { restoreChatHistory } from './chat-history.js';
import { initFileManager } from './file-manager.js';
import { setupLanguageSwitcher } from './language-switcher.js';
import { setupChatController } from './chat-controller.js';
import { setupPromptButtons } from "./prompt-buttons.js";
import { setupLangButtonListeners } from "./lang-button-listeners.js";
import { setupQuickPromptsToggle } from "./quick-prompts-toggle.js";
import { setupTextareaAutosize } from './input-autoresize.js';
import { setupClearChatButtons } from './clear-chat.js';


document.addEventListener("DOMContentLoaded", () => {

  setupThemeToggle();
  restoreChatHistory();
  initFileManager();
  setupChatController();
  setupLangButtonListeners();
  
  const { langSwitcher } = setupLanguageSwitcher();
  const footerBtn = document.querySelectorAll(".footer-btn-cont button");
  setupQuickPromptsToggle(questionsBtn);
  const textarea = document.getElementById('chatbox-input');
  setupTextareaAutosize(textarea);
  const sendBtn = document.querySelector(".chatbox-send-btn");
  setupPromptButtons(langSwitcher, sendBtn, footerBtn);
  setupClearChatButtons();

});
