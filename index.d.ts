declare module "telegram_bot_network" {
  type InitBotOptions = { [k: string]: any };
  export function initBot(options: InitBotOptions): void;
  export function onStartRef(options: InitBotOptions): void;
  export class RabbitMQ {
    constructor(queue: string);
  }
}
