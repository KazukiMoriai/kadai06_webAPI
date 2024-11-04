//apikey.jsから関数をインポート
import { getApiKey } from './apikey.js';

// 生成モデルの初期化・メソッドの呼び出し
import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = getApiKey();
const genAI = new GoogleGenerativeAI(API_KEY);

async function initializeModel() {
    try {
        return await genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    } catch (error) {
        console.error("モデルの初期化に失敗しました:", error);
        return null;
    }
}

const modelPromise = initializeModel();

// 送信ボタンクリック時のイベント処理
function send() {
  document.getElementById("send").addEventListener("click", async function() {
    const userInput = document.getElementById("input").value.trim();
    if (!userInput) return;

    document.getElementById("output").innerHTML += `<p><strong>あなた:</strong> ${userInput}</p>`;

    try {
        const model = await modelPromise;
        if (!model) throw new Error("モデルが初期化されていません");

        const chat = await model.startChat();  // ここで await を追加
        const result = await chat.sendMessage(userInput);
        const response = await result.response;
        const text = await response.text();

        document.getElementById("output").innerHTML += `<p><strong>Gemini君:</strong> ${text}</p>`;
        console.log(text);
    } catch (error) {
        console.error("エラーが発生しました:", error);
        document.getElementById("output").innerHTML += `<p><strong>エラー:</strong> 応答の取得に失敗しました。</p>`;
    }

    document.getElementById("input").value = '';
  });
};

send();
