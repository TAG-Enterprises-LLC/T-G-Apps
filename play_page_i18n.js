// Translates the play_tag_*.html page chrome (back link, tab title, frame label) into
// the language the T-G-Apps web games use: the saved choice from the homepage Language
// button or the in-game language button (shared_preferences key
// 'flutter.tg.locale.user_override'), else the browser language, as the apps do.
// It also fills the page's games panel (<aside class="app-games">): every game in the
// app the page plays, T-G-Apps House of Cards or T-G-Apps Boneyard.
(function () {
  'use strict';

  const languageKey = 'flutter.tg.locale.user_override';
  const strings = {
    en: {
      lang: 'en', back: 'Back to T-G-Apps Games', play: 'Play {0}', frame: '{0} playable web app',
      games: 'Games in {0}', intro: 'All of these games are in one app. Choose one here, or from the app’s menu.',
      variants: '{0} popular variants: {1}', rules: 'With rule options to create popular variants', comma: ', '
    },
    es: {
      lang: 'es', back: 'Volver a los juegos de T-G-Apps', play: 'Jugar a {0}', frame: '{0}: app web jugable',
      games: 'Juegos de {0}', intro: 'Todos estos juegos están en una sola app. Elige uno aquí o en el menú de la app.',
      variants: '{0} variantes populares: {1}', rules: 'Con opciones de reglas para crear variantes populares', comma: ', '
    },
    fr: {
      lang: 'fr', back: 'Retour aux jeux T-G-Apps', play: 'Jouer à {0}', frame: '{0} : appli web jouable',
      games: 'Jeux de {0}', intro: 'Tous ces jeux sont dans une seule appli. Choisissez-en un ici ou dans le menu de l’appli.',
      variants: '{0} variantes populaires : {1}', rules: 'Avec des options de règles pour créer des variantes populaires', comma: ', '
    },
    de: {
      lang: 'de', back: 'Zurück zu den T-G-Apps-Spielen', play: '{0} spielen', frame: '{0}: spielbare Web-App',
      games: 'Spiele in {0}', intro: 'Alle diese Spiele sind in einer App. Wähle eines hier oder im Menü der App.',
      variants: '{0} beliebte Varianten: {1}', rules: 'Mit Regeloptionen für beliebte Varianten', comma: ', '
    },
    pt_BR: {
      lang: 'pt-BR', back: 'Voltar aos jogos da T-G-Apps', play: 'Jogar {0}', frame: '{0}: app web jogável',
      games: 'Jogos do {0}', intro: 'Todos estes jogos estão em um só app. Escolha um aqui ou no menu do app.',
      variants: '{0} variantes populares: {1}', rules: 'Com opções de regras para criar variantes populares', comma: ', '
    },
    ja: {
      lang: 'ja', back: 'T-G-Apps のゲームに戻る', play: '{0} をプレイ', frame: '{0}（ブラウザでプレイできるアプリ）',
      games: '{0} のゲーム', intro: 'これらのゲームはすべて1つのアプリに入っています。ここで選ぶか、アプリのメニューから選んでください。',
      variants: '人気のバリエーション{0}種：{1}', rules: 'ルールのオプションで人気のバリエーションも遊べます', comma: '、'
    },
    hi: {
      lang: 'hi', back: 'T-G-Apps गेम पर वापस जाएँ', play: '{0} खेलें', frame: '{0} — खेलने योग्य वेब ऐप',
      games: '{0} के गेम', intro: 'ये सभी गेम एक ही ऐप में हैं। यहाँ से चुनें, या ऐप के मेनू से।',
      variants: '{0} लोकप्रिय रूप: {1}', rules: 'नियमों के विकल्पों से लोकप्रिय रूप बनाएँ', comma: ', '
    },
    id: {
      lang: 'id', back: 'Kembali ke Game T-G-Apps', play: 'Main {0}', frame: '{0}: aplikasi web yang bisa dimainkan',
      games: 'Game di {0}', intro: 'Semua game ini ada dalam satu aplikasi. Pilih di sini atau dari menu aplikasi.',
      variants: '{0} varian populer: {1}', rules: 'Dengan opsi aturan untuk membuat varian populer', comma: ', '
    },
    vi: {
      lang: 'vi', back: 'Quay lại trò chơi T-G-Apps', play: 'Chơi {0}', frame: '{0}: ứng dụng web chơi được',
      games: 'Trò chơi trong {0}', intro: 'Tất cả các trò chơi này đều nằm trong một ứng dụng. Hãy chọn ở đây hoặc từ menu của ứng dụng.',
      variants: '{0} biến thể phổ biến: {1}', rules: 'Có tùy chọn luật để tạo các biến thể phổ biến', comma: ', '
    }
  };

  // The games each app's menu shows, in its order. A game with a menu of its own lists
  // that menu's games (in the app's words for each language); rules marks a game whose
  // setup options turn it into well-known variants. Each id has a play_tag_<id>.html.
  const apps = {
    'house-of-cards': {
      name: 'T-G-Apps House of Cards',
      games: [
        { id: 'hearts', name: 'Hearts', rules: true },
        { id: 'spades', name: 'Spades' },
        { id: 'bridge', name: 'Bridge' },
        { id: 'rummy', name: 'Rummy', variants: ['Rummy', 'Gin Rummy', 'Rummy 500', 'Contract Rummy', 'Indian Rummy'] },
        { id: 'cribbage', name: 'Cribbage', rules: true },
        { id: 'pinochle', name: 'Pinochle' },
        { id: 'canasta', name: 'Canasta' },
        { id: 'euchre', name: 'Euchre', rules: true }
      ]
    },
    boneyard: {
      name: 'T-G-Apps Boneyard',
      games: [
        { id: 'yz', name: 'YZ' },
        { id: 'farkle', name: 'Farkle', rules: true },
        {
          id: 'dominoes', name: 'Dominoes', variants: {
            en: ['42', 'Block', 'Draw', 'Mexican Train', 'All Fives', 'Bergen'],
            es: ['42', 'Bloqueo', 'Dominó de robo', 'Tren Mexicano', 'Todos los cincos', 'Bergen'],
            fr: ['42', 'Bloqué', 'Pioche', 'Train mexicain', 'Tous les cinq', 'Bergen'],
            de: ['42', 'Block', 'Ziehen', 'Mexican Train', 'Alle Fünfer', 'Bergen'],
            pt_BR: ['42', 'Bloqueio', 'Compra', 'Trem Mexicano', 'Todos os cincos', 'Bergen'],
            ja: ['42', 'ブロック', 'ドロー', 'メキシカントレイン', 'オールファイブ', 'ベルゲン'],
            hi: ['42', 'ब्लॉक', 'ड्रा', 'मैक्सिकन ट्रेन', 'ऑल फाइव्स', 'बर्गेन'],
            id: ['42', 'Blok', 'Tarik', 'Kereta Meksiko', 'Semua Lima', 'Bergen'],
            vi: ['42', 'Chặn', 'Rút', 'Tàu Mexico', 'Tất cả số năm', 'Bergen']
          }
        },
        {
          id: 'mahjong', name: 'Mahjong', variants: {
            en: ['Hong Kong', 'Riichi', 'Chinese Official', 'Taiwanese', 'Sichuan', 'Solitaire'],
            es: ['Hong Kong', 'Riichi', 'Chino oficial', 'Taiwanés', 'Sichuan', 'Solitario'],
            fr: ['Hong Kong', 'Riichi', 'Chinois officiel', 'Taïwanais', 'Sichuan', 'Solitaire'],
            de: ['Hongkong', 'Riichi', 'Chinesisch (offiziell)', 'Taiwanesisch', 'Sichuan', 'Solitär'],
            pt_BR: ['Hong Kong', 'Riichi', 'Chinês oficial', 'Taiwanês', 'Sichuan', 'Paciência'],
            ja: ['香港式', 'リーチ麻雀', '中国麻雀', '台湾麻雀', '四川麻雀', 'ソリティア'],
            hi: ['हांगकांग', 'रीची', 'चीनी आधिकारिक', 'ताइवानी', 'सिचुआन', 'सॉलिटेयर'],
            id: ['Hong Kong', 'Riichi', 'Resmi Tiongkok', 'Taiwan', 'Sichuan', 'Solitaire'],
            vi: ['Hồng Kông', 'Riichi', 'Trung Quốc chính thức', 'Đài Loan', 'Tứ Xuyên', 'Xếp hình']
          }
        }
      ]
    }
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
  const panel = document.querySelector('.app-games');

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function fillPanel(text, code) {
    const app = panel && apps[panel.dataset.app];
    if (!app) return;
    panel.replaceChildren();
    panel.appendChild(element('h2', null, text.games.replace('{0}', app.name)));
    panel.appendChild(element('p', 'app-games-intro', text.intro));
    const list = element('ul');
    app.games.forEach(function (game) {
      // The page's own game is marked, not labeled: a player can switch games in
      // the app's menu, which this page can't see.
      const item = element('li', game.id === panel.dataset.game ? 'page-game' : null);
      const link = element('a', 'game', game.name);
      link.href = 'play_tag_' + game.id + '.html';
      item.appendChild(link);
      if (game.variants) {
        const names = Array.isArray(game.variants) ? game.variants : game.variants[code];
        item.appendChild(element('span', 'note',
          text.variants.replace('{0}', names.length).replace('{1}', names.join(text.comma))));
      } else if (game.rules) {
        item.appendChild(element('span', 'note', text.rules));
      }
      list.appendChild(item);
    });
    panel.appendChild(list);
  }

  function apply() {
    const code = languageCode();
    const text = strings[code];
    document.documentElement.lang = text.lang;
    document.title = text.play.replace('{0}', gameName);
    document.querySelectorAll('.back-link').forEach(function (link) { link.textContent = '← ' + text.back; });
    if (frameSection) frameSection.setAttribute('aria-label', text.frame.replace('{0}', gameName));
    fillPanel(text, code);
  }

  apply();
  // The game in the iframe shares this origin's localStorage, so a language picked
  // inside the game fires a storage event here.
  window.addEventListener('storage', function (event) {
    if (event.key === null || event.key === languageKey) apply();
  });
}());
