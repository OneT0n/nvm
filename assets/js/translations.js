const russianTranslations = {
  click_to_continue: "Нажми для продолжения",
  status_text: "Онлайн",
  about_me: "Обо мне",
  name: "Ник:",
  name_value: "unkly",
  sex: "Пол:",
  sex_value: "Парень",
  hobbies: "Возраст:",
  hobbies_value: "15 лет",
  languages: "Языки",
  skills: "Увлечения",
  favorite_artists: "Контакты",
  felon_promo: "Лучшие текстур паки для Minecraft",
  artarious_promo: "Мое портфолио и проекты",
  aeza_promo: "Ghost client для Minecraft",
  play_pause: "Воспроизвести/Пауза",
  prev_track: "Предыдущий трек",
  next_track: "Следующий трек"
};

const englishTranslations = {
  click_to_continue: "Click to continue",
  status_text: "Online",
  about_me: "About me",
  name: "Nick:",
  name_value: "unkly",
  sex: "Gender:",
  sex_value: "Male",
  hobbies: "Age:",
  hobbies_value: "15 years",
  languages: "Languages",
  skills: "Hobbies",
  favorite_artists: "Contacts",
  felon_promo: "Best texture packs for Minecraft",
  artarious_promo: "My portfolio and projects",
  aeza_promo: "Ghost client for Minecraft",
  play_pause: "Play/Pause",
  prev_track: "Previous track",
  next_track: "Next track"
};

const allTranslations = {
  ru: russianTranslations,
  en: englishTranslations
};

const artistLinks = {
  jei: "https://www.curseforge.com/minecraft/mc-mods/jei",
  optifine: "https://www.curseforge.com/minecraft/mc-mods/optifine",
  waystones: "https://www.curseforge.com/minecraft/mc-mods/waystones",
  appleskin: "https://www.curseforge.com/minecraft/mc-mods/appleskin",
  ironchests: "https://www.curseforge.com/minecraft/mc-mods/iron-chests"
};

function changeLanguage(langCode) {
  const translations = allTranslations[langCode] || allTranslations.ru;

  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[key]) {
      element.textContent = translations[key];
    }
  });

  document.querySelectorAll('[data-translate-title]').forEach(element => {
    const key = element.getAttribute('data-translate-title');
    if (translations[key]) {
      element.setAttribute('title', translations[key]);
    }
  });

  document.querySelectorAll('.language-item[data-lang]').forEach(button => {
    button.classList.toggle('active', button.getAttribute('data-lang') === langCode);
  });

  localStorage.setItem('selectedLanguage', langCode);

  document.documentElement.lang = langCode;
}

function openArtistPage(artistName) {
  const url = artistLinks[artistName];
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

function initTranslations() {
  const selectedLanguage = localStorage.getItem('selectedLanguage') || 'ru';
  changeLanguage(selectedLanguage);
}

window.changeLanguage = changeLanguage;
window.openArtistPage = openArtistPage;
window.initTranslations = initTranslations;