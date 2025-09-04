document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.createElement("div");
  toggle.id = "chatbot-toggle";
  toggle.innerText = "💬";
  document.body.appendChild(toggle);

  const box = document.createElement("div");
  box.id = "chatbot-box";
  box.innerHTML = `
    <div id="chatbot-messages"></div>
    <div id="chatbot-input">
      <input type="text" id="chatbot-text" placeholder="Type a message..." />
      <button id="chatbot-send">Send</button>
    </div>
  `;
  document.body.appendChild(box);

  toggle.addEventListener("click", () => {
    box.style.display = box.style.display === "none" ? "flex" : "none";
  });

  document.getElementById("chatbot-send").addEventListener("click", sendMessage);
  document.getElementById("chatbot-text").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  async function sendMessage() {
    const input = document.getElementById("chatbot-text");
    const message = input.value.trim();
    if (!message) return;

    appendMessage("You", message);
    input.value = "";

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      appendMessage("Bot", data.reply);
    } catch (err) {
      appendMessage("Bot", "⚠️ Error connecting to server.");
    }
  }

  function appendMessage(sender, message) {
    const msgBox = document.getElementById("chatbot-messages");
    const div = document.createElement("div");
    div.innerHTML = `<b>${sender}:</b> ${message}`;
    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
  }
});
