let currentLang = localStorage.getItem("lang") || "en";
let botReplies = { en: {}, de: {} };
let promptTranslations = {};
let reversePromptTranslations = {};
import { setupPromptButtons } from "./prompt-buttons.js";

// Lang setters
function setCurrentLang(lang) {
  currentLang = lang;
}

function getCurrentLang() {
  return currentLang;
}

async function loadPrompts() {
  try {
    const res = await fetch("http://localhost:1337/api/bot-replies?fields=title_en,title_de,isFooterButton");
    const data = await res.json();

    if (!data?.data) return;

    const mainContainer = document.querySelector("#quick-prompts-top");
    const footerContainer = document.querySelector(".quick-prompts-footer .quick-prompts-cont");
const footerBtnCont = document.querySelector(".footer-btn-cont");
    mainContainer.innerHTML = "";   // մաքրում ենք նախնական buttons
    footerContainer.innerHTML = "";

  data.data.forEach(item => {
    console.log("😶‍🌫️😶‍🌫️", item);
    console.log(!item.isFooterButton);
    
    if (!item.isFooterButton) {
      console.log("yag");
      const btnMain = document.createElement("div");
      btnMain.className = "quick-prompts-btn";
      btnMain.textContent = item.title_en;
      btnMain.dataset.prompt = item.title_en;
      mainContainer.appendChild(btnMain);
    

      const btnFooter = document.createElement("div");
      btnFooter.className = "quick-prompts-btn";
      btnFooter.textContent = item.title_en;
      btnFooter.dataset.prompt = item.title_en;
      footerContainer.appendChild(btnFooter);
    } else {
        const footerContBtn= document.createElement("button");
            footerContBtn.className = "footer-btn quick-prompts-btn";
            footerContBtn.textContent = item.title_en;
            footerBtnCont.appendChild(footerContBtn);
    }
    
  
});
  const jobsLink = document.createElement("a");
    jobsLink.href = "/jobs";              // կամ քո ուզած url-ը
    jobsLink.className = "quick-prompts-btn";
    jobsLink.textContent = "Jobs";
    mainContainer.appendChild(jobsLink);
    console.log(mainContainer, "🍺🍺🍺🍺🍺🍺");

      const jobs2Link = document.createElement("a");
    jobs2Link.href = "/jobs";              // կամ քո ուզած url-ը
    jobs2Link.className = "quick-prompts-btn";
    jobs2Link.textContent = "Jobs";
    footerContainer.appendChild(jobs2Link);
    console.log(footerContainer, "🍺🍺🍺🍺🍺🍺");
// ✅ վերջում ավելացնում ենք "Jobs" a tag
    
    
    // --- Հիմա սրանից հետո պետք է կրկին գրենք event listener-ները prompt-buttons-ներին
    setupPromptButtons(
      document.querySelector(".language-switcher"),
      document.querySelectorAll(".chatbox-footer-btn.clear-btn")
    );

  } catch (err) {
    console.error("Error loading prompts:", err);
  }
}

// Fetch bot replies from Strapi
// Fetch bot replies from Strapi
async function loadBotReplies() {
  try {
    const res = await fetch("http://localhost:1337/api/bot-replies?populate=*");
    const json = await res.json();
    console.log(json, "🍺?populate=*");

    const res2 = await fetch("http://localhost:1337/api/bot-replies?filters[team_member][$notNull]=true&populate=team_member.img");
    const json2 = await res2.json();
    console.log(json2, "🍺?filters[team_member][$notNull]=true&populate=team_member.img");

    if (!json?.data) return;

    // ---- Մերժում (merge) երկու արդյունքները ըստ documentId ----
const teamMap = {};
json2.data.forEach(item => {
  teamMap[item.documentId] = item.team_member; // team_member with images
});

const mergedData = json.data.map(item => {
  if (teamMap[item.documentId]) {
    return {
      ...item,
      team_member: teamMap[item.documentId] // փոխարինում ենք team_member-ը լիարժեք տարբերակով
    };
  }
  return item;
});

console.log(mergedData, "🍺 mergedData");


    // Սկսենք դատարկ օբյեկտներով
    promptTranslations = {};
    reversePromptTranslations = {};

    mergedData.forEach(item => {
      const titleEn = item.title_en;
      const titleDe = item.title_de;

      // --- Bot replies լցնել ---
      if (titleEn && item.content_us) {
        botReplies.en[titleEn] = convertBlocksToHtml(item.content_us, item.image);
      }
      if (titleDe && item.content_de) {
        botReplies.de[titleDe] = convertBlocksToHtml(item.content_de, item.image);
      }

      // Team members (same as before)
      if (item.team_member?.length) {
        let enHtml = "";
        let deHtml = "";

        for (let i = 0; i < item.team_member.length; i++) {
          const member = item.team_member[i];
          const isLast = i === item.team_member.length - 1;

          if (member.content_en) {
            enHtml += convertBlocksToHtml(member.content_en, member.img, true);
            if (!isLast && member.img?.url) enHtml += '<hr class="team-item-divider">';
          }
          if (member.content_de) {
            deHtml += convertBlocksToHtml(member.content_de, member.img, true);
            if (!isLast && member.img?.url) deHtml += '<hr class="team-item-divider">';
          }
        }

        if (titleEn) botReplies.en[titleEn] = enHtml;
        if (titleDe) botReplies.de[titleDe] = deHtml;
      }

      // --- Այստեղ արդեն լցնում ենք թարգմանությունների mapping ---
      if (titleEn && titleDe) {
        promptTranslations[titleEn] = titleDe;
        reversePromptTranslations[titleDe] = titleEn;
      }
    });

    console.log("Prompt translations:", promptTranslations);
    console.log("Reverse translations:", reversePromptTranslations);

  } catch (err) {
    console.error("Error loading bot replies from Strapi:", err);
  }
}
// Convert Strapi content blocks (including links) to HTML
// isTeamMemberImage -> եթե true, օգտագործենք team-member-img class
function convertBlocksToHtml(blocks, image, isTeamMemberImage = false) {
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
    const imgClass = isTeamMemberImage ? "team-member-img" : "section-img";
    html += `
      <img src="${image.url}" class="${imgClass}" alt="${image.alternativeText || ""}">
      <div class="space"></div>
    `;
  }

  return html;
}




// UI text updater (մնում է import uiTexts-երից)
let uiTexts = { en: null, de: null };

async function loadUITexts(locale) {
  try {
    const res = await fetch(`http://localhost:1337/api/ui?locale=${locale}`);
    const json = await res.json();

    if (!json) return;

    const data = json.data || json; // երբեմն Strapi վերադարձնում է json.data, երբեմն ուղղակի json
    uiTexts[locale] = {
      siteTitle: data.siteTitle,
      siteSubtitle: data.siteSubtitle,
      greetingHeader: `${data.greeting_header_part1} <span>${data.greeting_header_highlight}</span> ${data.greeting_header_part2}`,
      greetingSub: data.greetingSub,
      placeholder: data.placeholder,
      buttons: {
        clear: data.clear_button,
        classic: data.classic_button,
        questions: data.questions_button
      },
      footer: {
        copyright: data.copyright,
        imprint: "Imprint",   // 👉 եթե ուզում ես էլի պահել Strapi-ում, ավելացրու դաշտեր
        privacy: "Data Protection"
      }
    };

    console.log(`Loaded UI texts for ${locale}:`, uiTexts[locale]);
  } catch (err) {
    console.error(`Error loading UI texts for ${locale}:`, err);
  }
}

function updateUIText() {
  const texts = currentLang === "de" ? uiTexts.de : uiTexts.en;
  if (!texts) {
    console.warn("UI texts not loaded yet for", currentLang);
    return;
  }

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

  // 👇 մնացած մասը նույնն է, կապված menuButtons-ի թարգմանությունների հետ
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
(async () => {
  await loadBotReplies();
  await Promise.all([loadUITexts("en"), loadUITexts("de")]);
  loadPrompts();
  updateUIText();
})();

export {
  updateUIText,
  getBotReply,
  getCurrentLang,
  setCurrentLang,
  promptTranslations,
  reversePromptTranslations,
  loadBotReplies
};
