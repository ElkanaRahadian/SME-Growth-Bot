/* Navigation Functions */
function navigateToHome() {
  const homeScreen = document.getElementById("screen-home");
  const chatScreen = document.getElementById("screen-chat");

  homeScreen.classList.add("active");
  chatScreen.classList.remove("active");
  setActiveNav(0);
}

function navigateToChat(focusInput) {
  const homeScreen = document.getElementById("screen-home");
  const chatScreen = document.getElementById("screen-chat");

  homeScreen.classList.remove("active");
  chatScreen.classList.add("active");
  setActiveNav(1);

  if (focusInput) {
    setTimeout(() => {
      document.getElementById("chat-input").focus();
    }, 100);
  }
}

function setActiveNav(index) {
  const items = document.querySelectorAll(".nav-item");
  items.forEach((el, i) => {
    el.classList.toggle("active", i === index);
  });
}

/* Chat Management */
let conversationHistory = [];

function startQuickChat(message) {
  navigateToChat(true);
  conversationHistory = [];
  document.getElementById("chat-area-inner").innerHTML = `
    <div class="message msg-bot">
      <div class="message-content">Hey! I'm SME Growth Bot, your AI advisor for building and scaling your business ideas. What would you like to discuss? 🚀</div>
    </div>
    <div id="typing-indicator" class="typing-indicator">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  `;
  appendMessage("user", message);
  sendMessageToServer(message);
}

/* Chat Form Submission */
const chatForm = document.getElementById("chat-form");
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("chat-input");

  if (input.value.trim() === "") return;

  const messageText = input.value.trim();
  appendMessage("user", messageText);
  sendMessageToServer(messageText);
  input.value = "";
  input.focus();
});

/* Append Message to Chat */
function appendMessage(sender, text) {
  const chatAreaInner = document.getElementById("chat-area-inner");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender === "bot" ? "msg-bot" : "msg-user"}`;

  const messageContent = document.createElement("div");
  messageContent.className = "message-content";
  messageContent.textContent = text;

  messageDiv.appendChild(messageContent);
  chatAreaInner.appendChild(messageDiv);

  // Auto-scroll to latest message
  setTimeout(() => {
    chatAreaInner.parentElement.scrollTop =
      chatAreaInner.parentElement.scrollHeight;
  }, 0);
}

/* Show Typing Indicator */
function showTypingIndicator() {
  const typingIndicator = document.getElementById("typing-indicator");
  typingIndicator.style.display = "flex";

  const chatAreaInner = document.getElementById("chat-area-inner");
  setTimeout(() => {
    chatAreaInner.parentElement.scrollTop =
      chatAreaInner.parentElement.scrollHeight;
  }, 0);
}

/* Hide Typing Indicator */
function hideTypingIndicator() {
  const typingIndicator = document.getElementById("typing-indicator");
  typingIndicator.style.display = "none";
}

/* Send Message to Server */
async function sendMessageToServer(message) {
  console.log("🚀 Sending message to server:", message);
  showTypingIndicator();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        conversation: conversationHistory,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    hideTypingIndicator();

    if (data.reply) {
      // Add bot response to history
      conversationHistory.push({ role: "user", text: message });
      conversationHistory.push({ role: "assistant", text: data.reply });

      appendMessage("bot", data.reply);
    } else {
      appendMessage(
        "bot",
        "Sorry, I couldn't generate a response. Please try again.",
      );
    }
  } catch (error) {
    hideTypingIndicator();
    console.error("Chat error:", error);
    appendMessage(
      "bot",
      "Sorry, something went wrong. Please try again later. 😅",
    );
  }
}

/* Initialize */
document.addEventListener("DOMContentLoaded", () => {
  console.log("SME Growth Bot loaded successfully! 🚀");

  // Optional: Check server health
  fetch("/api/status")
    .then((res) => res.json())
    .then((data) => console.log("Server status:", data.status))
    .catch((err) => console.warn("Could not connect to server"));
});
