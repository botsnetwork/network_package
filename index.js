require("dotenv").config();
const initBot = require("./lib/init-bot");
const RabbitMQ = require("./lib/rabbit-mq");

module.exports = {
  initBot,
  RabbitMQ,
};
