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

// チャットの出力エリアを最下部にスクロールする関数
function scrollToBottom() {
    const outputContainer = document.getElementById("output");
    outputContainer.scrollTop = outputContainer.scrollHeight;
}

// メッセージ送信処理
async function handleSendMessage() {
    const userInput = document.getElementById("input").value.trim();
    if (!userInput) return;
    //チャット入力後に最下部を表示
    document.getElementById("output").innerHTML += `<p class="user-message">${userInput}</p>`;
    scrollToBottom(); 
    try {
        const model = await modelPromise;
        if (!model) throw new Error("モデルが初期化されていません");
        const chat = await model.startChat();
        const result = await chat.sendMessage(userInput);
        const response = await result.response;
        const text = await response.text();
        document.getElementById("output").innerHTML += `<p class="gemini-message"> ${text}</p>`;
        console.log(text);
        // 最下層へスクロール
        scrollToBottom(); 
    } catch (error) {
        console.error("エラーが発生しました:", error);
        document.getElementById("output").innerHTML += `<p><strong>エラー:</strong> 応答の取得に失敗しました。</p>`;
        scrollToBottom(); 
    }
    //入力欄をブランクへ
    document.getElementById("input").value = '';
}

// クリックイベント
function send() {
    //送信ボタンをクリックして、送信処理
    document.getElementById("send").addEventListener("click", handleSendMessage);
    // Enterキー押下時
    document.getElementById("input").addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {  
            handleSendMessage();
             // Enterキーによる改行を防止
            event.preventDefault(); 
        }
    });
}

send();
