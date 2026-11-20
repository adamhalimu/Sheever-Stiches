(function () {
    "use strict";

   const BASE_URL =
    typeof BACKEND_URL !== "undefined"
        ? BACKEND_URL
        : (window.location.port === "5500" ? "http://localhost:5000" : "");

const API_URL = BASE_URL + "/chat";
    const WHATSAPP_URL = "https://wa.me/2347026456760";

    const GREETING =
        "Hello! I'm the Sheever Stitches assistant. " +
        "Ask me about our pieces, bespoke orders, sizing or payment.";

    const SUGGESTIONS = [
        "How does bespoke work?",
        "What sizes do you have?",
        "How can I pay?"
    ];

    const history = [];
    let busy = false;

    const root = document.createElement("div");
    root.className = "sheever-chat";

    root.innerHTML = `
        <button type="button" class="sheever-chat-toggle" aria-expanded="false" aria-controls="sheeverChatPanel">
            Chat with us
        </button>

        <section class="sheever-chat-panel" id="sheeverChatPanel" aria-label="Chat with Sheever Stitches" hidden>

            <header class="sheever-chat-header">
                <strong>Sheever Stitches</strong>
                <button type="button" class="sheever-chat-close" aria-label="Close chat">×</button>
            </header>

            <div class="sheever-chat-messages" role="log" aria-live="polite"></div>

            <div class="sheever-chat-suggestions"></div>

            <form class="sheever-chat-form">
                <input type="text" class="sheever-chat-input" placeholder="Type your question" maxlength="500" aria-label="Your message" autocomplete="off">
                <button type="submit" class="sheever-chat-send">Send</button>
            </form>

            <p class="sheever-chat-note">
                AI assistant. Please don't share payment details here.
                <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
            </p>

        </section>
    `;

    document.body.appendChild(root);

    const toggle = root.querySelector(".sheever-chat-toggle");
    const panel = root.querySelector(".sheever-chat-panel");
    const closeButton = root.querySelector(".sheever-chat-close");
    const messages = root.querySelector(".sheever-chat-messages");
    const suggestions = root.querySelector(".sheever-chat-suggestions");
    const form = root.querySelector(".sheever-chat-form");
    const input = root.querySelector(".sheever-chat-input");
    const sendButton = root.querySelector(".sheever-chat-send");


    // Shows text safely and turns web addresses into links
    function fillWithLinks(element, text) {

        const urlPattern = /(https?:\/\/[^\s]*[^\s.,!?)])/g;

        text.split(urlPattern).forEach(part => {

            if (/^https?:\/\//.test(part)) {

                const link = document.createElement("a");
                link.href = part;
                link.textContent = part;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                element.appendChild(link);

            } else if (part) {

                element.appendChild(document.createTextNode(part));

            }

        });

    }

    function addMessage(role, text) {

        const message = document.createElement("div");
        message.className = `sheever-chat-message sheever-chat-${role}`;

        fillWithLinks(message, text);

        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;

        return message;
    }

    function setBusy(state) {
        busy = state;
        input.disabled = state;
        sendButton.disabled = state;
    }

    function openChat() {
        panel.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
        toggle.hidden = true;
        input.focus();
    }

    function closeChat() {
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.hidden = false;
        toggle.focus();
    }

    async function send(text) {

        text = text.trim();

        if (!text || busy) return;

        setBusy(true);
        suggestions.hidden = true;

        addMessage("user", text);
        history.push({ role: "user", text });

        const typing = addMessage("assistant", "Typing…");
        typing.classList.add("is-typing");

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 25000);

        try {

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: history }),
                signal: controller.signal
            });

            const data = await response.json();

            typing.remove();

            const reply =
                data.reply ||
                `Sorry, something went wrong. Please message us on WhatsApp: ${WHATSAPP_URL}`;

            addMessage("assistant", reply);

            if (response.ok && !data.fallback) {
                history.push({ role: "assistant", text: reply });
            } else {
                history.pop();   // keep the history valid after a failed turn
            }

        } catch (error) {

            typing.remove();

            addMessage(
                "assistant",
                `Sorry, I can't reach our assistant right now. Please message us on WhatsApp: ${WHATSAPP_URL}`
            );

            history.pop();

        } finally {

            clearTimeout(timer);
            setBusy(false);
            input.focus();

        }

    }

    addMessage("assistant", GREETING);

    SUGGESTIONS.forEach(question => {

        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "sheever-chat-chip";
        chip.textContent = question;
        chip.addEventListener("click", () => send(question));

        suggestions.appendChild(chip);

    });

    toggle.addEventListener("click", openChat);
    closeButton.addEventListener("click", closeChat);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !panel.hidden) closeChat();
    });

    form.addEventListener("submit", event => {
        event.preventDefault();
        const text = input.value;
        input.value = "";
        send(text);
    });

})();