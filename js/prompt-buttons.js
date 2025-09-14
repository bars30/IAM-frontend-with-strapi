import { getBotReply } from "./lang-handler.js";
import { chatboxMessages, promptsSection, input, questionsBtn, langButtons } from "./dom-elements.js";
import { saveChatHistory } from "./chat-history.js";
import { typeTextHTML } from "./message-renderer.js";

export function setupPromptButtons(langSwitcher, sendBtn, footerBtn) {
  const promptButtons = document.querySelectorAll(".quick-prompts-btn");

  let firstMessage = true;

  promptButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedPrompt = btn.textContent;
      
      
      promptButtons.forEach(b => b.disabled = true);
      footerBtn[0].disabled = true;
      footerBtn[1].disabled = true;
      promptsSection.classList.add("fade-out");
 
      setTimeout(() => {
        promptsSection.style.display = "none"; 
        chatboxMessages.style.display = "flex";
        input.classList.add("shrink");
        setTimeout(() => {
          questionsBtn.classList.add("visible");
        }, 200);

        const userMsg = document.createElement("div");
        userMsg.className = "message user-message";
        const userP = document.createElement("p");
        userP.textContent = selectedPrompt;
        userMsg.appendChild(userP);
        chatboxMessages.appendChild(userMsg);
        saveChatHistory();

        setTimeout(() => {
          chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
        }, 50);

        const botMsg = document.createElement("div");
        botMsg.className = "message bot-message";
        const botP = document.createElement("p");
        botMsg.appendChild(botP);
        chatboxMessages.appendChild(botMsg);


        const previous = document.querySelector('.new-bot-message');
          if (previous) previous.classList.remove("new-bot-message");
        botMsg.classList.add("new-bot-message");
        saveChatHistory();

        questionsBtn.disabled = true;
        langButtons.forEach(b => b.disabled = true);
        langSwitcher.classList.add("disabled");
        sendBtn.disabled = true;
        footerBtn[0].disabled = true;
        footerBtn[1].disabled = true;

        let delay = 7;
        if (selectedPrompt == "Data Protection" || selectedPrompt == "Datenschutz") {
          delay = 0.11;
        }

        typeTextHTML(botP, getBotReply(selectedPrompt), delay, () => {
          questionsBtn.disabled = false;
          langButtons.forEach(b => b.disabled = false);
          langSwitcher.classList.remove("disabled");
          sendBtn.disabled = false;
          footerBtn[0].disabled = false;
          footerBtn[1].disabled = false;
          saveChatHistory();
        });
      }, 400);
    });
  });

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
