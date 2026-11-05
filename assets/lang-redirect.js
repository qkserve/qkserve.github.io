/**
 * 日本語以外の端末で日本語のページを開いたら、同じページの英語版へ移す。
 *
 * GitHub Pages はサーバー側で言語を見て振り分けられないため、ブラウザで判定する。
 * アプリやストアに載せる URL を日本語版の 1 つにできる。
 * 日本語版と英語版の両方があるページだけが、このファイルを読み込む。
 */
(function () {
  var STORAGE_KEY = 'qs-lang';
  var JAPANESE = 'ja';
  var ENGLISH_PATH = 'en/';
  // 検索エンジンを移すと、日本語版が検索結果から消えるおそれがある
  var CRAWLER_PATTERN = /bot|crawl|spider|slurp|lighthouse|yeti/i;

  // プライベートブラウズなどでは保存が例外になるので、読み書きとも失敗を無視する
  function readChoice() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveChoice(language) {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      // 保存できなくても、リンクの移動はそのまま進める
    }
  }

  /** ページ上部の言語リンクで選んだ言語を覚え、次回からそれを優先する。 */
  document.addEventListener('click', function (event) {
    var link = event.target.closest('.lang a[hreflang]');
    if (link) saveChoice(link.getAttribute('hreflang'));
  });

  if (document.documentElement.lang !== JAPANESE) return;
  if (CRAWLER_PATTERN.test(navigator.userAgent)) return;

  var englishUrl = new URL(ENGLISH_PATH, location.href).href;
  // 保存できない環境でも、英語版の「日本語」リンクで戻された人を押し返さない
  if (document.referrer.split(/[?#]/)[0] === englishUrl) return;

  var language = readChoice() || navigator.language;
  if (!language || language.toLowerCase().indexOf(JAPANESE) === 0) return;

  location.replace(englishUrl + location.search + location.hash);
})();
