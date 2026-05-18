(function () {
  // --- CSS ---
  const style = document.createElement("style");
  style.textContent = `
    #cw-toggle {
      position: fixed;
      bottom: 120px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ec4899, #6366f1);
      color: white;
      font-size: 24px;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }
    #cw-toggle:hover { transform: scale(1.1); }

    #cw-panel {
      position: fixed;
      bottom: 186px;
      right: 24px;
      width: 340px;
      height: 480px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      z-index: 9998;
      background: linear-gradient(135deg, #38bdf8, #60a5fa, #93c5fd);
      font-family: Arial, sans-serif;
      transition: opacity 0.2s, transform 0.2s;
    }
    #cw-panel.cw-hidden {
      opacity: 0;
      pointer-events: none;
      transform: translateY(16px);
    }

    #cw-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 15px;
      color: white;
      font-weight: bold;
      background: rgba(0,0,0,0.15);
      backdrop-filter: blur(10px);
      font-size: 15px;
    }
    #cw-header button {
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
    }

    #cw-box {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    #cw-box::-webkit-scrollbar { width: 4px; }
    #cw-box::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 10px; }

    .cw-message { display: flex; width: 100%; }
    .cw-message.cw-user { justify-content: flex-end; }
    .cw-message.cw-bot  { justify-content: flex-start; }

    .cw-bubble {
      max-width: 82%;
      padding: 9px 13px;
      border-radius: 12px;
      white-space: pre-line;
      font-size: 13px;
      line-height: 1.45;
    }
    .cw-user .cw-bubble { background: #2563eb; color: white; }
    .cw-bot  .cw-bubble { background: #e5e7eb; color: #111; }

    #cw-footer {
      display: flex;
      border-top: 1px solid rgba(255,255,255,0.2);
      background: rgba(0,0,0,0.15);
      backdrop-filter: blur(10px);
    }
    #cw-input {
      flex: 1;
      padding: 11px;
      border: none;
      outline: none;
      font-size: 13px;
      background: transparent;
      color: white;
    }
    #cw-input::placeholder { color: rgba(255,255,255,0.7); }
    #cw-send {
      padding: 11px 15px;
      border: none;
      background: #ec4899;
      color: white;
      cursor: pointer;
      font-size: 15px;
    }

    #cw-panel.cw-dark {
      background: linear-gradient(135deg, #0f172a, #1e293b, #0f172a);
    }
    #cw-panel.cw-dark .cw-bot .cw-bubble { background: #334155; color: white; }

    @media (max-width: 400px) {
      #cw-panel { width: calc(100vw - 20px); right: 10px; }
    }
  `;
  document.head.appendChild(style);

  // --- HTML ---
  const toggle = document.createElement("button");
  toggle.id = "cw-toggle";
  toggle.title = "Skincare AI";
  toggle.innerHTML = "🤖";

  const panel = document.createElement("div");
  panel.id = "cw-panel";
  panel.classList.add("cw-hidden");
  panel.innerHTML = `
    <div id="cw-header">
      <span>🤖 Skincare AI</span>
      <div style="display:flex;gap:8px">
        <button id="cw-theme">🌙</button>
        <button id="cw-close">✕</button>
      </div>
    </div>
    <div id="cw-box"></div>
    <div id="cw-footer">
      <input id="cw-input" type="text" placeholder="Shkruaj...">
      <button id="cw-send">➤</button>
    </div>
  `;

  document.body.appendChild(panel);
  document.body.appendChild(toggle);

  // --- Logic ---
  const box    = panel.querySelector("#cw-box");
  const input  = panel.querySelector("#cw-input");
  const send   = panel.querySelector("#cw-send");
  const close  = panel.querySelector("#cw-close");
  const theme  = panel.querySelector("#cw-theme");

  let opened = false;
  let profile = { step: 0, mode: "chat", skinType: "", acne: "", sensitivity: "" };

  function addMsg(text, type) {
    const msg = document.createElement("div");
    msg.classList.add("cw-message", "cw-" + type);
    const bubble = document.createElement("div");
    bubble.classList.add("cw-bubble");
    bubble.innerText = text;
    msg.appendChild(bubble);
    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
  }

  function bot(text) { addMsg(text, "bot"); }
  function usr(text) { addMsg(text, "user"); }

  function getResponse(t) {
    if (t.includes("akne"))   return "⚠️ Akne:\n- Salicylic Acid 2-3x/javë\n- Niacinamide çdo ditë\n- Cleanser 2x/ditë";
    if (t.includes("yndyr"))  return "🧴 Yndyrshme:\n- Gel cleanser\n- Niacinamide\n- Moisturizer oil-free";
    if (t.includes("that"))   return "💧 Thatë:\n- Hyaluronic acid\n- Rich moisturizer\n- Gentle cleanser";
    if (t.includes("spf"))    return "☀️ SPF:\n- 2 gishta\n- çdo mëngjes\n- riapliko çdo 2-3 orë";
    if (t.includes("serum"))  return "💉 Serum:\n- 2-3 pika\n- në lëkurë të pastër\n- para moisturizer";
    if (t.includes("retinol"))return "🌙 Retinol:\n- vetëm natën\n- 2-3x në javë\n- mos e kombino me acidë";
    if (t.includes("sensitive")) return "🌸 Sensitive:\n- Produkte pa parfum\n- Centella Asiatica\n- Patch test gjithmonë";
    return "💬 Pyet për: akne, yndyrë, thatësi, SPF, serum, retinol ose shkruaj 'analizë'.";
  }

  function handleQuiz(t) {
    if (profile.step === 0) {
      profile.skinType = t; profile.step++;
      bot("2️⃣ Ke akne? (po / jo / pak)"); return;
    }
    if (profile.step === 1) {
      profile.acne = t; profile.step++;
      bot("3️⃣ Sa sensitive është lëkura? (ulët / mesatare / shumë)"); return;
    }
    if (profile.step === 2) {
      profile.sensitivity = t; profile.mode = "chat";
      let r = "🧠 RAPORT I PERSONALIZUAR\n\n🔬 ANALIZA:\n";
      if (profile.skinType.includes("yndyr")) r += "- Lëkurë e yndyrshme\n";
      if (profile.skinType.includes("that"))  r += "- Lëkurë e thatë\n";
      if (profile.skinType.includes("kombin")) r += "- Lëkurë e kombinuar\n";
      if (profile.acne.includes("po"))        r += "- Akne aktive\n";
      if (profile.sensitivity.includes("shum")) r += "- Lëkurë shumë sensitive\n";
      r += "\n✨ RUTINA:\n\n🌞 Mëngjes:\n- Cleanser\n- Serum\n- Moisturizer\n- SPF\n\n";
      r += "🌙 Mbrëmje:\n- Cleanser\n";
      if (profile.acne.includes("po") || profile.acne.includes("pak")) r += "- Salicylic Acid (2-3x/javë)\n";
      r += "- Hydrating Serum\n- Night Cream\n\n💡 Tani mund të pyesësh për produkte specifike.";
      bot(r); return;
    }
  }

  function onSend() {
    const text = input.value.trim();
    if (!text) return;
    usr(text);
    input.value = "";
    const lower = text.toLowerCase();
    if (lower.includes("analiz")) {
      profile = { step: 0, mode: "quiz", skinType: "", acne: "", sensitivity: "" };
      bot("1️⃣ Lloji i lëkurës? (yndyrshme / thatë / kombinuar / sensitive)");
      return;
    }
    if (profile.mode === "quiz") { handleQuiz(lower); return; }
    bot(getResponse(lower));
  }

  send.addEventListener("click", onSend);
  input.addEventListener("keypress", e => { if (e.key === "Enter") onSend(); });

  toggle.addEventListener("click", () => {
    opened = !opened;
    panel.classList.toggle("cw-hidden", !opened);
    toggle.innerHTML = opened ? "✕" : "💖";
    if (opened && box.children.length === 0) {
      bot("👋 Përshëndetje! Jam Skincare AI.\nShkruaj 'analizë' për quiz ose pyet direkt për lëkurën.");
    }
  });

  close.addEventListener("click", () => {
    opened = false;
    panel.classList.add("cw-hidden");
    toggle.innerHTML = "🤖";
  });

  theme.addEventListener("click", () => {
    panel.classList.toggle("cw-dark");
    theme.innerText = panel.classList.contains("cw-dark") ? "☀️" : "🌙";
  });
})();
