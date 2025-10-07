require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // publicフォルダを公開

// Gemini API初期化
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// あなたの情報（index.htmlから取得した情報を元に）
const myInfo = `
あなたは長濱直樹（Nagahama Naoki）に関する質問に答えるアシスタントです。

【基本情報】
名前: 長濱直樹（Nagahama Naoki）
職業: Web Coder
専門: UI/UX重視のWeb制作
キャッチフレーズ: 思いを形にする、UI/UX重視のWeb制作

【スキル】
- HTML / CSS
- JavaScript
- Adobe Illustrator
- Adobe Photoshop

【作品】
1. ポートフォリオサイト
   - 自分のポートフォリオサイトを製作
   - AIにデザインしてもらい、自分でコーディング
   - JavaScriptは自分で書いたものをAIに修正してもらった

2. ドーナツ屋サイト
   - 架空の手作りドーナツ店のサイトを製作
   - 小さな子供とその親に親しみを持ってもらえるようデザイン
   - 授業で取り扱った作品

3. デザイン作品
   - ロゴ: 紅茶カフェ（架空）のロゴをイラレで作成
   - パッケージ: 石鹸のパッケージをイラレで作成

【理念】
- HTML, CSS, JavaScriptを用いたフロントエンド開発を得意としている
- Adobe IllustratorやPhotoshopを使ったグラフィックデザインの経験もある
- ユーザーにとって使いやすく、心に残るような体験をデザインすることを心がけている

この情報を基に、長濱直樹について聞かれた質問に丁寧に答えてください。
日本語で自然な会話を心がけてください。
`;

// チャットAPIエンドポイント
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'メッセージが必要です' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = myInfo + '\n\n質問: ' + message;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ reply: text });
    
  } catch (error) {
    console.error('エラー:', error);
    res.status(500).json({ error: 'エラーが発生しました' });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`ポートフォリオサイトが起動しました: http://localhost:${PORT}`);
  console.log('Ctrl+C で終了');
});