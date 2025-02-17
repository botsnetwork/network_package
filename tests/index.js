const { Telegraf } = require("telegraf");
const { initBot } = require("../index");

const bot = new Telegraf(process.env.BOT_TOKEN);

initBot({
  bot,
  admin_id: 5614987510,
  mongodb_uri: "mongodb://127.0.0.1:27017/network_package",
  rabbitmq_queue: "bot-events",
});

bot.launch();
