import { saveChatHistory } from './chat-history.js';

function typeText(container, text, delay = 7, callback) {
  let i = 0;
  container.textContent = '';
  const interval = setInterval(() => {
    container.textContent += text.charAt(i);
    i++;

    if (i >= text.length) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, delay);
}

function typeTextHTML(container, html, delay = 7, callback) {
  container.innerHTML = ''; 

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_ALL, null, false);
  const nodes = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
      nodes.push(node);
    }
  }

  let flatText = '';
  const nodeMap = [];

  for (const node of nodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      for (let i = 0; i < text.length; i++) {
        flatText += text[i];
        nodeMap.push({ node, index: i });
      }
    }
  }

  const startTime = Date.now();
  const totalChars = flatText.length;

  let lastCount = 0;

  const liveContainer = tempDiv.cloneNode(false);
  container.appendChild(liveContainer);

  function deepCloneUntilNodeIndex(original, limitNode, limitIndex) {
    if (original.nodeType === Node.TEXT_NODE) {
      const cloned = document.createTextNode('');
      if (original === limitNode) {
        cloned.textContent = original.textContent.slice(0, limitIndex + 1);
      } else {
        cloned.textContent = original.textContent;
      }
      return cloned;
    }

    if (original.nodeType === Node.ELEMENT_NODE) {
      const cloned = original.cloneNode(false);
      for (let child of original.childNodes) {
        if (
          child.contains(limitNode) ||
          child === limitNode
        ) {
          cloned.appendChild(deepCloneUntilNodeIndex(child, limitNode, limitIndex));
          break;
        } else {
          cloned.appendChild(child.cloneNode(true));
        }
      }
      return cloned;
    }

    return null;
  }

  function update() {
    const elapsed = Date.now() - startTime;
    const expectedCount = Math.min(Math.floor(elapsed / delay), totalChars);

    if (expectedCount > lastCount) {
      const { node: limitNode, index: limitIndex } = nodeMap[expectedCount - 1];
      container.innerHTML = ''; // reset
      const newDOM = deepCloneUntilNodeIndex(tempDiv, limitNode, limitIndex);
      container.appendChild(newDOM);
      lastCount = expectedCount;
    }

    if (lastCount < totalChars) {
      requestAnimationFrame(update);
    } else {
      if (callback) callback();
    }
  }

  update();
}



function addMessage(text, sender = "bot", animated = false, callback, file = false) {
  const chatboxMessages = document.querySelector(".chatbox-messages");
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}-message`;
 
  if (file) {
    msgDiv.innerHTML = text;
    chatboxMessages.appendChild(msgDiv);

    saveChatHistory();
    return msgDiv; 
  }

  const p = document.createElement("p");
  msgDiv.appendChild(p);
  chatboxMessages.appendChild(msgDiv);

  const isSimpleText = !/<[^>]+>/.test(text);
 
  if (animated && !isSimpleText) {
    typeTextHTML(p, text, 5, () => {
      if (callback) callback();
    });
  } else {
    p.innerHTML = text;
    if (callback) callback();
  }

  saveChatHistory();
  return msgDiv;
}

export {
  addMessage,
  typeText,
  typeTextHTML
};
