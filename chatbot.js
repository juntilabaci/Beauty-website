
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const themeToggle = document.getElementById("themeToggle");

let profile = {
  step: 0,
  mode: "chat",
  skinType: "",
  acne: "",
  sensitivity: "",
  oiliness: "",
  goal: ""
};

window.onload = () => {

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.innerText = "☀️";
  } else {
    themeToggle.innerText = "🌙";
  }

  if (chatBox.innerHTML === "") {
    bot("👋 Përshëndetje! Jam Skincare AI.\nShkruaj 'analizë' për quiz ose pyet direkt për probleme.");
  }
};

function add(text, type) {
  const msg = document.createElement("div");
  msg.classList.add("message", type);

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.innerText = text;

  msg.appendChild(bubble);
  chatBox.appendChild(msg);

  chatBox.scrollTop = chatBox.scrollHeight;
}

function bot(text) {
  add(text, "bot");
}

function user(text) {
  add(text, "user");
}

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  user(text);
  const lower = text.toLowerCase();

  userInput.value = "";

  if (lower.includes("analiz")) {
    startQuiz();
    return;
  }

  if (profile.mode === "quiz") {
    handleQuiz(lower);
    return;
  }

  bot(getResponse(lower));
}

function startQuiz() {
  profile.mode = "quiz";
  profile.step = 0;

  bot("1️⃣ Lloji i lëkurës? (yndyrshme / thatë / kombinuar / sensitive)");
}

function handleQuiz(text) {

  if (profile.step === 0) {
    profile.skinType = text;
    profile.step++;
    bot("2️⃣ Ke akne? (po / jo / pak)");
    return;
  }

  if (profile.step === 1) {
    profile.acne = text;
    profile.step++;
    bot("3️⃣ Sa sensitive është lëkura? (ulët / mesatare / shumë)");
    return;
  }

  if (profile.step === 2) {
    profile.sensitivity = text;
    profile.step++;
    bot("4️⃣ Sa e yndyrshme është? (ulët / mesatare / shumë)");
    return;
  }

  if (profile.step === 3) {
    profile.goal = text;
    profile.mode = "chat";
    generateReport();
    return;
  }
}

function generateReport() {

  let r = "🧠 RAPORT I PERSONALIZUAR\n\n";

  r += "🔬 ANALIZA:\n";

  if (profile.skinType.includes("yndyr")) r += "- Lëkurë e yndyrshme\n";
  if (profile.skinType.includes("that")) r += "- Lëkurë e thatë\n";
  if (profile.acne.includes("po")) r += "- Akne aktive\n";
  if (profile.sensitivity.includes("shum")) r += "- Lëkurë sensitive\n";

  r += "\n✨ RUTINA:\n\n";

  r += "🌞 Mëngjes:\n- Cleanser\n- Serum\n- Moisturizer\n- SPF\n\n";

  r += "🌙 Mbrëmje:\n- Cleanser\n";

  if (profile.acne.includes("po") || profile.acne.includes("pak")) {
    r += "- Salicylic Acid (2-3x/javë)\n";
  }

  r += "- Hydrating Serum\n- Night Cream\n";

  r += "\n💡 Tani mund të pyesësh për produkte specifike.";

  bot(r);
}

function getResponse(text) {

  if (text.includes("akne")) {
    return "⚠️ Akne:\n- Salicylic Acid 2-3x/javë\n- Niacinamide çdo ditë\n- Cleanser 2x/ditë";
  }

  if (text.includes("yndyr")) {
    return "🧴 Yndyrshme:\n- Gel cleanser\n- Niacinamide\n- Moisturizer oil-free";
  }

  if (text.includes("that")) {
    return "💧 Thatë:\n- Hyaluronic acid\n- Rich moisturizer\n- Gentle cleanser";
  }

  if (text.includes("spf")) {
    return "☀️ SPF:\n- 2 gishta\n- çdo mëngjes\n- riapliko çdo 2-3 orë";
  }

  if (text.includes("serum")) {
    return "💉 Serum:\n- 2-3 pika\n- në lëkurë të pastër\n- para moisturizer";
  }

  if (text.includes("retinol")) {
    return "🌙 Retinol:\n- vetëm natën\n- 2-3x në javë\n- mos e kombino me acidë";
  }

  return "💬 Pyet për: akne, yndyrë, thatësi, SPF, serum, retinol ose shkruaj 'analizë'.";
}

userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});


themeToggle.onclick = () => {

  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeToggle.innerText = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.innerText = "🌙";
  }
};