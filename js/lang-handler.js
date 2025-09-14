let currentLang = localStorage.getItem("lang") || "en";
let botReplies = { en: {}, de: {} };

// Lang setters
function setCurrentLang(lang) {
  currentLang = lang;
}

function getCurrentLang() {
  return currentLang;
}

// Fetch bot replies from Strapi
// Fetch bot replies from Strapi
async function loadBotReplies() {
  try {
    const res = await fetch("http://localhost:1337/api/bot-replies?populate=team_member.img");
    const json = await res.json();
    console.log(json);

    if (!json?.data) return;

    json.data.forEach(item => {
      const titleEn = item.title_en;
      const titleDe = item.title_de;

      // Եթե սովորական բովանդակություն ունի
      if (titleEn && item.content_us) {
        botReplies.en[titleEn] = convertBlocksToHtml(item.content_us, item.image);
      }
      if (titleDe && item.content_de) {
        botReplies.de[titleDe] = convertBlocksToHtml(item.content_de, item.image);
      }

      // Եթե չունի content_us/content_de, բայց ունի team_member
      if (item.team_member?.length) {
        let enHtml = "";
        let deHtml = "";

        item.team_member.forEach(member => {
          // Վերցնենք member.img-ը որպես image
          if (member.content_en) {
            enHtml += convertBlocksToHtml(member.content_en, member.img);
          }
          if (member.content_de) {
            deHtml += convertBlocksToHtml(member.content_de, member.img);
          }
        });

        if (titleEn) botReplies.en[titleEn] = enHtml;
        if (titleDe) botReplies.de[titleDe] = deHtml;
      }
    });
  } catch (err) {
    console.error("Error loading bot replies from Strapi:", err);
  }
}

// Convert Strapi content blocks (including links) to HTML
function convertBlocksToHtml(blocks, image) {
  let html = "";

  blocks.forEach(block => {
    if (block.type === "paragraph") {
      html += "<p>";
      block.children.forEach(child => {
        if (child.type === "link") {
          const linkText = child.children.map(ch => ch.text).join("");
          html += `<a href="${child.url}" target="_blank">${linkText}</a>`;
        } else {
          html += child.bold ? `<b>${child.text}</b>` : child.text;
        }
      });
      html += "</p>";
    }

    if (block.type === "heading") {
      const level = block.level || 2;
      const headingText = block.children.map(ch => ch.text).join("");
      html += `<h${level}>${headingText}</h${level}>`;
    }

    if (block.type === "list" && block.children) {
      html += "<ul>";
      block.children.forEach(listItem => {
        html += "<li>";
        listItem.children.forEach(child => {
          if (child.type === "link") {
            const linkText = child.children.map(ch => ch.text).join("");
            html += `<a href="${child.url}" target="_blank">${linkText}</a>`;
          } else {
            html += child.bold ? `<b>${child.text}</b>` : child.text;
          }
        });
        html += "</li>";
      });
      html += "</ul>";
    }
  });

  if (image?.url) {
    html += `
      <img src="${image.url}" class="section-img" alt="${image.alternativeText || ""}">
      <div class="space"></div>
    `;
  }

  return html;
}



// Static translations stay as they are
const promptTranslations = {
  "Why Companies Choose Us": "Warum Unternehmen uns wählen",
  "Services for Clients": "Dienstleistungen für Kunden",
  "Hiring Process": "Einstellungsprozess",
  "Technological Expertise & Roles": "Technologisches Fachwissen",
  "IAM Talent Network": "IAM Talent-Netzwerk",
  "Story & Purpose": "Geschichte & Zweck",
  "Team": "Team",
  "For IAM Professionals": "Für IAM-Profis",
  "Contact": "Kontakt",
  "Career Consultation": "Karriereberatung",
  "Send Us Your CV": "Senden Sie uns Ihren Lebenslauf"
};

const reversePromptTranslations = Object.fromEntries(
  Object.entries(promptTranslations).map(([en, de]) => [de, en])
);

// UI text updater (մնում է import uiTexts-երից)
import { uiTexts as enTexts } from "../lang/ui-texts.en.js";
import { uiTexts as deTexts } from "../lang/ui-texts.de.js";

function updateUIText() {
  const texts = currentLang === "de" ? deTexts : enTexts;

  document.title = texts.siteTitle;
  document.querySelector(".logo-header-title").textContent = texts.siteTitle;
  document.querySelector(".logo-header-subtitle").textContent = texts.siteSubtitle;
  document.querySelector(".quick-prompts-header").innerHTML = texts.greetingHeader;
  document.querySelector(".quick-prompts-subtitle").textContent = texts.greetingSub;
  document.querySelector("#chatbox-input").placeholder = texts.placeholder;

  document.querySelectorAll(".clear-btn").forEach(btn => {
    btn.textContent = texts.buttons.clear;
  });

  document.querySelector(".chatbox-footer-btn-questions").textContent = texts.buttons.questions;
  document.querySelector("footer p").textContent = texts.footer.copyright;

  const footerBtns = document.querySelectorAll(".footer-btn-cont button");
  if (footerBtns.length >= 2) {
    footerBtns[0].textContent = texts.footer.imprint;
    footerBtns[1].textContent = texts.footer.privacy;
  }

  const menuButtons = document.querySelectorAll(".quick-prompts-btn");
  menuButtons.forEach((btn) => {
    const currentText = btn.textContent.trim();

    const prompt =
      currentLang === "de"
        ? Object.keys(promptTranslations).find(key => promptTranslations[key] === currentText) || currentText
        : reversePromptTranslations[currentText] || currentText;

    btn.dataset.prompt = prompt;

    if (currentLang === "de" && promptTranslations[prompt]) {
      btn.textContent = promptTranslations[prompt];
    }

    if (currentLang === "en") {
      btn.textContent = prompt;
    }
  });
}

// Get bot reply (from dynamic Strapi data)
function getBotReply(prompt) {
  const lang = currentLang === "de" ? "de" : "en";
  return botReplies[lang][prompt] || "<p>Reply not found.</p>";
}
loadBotReplies();
export {
  updateUIText,
  getBotReply,
  getCurrentLang,
  setCurrentLang,
  promptTranslations,
  reversePromptTranslations,
  loadBotReplies
};
