require("dotenv").config();
const { onStartRef } = require("./lib/handlers/referral-handler");
const initBot = require("./lib/init-bot");
const RabbitMQ = require("./lib/rabbit-mq");

module.exports = {
  initBot,
  onStartRef,
  RabbitMQ,
};
