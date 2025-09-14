
export const footerBtn = document.querySelectorAll(".footer-btn-cont button");
export const langButtons = document.querySelectorAll('.lang-option');
export const langSwitcher = document.querySelector('.language-switcher');
export let firstMessage = true;

export const promptButtons = document.querySelectorAll(".quick-prompts-btn");
export  const promptsSection = document.querySelector(".quick-prompts");
export  const chatboxMessages = document.querySelector(".chatbox-messages");
export  const questionsBtn = document.querySelector(".chatbox-footer-btn-questions");
export  const input = document.querySelector(".send-message");
export const footerPromptButtons = document.querySelectorAll('.quick-prompts-footer .quick-prompts-btn');
export const footerPrompts = document.querySelector(".quick-prompts-footer");
export const textarea = document.getElementById('chatbox-input');
export let chatState = "waitingUserQuestion"; 

export const chatboxInput = document.getElementById("chatbox-input");
export const sendBtn = document.querySelector(".chatbox-send-btn");
export const clearBtns = document.querySelectorAll('.chatbox-footer-btn.clear-btn');
export const fileInput = document.getElementById("file-upload");
export const filePreviewContainer = document.getElementById("file-preview-container");

export let selectedFiles = [];

export let askedQuestions = "";
export let messageLeft = false; 
export const toggle = document.getElementById("modeToggle");
export const root = document.documentElement;
export const logoLight = document.getElementById("logo-light");
export const logoDark = document.getElementById("logo-dark");

toggle.checked = true;
