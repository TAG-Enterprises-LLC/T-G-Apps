// Translates the play_tag_*.html page chrome (back link, tab title, frame label) into
// the language the T-G-Apps web games use: the saved choice from the homepage Language
// button or the in-game language button (shared_preferences key
// 'flutter.tg.locale.user_override'), else the browser language, as the apps do.
(function () {
  'use strict';

  const languageKey = 'flutter.tg.locale.user_override';
  const strings = {
    en: { lang: 'en', back: 'Back to T-G-Apps Games', play: 'Play {0}', frame: '{0} playable web app' },
    es: { lang: 'es', back: 'Volver a los juegos de T-G-Apps', play: 'Jugar a {0}', frame: '{0}: app web jugable' },
    fr: { lang: 'fr', back: 'Retour aux jeux T-G-Apps', play: 'Jouer à {0}', frame: '{0} : appli web jouable' },
    de: { lang: 'de', back: 'Zurück zu den T-G-Apps-Spielen', play: '{0} spielen', frame: '{0}: spielbare Web-App' },
    pt_BR: { lang: 'pt-BR', back: 'Voltar aos jogos da T-G-Apps', play: 'Jogar {0}', frame: '{0}: app web jogável' },
    ja: { lang: 'ja', back: 'T-G-Apps のゲームに戻る', play: '{0} をプレイ', frame: '{0}（ブラウザでプレイできるアプリ）' },
    hi: { lang: 'hi', back: 'T-G-Apps गेम पर वापस जाएँ', play: '{0} खेलें', frame: '{0} — खेलने योग्य वेब ऐप' },
    id: { lang: 'id', back: 'Kembali ke Game T-G-Apps', play: 'Main {0}', frame: '{0}: aplikasi web yang bisa dimainkan' },
    vi: { lang: 'vi', back: 'Quay lại trò chơi T-G-Apps', play: 'Chơi {0}', frame: '{0}: ứng dụng web chơi được' }
  };

  function languageCode() {
    let code = null;
    try { code = JSON.parse(localStorage.getItem(languageKey) || 'null'); } catch (_) {}
    if (code === 'pt' || code === 'pt-BR') code = 'pt_BR';
    if (strings[code]) return code;
    const browserLanguages = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    for (const tag of browserLanguages) {
      const base = String(tag).toLowerCase().split(/[-_]/)[0];
      const match = Object.keys(strings).find(function (key) { return key.split('_')[0] === base; });
      if (match) return match;
    }
    return 'en';
  }

  // The game name, e.g. "T-G-Apps Hearts", comes from the iframe title.
  const frame = document.querySelector('iframe');
  const gameName = frame ? frame.title : 'T-G-Apps';
  const frameSection = document.querySelector('[aria-label]');

  function apply() {
    const text = strings[languageCode()];
    document.documentElement.lang = text.lang;
    document.title = text.play.replace('{0}', gameName);
    document.querySelectorAll('.back-link').forEach(function (link) { link.textContent = '← ' + text.back; });
    if (frameSection) frameSection.setAttribute('aria-label', text.frame.replace('{0}', gameName));
  }

  apply();
  // The game in the iframe shares this origin's localStorage, so a language picked
  // inside the game fires a storage event here.
  window.addEventListener('storage', function (event) {
    if (event.key === null || event.key === languageKey) apply();
  });
}());
