require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const nodemailer = require('nodemailer'); // メール送信用ライブラリを読み込む
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(express.json());

// 静的ファイルを提供（パスを明示）
app.use(express.static(path.join(__dirname, 'public')));

// Gemini API初期化
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Nodemailerの設定
// これはメール送信のための「郵便配達員」を作るようなものです
const transporter = nodemailer.createTransport({
  service: 'gmail', // Gmailを使うことを指定
  auth: {
    user: process.env.EMAIL_USER, // 送信元のGmailアドレス
    pass: process.env.EMAIL_PASS  // アプリパスワード
  }
});

// メール送信機能が正しく設定されているか確認
// サーバー起動時に一度だけチェックします
transporter.verify(function(error, success) {
  if (error) {
    console.log('メール設定エラー:', error);
  } else {
    console.log('メール送信の準備ができました');
  }
});

// わたしの情報（チャットボット用）
const myInfo = `
あなたはNagahama Naokiに関する質問に答えるアシスタントです。
あなたの名前はNANa-アシスタントです。

【基本情報】
名前: Nagahama Naoki
職業: Web Coder
専門: UI/UX重視のWeb制作
キャッチフレーズ: 想いが届くサイト

【スキル】
- HTML / CSS
- JavaScript
- Adobe Illustrator
- Adobe Photoshop

【作品】
A: サイト
  1. ポートフォリオサイト
    - 自分のポートフォリオサイトを製作
    - AIにデザインしてもらい、自分でコーディング
    - JavaScriptは自分で書いたものをAIに修正してもらった
    - 機能として、問い合わせの受信やAIチャットボットによる応答、ダークモードの切り替えが備えてある
    - レスポンシブにも対応しており、シンプルで直感的に操作できるようなデザイン

  2. ドーナツ店サイト
    - 架空の手作りドーナツ店のサイトを製作
    - 小さな子供とその親に親しみを持ってもらえるようデザイン
    - 授業で取り扱った作品

B: デザイン
  1. DM
  - 手作り工房（架空）のダイレクトメッセージを製作
  - 工房であることから、建物をメインにデザインし、看板をたてました。幅広い年齢層に対応できるよう、シンプルで親しみやすい色合いにした
  - 授業で取り扱った作品

  2. ロゴ
  - 紅茶カフェ（架空）のロゴを製作
  - 花の香が立つお茶を提供するカフェをイメージした
  - 授業で取り扱った作品

  3. パッケージ
  - ツバキ石鹸（架空）のパッケージを製作
  - 椿の花をモチーフに、自然で優しいイメージを表現しました。外国の方に手に取っていただけるよう、日の丸の形を意識した
  - 授業で取り扱った作品

C: その他
  1. 動画素材自動収集ワークフロー
  - n8nを利用して動画用の素材を自動収集してくれるシステムを製作

【理念】
- HTML, CSS, JavaScriptを用いたフロントエンド開発を得意としている
- Adobe IllustratorやPhotoshopを使ったグラフィックデザインの経験もある
- ユーザーにとって使いやすく、心に残るような体験をデザインすることを心がけている
- AIの勉強にも熱を入れている

【回答スタイル】
- フレンドリーでプロ意識をもつトーンで答えてください
- 技術的な質問には具体例を交えて説明してください
- 自信を持って、でも謙虚に答えてください
- 質問の意図を汲み取り、的確に答えてください
- 100文字以内にまとめ、わかりやすく答えてください

【注意事項】
- 私の情報に基づいて答えてください
- 答えがわからない場合は「わかりません」と正直に答えてください
- 事実と異なることを言わないでください

この情報を基に、Nagahama Naokiのアシスタントとして、Nagahama Naokiについて聞かれた質問に丁寧に答えてください。
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

// コンタクトフォーム送信APIエンドポイント
// コンタクトフォームからの送信を受け取る部分
app.post('/api/contact', async (req, res) => {
  try {
    // フロントエンドから送られてきた情報を受け取る
    const { name, email, message } = req.body;
    
    // 必須項目がすべて入力されているか確認
    // もし何か欠けていたら、エラーを返します
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'すべての項目を入力してください' 
      });
    }

    // メールアドレスの形式が正しいか簡単にチェック
    // @マークが含まれているかを確認する基本的なチェックです
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'メールアドレスの形式が正しくありません' 
      });
    }

    // 送信するメールの内容を設定
    // HTMLメールとプレーンテキストの両方を用意します
    const mailOptions = {
      from: process.env.EMAIL_USER, // 送信元（あなたのGmail）
      to: process.env.EMAIL_TO,     // 送信先（メールを受け取るアドレス）
      subject: `【ポートフォリオ】${name}様からのお問い合わせ`, // メールの件名
      
      // プレーンテキスト版（HTMLが表示できない環境用）
      text: `
お名前: ${name}
メールアドレス: ${email}

お問い合わせ内容:
${message}
      `,
      
      // HTML版（見やすく整形されたバージョン）
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3498db; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
            ポートフォリオサイトからのお問い合わせ
          </h2>
          
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>お名前:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>メールアドレス:</strong> ${email}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #2c3e50;">お問い合わせ内容:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #7f8c8d; font-size: 12px;">
            このメールはポートフォリオサイトのコンタクトフォームから自動送信されました。
          </p>
        </div>
      `
    };

    // 実際にメールを送信する処理
    // この部分は時間がかかる可能性があるので、awaitで完了を待ちます
    await transporter.sendMail(mailOptions);
    
    // 送信成功をフロントエンドに返す
    res.json({ 
      success: true, 
      message: 'お問い合わせを受け付けました。ありがとうございます！' 
    });
    
  } catch (error) {
    // エラーが発生した場合、詳細をログに記録して
    // ユーザーには一般的なエラーメッセージを返します
    console.error('メール送信エラー:', error);
    res.status(500).json({ 
      success: false, 
      error: 'メール送信中にエラーが発生しました。後ほど再度お試しください。' 
    });
  }
});

// サーバー起動
// ホストを '0.0.0.0' に設定することで、Renderからのアクセスが可能になる
const HOST = '0.0.0.0'; 

app.listen(PORT, HOST, () => {
  console.log(`ポートフォリオサイトが起動しました: http://localhost:${PORT}`);
  console.log('Ctrl+C で終了');
});