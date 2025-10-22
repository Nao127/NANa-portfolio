# 🌸 NANa-Portfolio

**Nagahama Naoki (NANa) のポートフォリオサイト**  
Nagahama Naokiの技術・作品・経歴を知ることができます。

---

## 🧠 概要

このポートフォリオサイトは、  
**Nagahama Naoki (NANa)** がフルスタックエンジニアを目指して制作した  
「AIチャット付き自己紹介サイト」です。

AIとの自然な会話を通して、  
スキル・制作実績・学習記録などをインタラクティブに紹介します。  

- フロントエンド：HTML / CSS / JavaScript  
- バックエンド：Node.js / Express  
- AI連携：Google Gemini API  
- デプロイ：Render + GitHub  

---

## ⚙️ 主な機能

- 🤖 **AIチャット機能**（Gemini APIによる自然対話）
- 📨 **問い合わせフォーム**（Nodemailerを使用してメール送信）
- 📱 **レスポンシブデザイン**（スマホ・PC両対応）
- 🌙 **ダークテーマ** (デザイントークンを利用したテーマ切り替え)

---

## 🧱 使用技術

| 分野 | 使用技術 |
|------|-----------|
| **フロントエンド** | HTML / CSS / JavaScript |
| **バックエンド** | Node.js / Express |
| **AI連携** | Google Generative AI (Gemini API) |
| **メール送信** | Nodemailer (Gmail経由) |
| **ホスティング** | Render + GitHub |

---

## 🧩 環境構築方法

### 1️⃣ リポジトリをクローン
```bash
git clone https://github.com/Nao127/NANa-portfolio.git
cd NANa-portfolio
```

### 2️⃣ パッケージをインストール
```bash
npm instasll
```

### 3️⃣ 環境変数を設定
```env
GEMINI_API_KEY=あなたのGeminiAPIキー
EMAIL_USER=あなたのGmailアドレス
EMAIL_PASS=Gmailアプリパスワード
EMAIL_TO=受信先メールアドレス
```

### 4️⃣ ローカルサーバーを起動
```bash
node server.js
```
⇩ブラウザで開く  
http://localhost:3000

---

## 💬使用方法
1. チャットボックスに質問を入力
2. AIがリアルタイムで返答
3. 問い合わせフォームから連絡を送ることも可能

---

## 📁ディレクトリ構成
📦 NANa-portfolio  
├── docs/  
│   ├── index.html       # メインページ  
│   ├── style.css        # デザイン  
│   └── script.js        # ロジック  
├── server.js            # Node.jsサーバー（Gemini API接続）  
├── package-lock.json    # ライブラリ収納  
├── package.json         # 使用ライブラリ設定  
├── .env                 # APIキー（非公開）  
└── README.md            # このファイル  

---

## 🌐公開URL
・GitHubリポジトリ  
　👉https://github.com/Nao127/NANa-portfolio  
・Render（公開サイト）⚠️基本動いていないです  
　👉https://portfolio-chatbot-uytc.onrender.com/  

---

## 👤作者情報
Nagahama Naoki  
・📫Mail: nana1238.web@gmail.com  
・🐱GitHub: @Nao127  

---

## 今後の展望
### 🧑🏻‍💻 **技術的なアップグレード**
- Node.jsの理解を深め、API設計やセキュリティを強化
- Next.js / TypeScript を学び、よりモダンな開発スタイルへ移行

### 🦾 **AIとの連携強化**
- AIが作品データを解析して紹介できるようにする

### 🖼️ **UI / UX の改善**
- Tailwind CSS / Framer Motion で動的で心地よいUIを実現

### 📚 **ポートフォリオの拡張**
- 作品を追加して紹介
- プロジェクトごとの開発ログや振り返り記事を掲載

### 📓 **学習・キャリアの方向性**
- フルスタックエンジニアとして、AI × web の分野に挑戦

---

## 📝制作の背景
自分のポートフォリオサイトが必要だと思い、制作しました。  
AIとの共創を通して、  
コーディング力・構築力・デザイン力・AI応用力を総合的に鍛えています。
