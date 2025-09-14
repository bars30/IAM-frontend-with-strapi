import { addMessage } from './message-renderer.js';
import { getCurrentLang } from './lang-handler.js';
import { getSelectedFiles, clearSelectedFiles, updatePreview, updateFileList } from './file-manager.js';
import { chatboxMessages, chatboxInput, questionsBtn, langButtons, langSwitcher, sendBtn, promptsSection, footerBtn } from './dom-elements.js';

export function setupChatController() {
  let chatState = "waitingUserQuestion";
  let userInfo = { name: null, email: null };
  let askedQuestions = "";
  let messageLeft = false;
  let userText = "";
  let cvUploaded = false;
  let pendingCVFile;
  let findOutMoreBtn  = document.querySelector('.chatbox-footer-btn-questions');


  sendBtn.addEventListener("click", () => {
    setTimeout(async () => {  

  console.log(pendingCVFile);
  
    const footerPrompts = document.querySelector(".quick-prompts-footer");
    footerPrompts.classList.remove("fade-in");
    footerPrompts.classList.add("fade-out");
    setTimeout(() => {
        footerPrompts.style.display = "none";
    }, 300);
    findOutMoreBtn.disabled = true;
    sendBtn.disabled = true; 

    const userInput = chatboxInput.value.trim();
    if (!userInput && getSelectedFiles().length === 0) return;
    let files = getSelectedFiles();
    console.log("🍹Selected Files", files);

    promptsSection.classList.add("fade-out");
    promptsSection.classList.add("fade-out-display-none");
    questionsBtn.classList.add("visible");

    if (userInput) {
      userText = userText ? userText + "\n" + userInput : userInput;
      console.log(userText);
      
      addMessage(userInput, "user");
    }


    if (getSelectedFiles().length > 0) {
      let filesHTML = "";

      getSelectedFiles().forEach((file) => {
        filesHTML += `
          <div class="file-preview">
            <div class="file-header">
              <img src="./img/file.svg" alt="">
              <span class="file-name">${file.name}</span>
            </div>
          </div>
        `;
      });
console.log(getSelectedFiles());

 if (pendingCVFile) {
        console.log("🍹",pendingCVFile);
        
      }


if (!userInfo.name || !userInfo.email) {
    const selectedFile = getSelectedFiles()[0];
if (selectedFile) {
  // File reader → copy ֆայլի բովանդակությունը
  const arrayBuffer = await selectedFile.arrayBuffer();
  pendingCVFile = new File([arrayBuffer], selectedFile.name, {
    type: selectedFile.type,
    lastModified: selectedFile.lastModified
  });
  console.log("✅ pendingCVFile -->", pendingCVFile);

  
}

 
}
console.log("🍹",pendingCVFile);
 

     

      addMessage(filesHTML, "user",  false, null, true);
      clearSelectedFiles();       
      updatePreview();              
      updateFileList();             
    }

    chatboxInput.value = "";
    chatboxInput.style.height = "auto";

    

    if (chatState === "waitingUserQuestion") {
      askedQuestions = userInput;
      let fullResponse = ``;
      if (getCurrentLang() == "en") {
          if (pendingCVFile) {
        // ✅ CV already attached
        fullResponse = `
          <p>Thank you for sending your <b>CV</b>!</p>
          <p>Please also share your <b>full name</b> and <b>email address</b>.</p>
          <p>One of our consultants will reach out to you shortly.</p>
        `;
      } else {
        // ⚪ No CV
        fullResponse = `
          <p>Thank you for your message!</p>
          <p>To assist you better, please share your <b>full name</b> and <b>email address</b>.</p>
          <p>You can also attach your <b>CV</b> if you want.</p>
          <p>Unfortunately, I can't answer this question directly, but one of our consultants will reach out to you shortly.</p>
        `;
      }
      } else if (getCurrentLang() == "de") {
        if (pendingCVFile) {
          fullResponse = `
            <p>Vielen Dank für das Zusenden Ihres <b>Lebenslaufs</b>!</p>
            <p>Bitte teilen Sie uns auch Ihren <b>vollständigen Namen</b> und Ihre <b>E-Mail-Adresse</b> mit.</p>
            <p>Einer unserer Berater wird sich in Kürze mit Ihnen in Verbindung setzen.</p>
          `;
          } else {
            fullResponse = `
              <p>Vielen Dank für Ihre Nachricht!</p>
              <p>Um Ihnen besser helfen zu können, teilen Sie uns bitte Ihren <b>vollständigen Namen</b> und Ihre <b>E-Mail-Adresse</b> mit.</p>
              <p>Sie können auch Ihren <b>Lebenslauf</b> anhängen, wenn Sie möchten.</p>
              <p>Leider kann ich diese Frage nicht direkt beantworten, aber einer unserer Berater wird sich in Kürze mit Ihnen in Verbindung setzen.</p>
            `;
          }
      }

      const newBotEl = addMessage(fullResponse, "bot", true, () => {
    
    

    findOutMoreBtn.disabled = false;
    sendBtn.disabled = false;
  });

 
  console.log(pendingCVFile);
  

  const element = document.querySelector('.new-bot-message');
            if (element) {
              element.classList.remove("new-bot-message");
            }

  newBotEl.classList.add("new-bot-message");
    chatboxMessages.scrollTop = chatboxMessages.scrollHeight;




  chatState = "done";
      


    } else if (chatState === "done") {
  let fullResponse = ``;
  if (!messageLeft) {
    if (getCurrentLang() == "en") {
    console.log("dddd");
    
    fullResponse = `<p>We are sending your message, please wait…</p>`;
    } else if (getCurrentLang() == "de") {
      fullResponse = `<p>Wir haben Ihre Angaben bereits erhalten. Einer unserer Berater wird sich in Kürze mit Ihnen in Verbindung setzen.</p>`;
    }
  } else {
    if (getCurrentLang() == "en") {
    console.log("dddd");
    
    fullResponse = `<p>We've already received both your <b>message</b> and your <b>CV</b>.</p>
<p>If you’d like to send a new message, please click the <b>Clear Chat</b> button first.</p>`;
    } else if (getCurrentLang() == "de") {
      fullResponse = `<p>Wir haben Ihre Angaben bereits erhalten. Einer unserer Berater wird sich in Kürze mit Ihnen in Verbindung setzen.</p>`;
    }
  }
  // if (getCurrentLang() == "en") {
  //   console.log("dddd");
    
  //   fullResponse = `<p>We are sending your message, please wait…</p>`;
  // } else if (getCurrentLang() == "de") {
  //   fullResponse = `<p>Wir haben Ihre Angaben bereits erhalten. Einer unserer Berater wird sich in Kürze mit Ihnen in Verbindung setzen.</p>`;
  // }

  // 👉 նախ ուղարկում ենք բոտի պատասխանն
  const newBotEl = addMessage(fullResponse, "bot", true, () => {
    findOutMoreBtn.disabled = false;
  });

  const element = document.querySelector('.new-bot-message');
  if (element) {
    element.classList.remove("new-bot-message");
  }
  newBotEl.classList.add("new-bot-message");
  chatboxMessages.scrollTop = chatboxMessages.scrollHeight;

  // հետո միայն ֆոնում թող emailjs աշխատի
  if (!messageLeft) {
    console.log(true);
    console.log("🔥🔹🔥🥝🔸🥝", messageLeft);
    
    
    const now = new Date();
    const sentTime = now.toLocaleString();
const infoMessage = document.querySelector('.new-bot-message');
    let cvUrl = null;
    if (pendingCVFile) {
      cvUrl = await uploadCVToCloudinary(pendingCVFile);
      console.log("☁️ Uploaded CV URL:", cvUrl);
       infoMessage.innerHTML = `<p><div><p>Sending your CV...</p></div></p>`
    }

    emailjs.send("service_3svxn5l","template_1nmov9t", {
      name: "Website Visitor",
      message: userInput,       
      asked_questions: askedQuestions, 
      title: "Chat Message",
      sent_time: sentTime,
      cv_url: cvUrl ? cvUrl : ""
    })
    .then(() => {
      console.info("📨 Message successfully sent to smithmoonft@gmail.com");
      
      console.log(infoMessage);
      console.log(infoMessage.innerHTML);
      infoMessage.innerHTML = `<p><div><p>We've already received your info. Our consultant will contact you soon.</p></div></p>`
      sendBtn.disabled = false;
      messageLeft = true;
    })
    .catch((error) => {
      console.error("❌ Email send error:", error);
    });
    // messageLeft = true;
  } else {
    console.log(false);
      console.log("🔥🔹🔥🥝🔸🥝", messageLeft);
  }
  // messageLeft = true;
  chatState = "done";
}



  }, 200)
  });
 
}
async function uploadCVToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file); // key = "files"

  try {
    const res = await fetch("http://localhost:1337/api/img-uploader", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    // վերադարձնում ենք առաջին ֆայլի URL
    console.log(data[0].url);
    
    return data[0].url; 
  } catch (err) {
    console.error("❌ Cloudinary upload error:", err);
    return null;
  }
}
