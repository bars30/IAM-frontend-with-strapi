import { getBotReply } from "./lang-handler.js";
import { chatboxMessages, promptsSection, input, questionsBtn, langButtons } from "./dom-elements.js";
import { saveChatHistory } from "./chat-history.js";
import { typeTextHTML } from "./message-renderer.js";

const clearBtn = document.getElementById("clearBtn");
const sendBtn = document.getElementById("sendBtn");

export function setupPromptButtons(langSwitcher, footerBtn) {
  const promptButtons = document.querySelectorAll(".quick-prompts-btn");

  promptButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedPrompt = btn.textContent;

      // Disable բոլոր prompt-buttons
      promptButtons.forEach(b => b.disabled = true);

      // Disable միայն Find out more, sendBtn և language buttons
      questionsBtn.disabled = true;
      sendBtn.disabled = true;
      langButtons.forEach(b => b.disabled = true);
      langSwitcher.classList.add("disabled");

      promptsSection.classList.add("fade-out");

      setTimeout(() => {
        promptsSection.style.display = "none"; 
        chatboxMessages.style.display = "flex";
        input.classList.add("shrink");

        // User message
        const userMsg = document.createElement("div");
        userMsg.className = "message user-message";
        const userP = document.createElement("p");
        userP.textContent = selectedPrompt;
        userMsg.appendChild(userP);
        chatboxMessages.appendChild(userMsg);
        saveChatHistory();

        // Bot message
        const botMsg = document.createElement("div");
        botMsg.className = "message bot-message";
        const botP = document.createElement("p");
        botMsg.appendChild(botP);
        chatboxMessages.appendChild(botMsg);
        botMsg.classList.add("new-bot-message");
        saveChatHistory();

        let delay = 7;
        if (selectedPrompt == "Data Protection" || selectedPrompt == "Datenschutz") {
          delay = 0.11;
        }

        // Bot types message
        typeTextHTML(botP, getBotReply(selectedPrompt), delay, () => {
          // Enable AFTER bot finishes typing
          questionsBtn.disabled = false;
          sendBtn.disabled = false;
          langButtons.forEach(b => b.disabled = false);
          langSwitcher.classList.remove("disabled");
          saveChatHistory();
        });
      }, 400);
    });
  });

  // Footer prompts hide
  const footerPromptButtons = document.querySelectorAll('.quick-prompts-footer .quick-prompts-btn');
  const footerPrompts = document.querySelector(".quick-prompts-footer");

  footerPromptButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      footerPrompts.classList.remove("fade-in");
      footerPrompts.classList.add("fade-out");
      setTimeout(() => {
        footerPrompts.style.display = "none";
      }, 300);
    });
  });
}
