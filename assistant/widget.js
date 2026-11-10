(() => {
  if (window.__TERCEIRIZA_DP_ASSISTANT__) return;
  window.__TERCEIRIZA_DP_ASSISTANT__ = true;

  const script = document.currentScript;
  const apiBase = (script?.dataset.apiBase || "").replace(/\/$/, "");
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = new URL("./widget.css", script?.src || window.location.href).href;
  document.head.appendChild(stylesheet);

  const root = document.createElement("div");
  root.id = "tdp-assistant-root";
  root.innerHTML = `
    <button class="tdp-launcher" type="button" aria-label="Abrir assistente virtual" aria-expanded="false">
      <span class="tdp-launcher-icon" aria-hidden="true">✦</span>
      <span class="tdp-launcher-label">Fale com nosso assistente</span>
    </button>
    <section class="tdp-panel" aria-label="Assistente virtual" hidden>
      <header class="tdp-header">
        <div class="tdp-avatar" aria-hidden="true">DP</div>
        <div class="tdp-heading">
          <strong>Assistente Terceiriza DP</strong>
          <span><i></i> Atendimento virtual</span>
        </div>
        <button class="tdp-close" type="button" aria-label="Fechar atendimento">×</button>
      </header>
      <div class="tdp-profile">
        <label for="tdp-audience">Como podemos direcionar seu atendimento?</label>
        <select id="tdp-audience">
          <option value="visitor">Sou empresário ou visitante</option>
          <option value="employee">Sou funcionário de uma empresa cliente</option>
        </select>
      </div>
      <div class="tdp-messages" aria-live="polite">
        <div class="tdp-message tdp-bot">Olá! Sou o assistente virtual da Terceiriza DP. Posso explicar nossos serviços e ajudar com dúvidas gerais de Departamento Pessoal. Como posso ajudar?</div>
      </div>
      <form class="tdp-form">
        <textarea rows="1" maxlength="3000" placeholder="Digite sua mensagem..." aria-label="Digite sua mensagem" required></textarea>
        <button type="submit" aria-label="Enviar mensagem">➤</button>
      </form>
      <p class="tdp-disclaimer">Não envie CPF, senhas, documentos ou dados pessoais sensíveis.</p>
    </section>
  `;
  document.body.appendChild(root);

  const launcher = root.querySelector(".tdp-launcher");
  const panel = root.querySelector(".tdp-panel");
  const close = root.querySelector(".tdp-close");
  const form = root.querySelector(".tdp-form");
  const textarea = root.querySelector("textarea");
  const messagesEl = root.querySelector(".tdp-messages");
  const audienceEl = root.querySelector("#tdp-audience");
  const sendButton = form.querySelector("button");
  const history = [];

  function toggle(open) {
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    launcher.querySelector(".tdp-launcher-label").textContent = open ? "Fechar atendimento" : "Fale com nosso assistente";
    if (open) textarea.focus();
  }

  function addMessage(text, role) {
    const message = document.createElement("div");
    message.className = `tdp-message ${role === "user" ? "tdp-user" : "tdp-bot"}`;
    message.textContent = text;
    messagesEl.appendChild(message);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return message;
  }

  function setBusy(busy) {
    sendButton.disabled = busy;
    textarea.disabled = busy;
    sendButton.textContent = busy ? "…" : "➤";
  }

  launcher.addEventListener("click", () => toggle(panel.hidden));
  close.addEventListener("click", () => toggle(false));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const content = textarea.value.trim();
    if (!content) return;

    if (!apiBase) {
      addMessage("O atendimento virtual está em fase de configuração. Por enquanto, fale com a equipe pelo WhatsApp (11) 97015-2735.", "assistant");
      return;
    }

    textarea.value = "";
    addMessage(content, "user");
    history.push({ role: "user", content });
    setBusy(true);
    const pending = addMessage("Estou preparando uma resposta...", "assistant");

    try {
      const response = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience: audienceEl.value,
          messages: history.slice(-12)
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível responder agora.");
      pending.textContent = data.reply;
      history.push({ role: "assistant", content: data.reply });
      if (history.length > 12) history.splice(0, history.length - 12);
    } catch (error) {
      pending.textContent = error.message || "Ocorreu um erro. Tente novamente.";
      history.pop();
    } finally {
      setBusy(false);
      textarea.focus();
    }
  });
})();