# house-ads — 自社アプリ紹介バナーの設定

QuickServe のアプリ（`qs_house_ads` パッケージを組み込んだもの）は、起動時に
`https://qkserve.github.io/house-ads/config.json` を取得し、AdMob のバナー枠に
**この JSON で決めた確率で自社アプリの紹介バナー**を出す。**この JSON を直して push するだけで、
アプリを更新せずに確率と宣伝内容が変わる**（各端末は `refreshIntervalHours` ごとに再取得）。

## いじる場所

| キー | 意味 |
|---|---|
| `defaultProbability` | バナー枠を組むたびに自社バナーを出す確率（0〜1）。**0 で全アプリ停止** |
| `fillOnNoAd` | AdMob が埋まらなかった（no fill / オフライン / 同意で出せない）とき自社バナーで埋めるか |
| `refreshIntervalHours` | 端末が設定を取り直す間隔 |
| `perApp.<バンドルID>` | そのアプリだけ `probability` / `fillOnNoAd` を上書き（省略はトップレベルの値） |
| `apps[]` | 宣伝するアプリ。`enabled: false` で個別停止、`weight` で出やすさ（重み付き抽選） |
| `apps[].ios.appStoreId` / `apps[].android.packageId` | 無いプラットフォームでは候補にしない（例: NumberEraser は App Store ID が未登録のため iOS では出ない） |
| `apps[].title` / `tagline` / `cta` | ロケール別の文言（`ja` / `en` / `zh` / `zh_Hant`）。無い言語は `en` に落ちる |
| `apps[].icon` | `icons/<バンドルID>.png`（256×256）。差し替えるときは**ファイル名（URL）を変える**（端末は URL が変わったときだけ取り直す） |

- 自アプリはカタログに載っていても自動で除外される（全アプリ共通の 1 ファイルでよい）
- 壊れた要素は個別に無視され、全体が読めないときは端末の前回のキャッシュが使われる
- 一時的な設定（実機確認用の `perApp` の確率 1.0 など）は確認が済んだら外す

## 変更手順

```bash
cd ~/git/qkserve.github.io
# config.json を編集
(cd ~/git/qs_house_ads && dart run qs_house_ads:validate_config ~/git/qkserve.github.io/house-ads/config.json)
git add house-ads && git commit -m "feat(house-ads): ..." && git push
curl -s https://qkserve.github.io/house-ads/config.json | head   # 反映確認（数分かかる）
```

アイコンの作り方（各アプリの 1024px アイコンから）:

```bash
python3 -c "from PIL import Image; Image.open('Icon-1024.png').convert('RGBA').resize((256,256), Image.LANCZOS).save('house-ads/icons/<バンドルID>.png', optimize=True)"
```
