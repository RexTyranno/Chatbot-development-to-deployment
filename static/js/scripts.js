document.addEventListener("DOMContentLoaded", () => {
  const sendButton = document.getElementById("send-button");
  const userInput = document.getElementById("user-input");
  const chatMain = document.getElementById("chat-main");
  const loader = document.getElementById("loader");

  let chatHistory = [];

  const savedHistory = localStorage.getItem("chatHistory");
  if (savedHistory) {
    JSON.parse(savedHistory);
    chatHistory.forEach((message) => {
      appendMessage(message.role, message.content);
    });
  }

  function appendMessage(sender, message) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);

    const messageContent = document.createElement("p");
    messageContent.textContent = message;

    messageDiv.appendChild(messageContent);
    chatMain.appendChild(messageDiv);

    chatMain.scrollTop = chatMain.scrollHeight;
  }

  function showLoader() {
    loader.style.display = "block";
  }

  function hideLoader() {
    loader.style.display = "none";
  }

  async function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;

    appendMessage("user", message);

    chatHistory.push({ role: "user", content: message });

    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

    userInput.value = "";

    showLoader();

    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: message,
          history: chatHistory,
        }),
      });

      const data = await response.json();

      hideLoader();

      if (response.ok) {
        const reply = data.reply;
        appendMessage("assistant", reply);

        chatHistory.push({ role: "assistant", content: reply });

        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
      } else {
        const errorMsg = data.error || "An unknown error occurred.";
        appendMessage("assistant", "Error: ${errorMsg}");
      }
    } catch (error) {
      hideLoader();

      appendMessage("assistant", "An error occurred: ${error.message}");
      console.error("Error", error);
    }
  }

  sendButton.addEventListener("click", sendMessage);

  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
});
