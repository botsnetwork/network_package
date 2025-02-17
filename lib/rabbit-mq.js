const amqp = require("amqplib");

class RabbitMQ {
  constructor(queue) {
    this.queue = queue;
    this.channel = null;
  }

  async connect() {
    this.connection = await amqp.connect("amqp://localhost");
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queue, { durable: false });
  }

  async consume(callback) {
    this.channel.consume(this.queue, async (msg) => {
      if (msg !== null) {
        await callback(msg);
        this.channel.ack(msg);
      }
    });
  }

  async sendMessage(message) {
    this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(message)));
  }
}

module.exports = RabbitMQ;
