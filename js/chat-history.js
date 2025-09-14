const chatboxMessages = document.querySelector(".chatbox-messages");
const promptsSection = document.querySelector(".quick-prompts");
const input = document.querySelector(".send-message");
const questionsBtn = document.querySelector(".chatbox-footer-btn-questions");

export function restoreChatHistory() {
  const savedHistory = localStorage.getItem("chatHistory");
  if (!savedHistory) return;

  let chatData = JSON.parse(savedHistory);

  if (
    chatData.length >= 2 &&
    chatData[chatData.length - 1].sender === "bot" &&
    chatData[chatData.length - 1].text.replace(/<[^>]*>/g, '').trim() === ""
  ) {
    chatData.splice(chatData.length - 2, 2);
  }

  chatData.forEach((msg) => {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${msg.sender}-message`;
    msgDiv.innerHTML = msg.text;
    chatboxMessages.appendChild(msgDiv);
  });

  if (chatData.length > 0) {
    promptsSection.style.display = "none";
    chatboxMessages.style.display = "flex";
    input.classList.add("shrink");
    questionsBtn.classList.add("visible");

    chatboxMessages.style.scrollBehavior = "auto";
    chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
    chatboxMessages.style.scrollBehavior = ""; 
  }
}


export function saveChatHistory() {
  const messages = document.querySelectorAll(".chatbox-messages .message");
  const chatData = [];

  messages.forEach((msg) => {
    chatData.push({
      sender: msg.classList.contains("user-message") ? "user" : "bot",
      text: msg.innerHTML
    });
  });

  localStorage.setItem("chatHistory", JSON.stringify(chatData));
}
