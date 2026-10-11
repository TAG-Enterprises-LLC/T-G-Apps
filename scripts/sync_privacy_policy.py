"""Copies the T-G-Apps privacy policy from the shared app package to this website.

The apps show the policy from the tag_privacy_policy package (English plus eight
full translations). This script publishes the same pages here, so the website
and every app show one standard policy:

  privacy_policy.html             English (the address store listings link to)
  privacy_policy_<code>.html      es fr de pt ja hi id vi

The policy text is copied unchanged. Each page only gains a link back to the
homepage, and the English page follows the language the visitor picked with
the homepage Language button (or the browser language), as the homepage does.
Translated pages link to the English version, which governs.

Run from the repository root after changing the policy in the package:

  python scripts/sync_privacy_policy.py [path/to/tag_privacy_policy/lib/assets/text]
"""

import io
import os
import sys

DEFAULT_SOURCE = r'D:\TAG_Local_Code\dev\packages\tag_privacy_policy\lib\assets\text'
SITE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Package file suffix -> link text. 'pt' is Brazilian Portuguese, as in the package.
LANGUAGES = {
    'en': ('Back to T-G-Apps Games', None),
    'es': ('Volver a los juegos de T-G-Apps', 'Versión en inglés'),
    'fr': ('Retour aux jeux T-G-Apps', 'Version anglaise'),
    'de': ('Zurück zu den T-G-Apps-Spielen', 'Englische Fassung'),
    'pt': ('Voltar aos jogos da T-G-Apps', 'Versão em inglês'),
    'ja': ('T-G-Apps のゲームに戻る', '英語版'),
    'hi': ('T-G-Apps गेम पर वापस जाएँ', 'अंग्रेज़ी संस्करण'),
    'id': ('Kembali ke Game T-G-Apps', 'Versi bahasa Inggris'),
    'vi': ('Quay lại trò chơi T-G-Apps', 'Bản tiếng Anh'),
}

STYLE = """
  <style>
    .site-nav { max-width: 900px; margin: 0 auto 12px auto; display: flex; flex-wrap: wrap; gap: 8px 18px; }
    .site-nav a { color: #063a25; font-weight: 700; text-decoration: none; }
    .site-nav a:hover, .site-nav a:focus { text-decoration: underline; }
  </style>
"""

# On the English page only: open the translation for the visitor's language, using
# the key the homepage and the Flutter web games share. ?lang=en keeps English.
LANGUAGE_SCRIPT = """
  <script>
    (function () {
      try {
        if (/[?&]lang=en\\b/.test(location.search)) return;
        var code = null;
        try { code = JSON.parse(localStorage.getItem('flutter.tg.locale.user_override') || 'null'); } catch (_) {}
        var tags = code ? [String(code)] : (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en']);
        var available = ['es', 'fr', 'de', 'pt', 'ja', 'hi', 'id', 'vi'];
        for (var i = 0; i < tags.length; i++) {
          var base = String(tags[i]).toLowerCase().split(/[-_]/)[0];
          if (base === 'en') return;
          if (available.indexOf(base) >= 0) { location.replace('privacy_policy_' + base + '.html'); return; }
        }
      } catch (_) {}
    }());
  </script>
"""


def build(source_dir, code):
    name = 'tag_privacy_policy.html' if code == 'en' else 'tag_privacy_policy_%s.html' % code
    html = io.open(os.path.join(source_dir, name), encoding='utf-8').read()
    back, english = LANGUAGES[code]
    head_extra = STYLE + (LANGUAGE_SCRIPT if code == 'en' else '')
    links = '<a href="/">&larr; %s</a>' % back
    if english:
        links += '<a href="privacy_policy.html?lang=en" lang="en">%s</a>' % english
    nav = '\n  <nav class="site-nav">%s</nav>\n' % links
    assert html.count('</head>') == 1 and html.count('<body>') == 1, name
    html = html.replace('</head>', head_extra + '</head>')
    html = html.replace('<body>', '<body>' + nav)
    out = 'privacy_policy.html' if code == 'en' else 'privacy_policy_%s.html' % code
    io.open(os.path.join(SITE_ROOT, out), 'w', encoding='utf-8', newline='\n').write(html)
    return out


def main():
    source_dir = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SOURCE
    for code in LANGUAGES:
        print('wrote', build(source_dir, code))


if __name__ == '__main__':
    main()
