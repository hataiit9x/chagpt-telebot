import * as dotenv from 'dotenv'
import { ChatGPTAPI } from 'chatgpt'
import TelegramBot from 'node-telegram-bot-api'
dotenv.config()
const { token, sessionToken } = process.env

const bot = new TelegramBot(token, { polling: true });
console.log(new Date().toLocaleString(), '--Bot has been started...');

bot.on('message', (msg) => {
  console.log(new Date().toLocaleString(), '--received from:', msg.chat.username, 'news :', msg.text);
  msgHandler(msg);
});

function msgHandler(msg) {
  switch (true) {
    case msg.text.indexOf('/start') === 0:
      bot.sendMessage(msg.chat.id, '👋Xin chào! Thật là vinh hạnh khi được nói chuyện với bạn. tôi có thể làm gì cho bạn ？');
      break;
    default:
      chatGpt(msg, bot);
      break;
  }
}
async function chatGpt(msg, bot) {
  try {
    const api = new ChatGPTAPI({ sessionToken, markdown: false })
    await api.ensureAuth()
    const response = await api.sendMessage(msg.text)
    console.log(response)
    bot.sendMessage(msg.chat.id, response);
  }catch(err) {
    console.log(err)
    bot.sendMessage(msg.chat.id, '😭 Đã xảy ra sự cố và tôi cần nghỉ ngơi.');
    throw err
  }
}
