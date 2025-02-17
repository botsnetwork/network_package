# bot_network_package

`bot_network_package` is a powerful Node.js package designed for bot network administration. It provides seamless integration between multiple bots, enabling advanced features like multi-posting and centralized user management. Built with scalability in mind, it leverages **RabbitMQ** for inter-bot communication and **MongoDB** for persistent user data storage.

## Key Features

- **Multi-Posting via RabbitMQ**: Easily broadcast messages across multiple bots using RabbitMQ as a message broker. Perfect for managing large-scale bot networks.
- **Centralized User Management**: Store and manage user data in **MongoDB**, ensuring consistency and persistence across your bot network.
- **Scalable Architecture**: Designed to handle growing networks of bots, making it ideal for projects of any size.
- **Easy Integration**: Simple API and clear documentation allow for quick setup and integration into existing bot projects.
- **Cross-Bot Communication**: Enable bots to communicate with each other, facilitating complex workflows and coordinated actions.

## Use Cases

- **Social Media Management**: Manage multiple bots for posting content across different platforms simultaneously.
- **User Analytics**: Track and analyze user interactions across your bot network with centralized MongoDB storage.
- **Automated Workflows**: Coordinate tasks between bots using RabbitMQ for efficient automation.

## Installation

Install the package via npm:

```bash
npm install bot_network_package
```

## Quick Start

1. Set up RabbitMQ: Ensure RabbitMQ is running and configure the connection settings.
1. Configure MongoDB: Connect to your MongoDB instance to store user data.
1. Initialize the Package:

```js
const { initBot } = require("bot_network_package");

const bot = new Telegraf("YOUR_BOT_TOKEN");

const botNetwork = initBot(
  bot /* telegraf instance */ /* rabbitMQQueue = "bot-events" */
);

// Start the bot network
botNetwork.start();
```

## Contributing

Contributions are welcome! Please read the contribution guidelines before submitting a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
