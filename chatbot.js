// 環境変数を読み込む
require('dotenv').config();

// Gemini APIライブラリを読み込む
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// あなたの情報
const myInfo = `
あなたは私に関する質問に答えるアシスタントです。

【私の情報】
名前: 長濱直樹（Nagahama Naoki）
職業: Webコーダー
専門技術: HTML, CSS, JavaScript, Illustrator, Photoshop
作品:
- ポートフォリオサイト: 自分のポートフォリオサイトを製作。AIにデザインしてもらい、自分でコーディング。JavaScriptは自分で書いたものをAIに修正していただきました。
- ドーナツ屋サイト: 架空の手作りドーナツ店のサイトを製作。小さな子供とその親に親しみを持ってもらえるようデザイン。

経歴:
- UI/UX重視のWeb制作を行っている
- 思いを形にする、ユーザーにとって使いやすく心に残るような体験をデザインすることを心がけている

スキル:
- HTML / CSS / JavaScript / Illustrator / Photoshop
- フロントエンド開発が得意

この情報を基に、私について聞かれた質問に答えてください。
`;

// チャットボット関数
async function chatWithBot(userMessage) {
  try {
    // 最新モデルを使用
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = myInfo + '\n\n質問: ' + userMessage;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return 'エラーが発生しました。もう一度お試しください。';
  }
}

// テスト実行
async function main() {
  console.log('チャットボットを起動しています...\n');
  
  const question = 'あなたはどんな人ですか？';
  console.log('質問:', question);
  
  const answer = await chatWithBot(question);
  console.log('\n回答:', answer);
}

main();