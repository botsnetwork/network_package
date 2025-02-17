# Telegram Bot Functionality

This README provides an overview of the functionality implemented in the Telegram bot. The bot is designed to manage users, broadcast messages, and provide admin-specific commands for monitoring user data.

---

## Features

### 1. Middleware for Updating Users

A middleware is implemented to automatically update or create user records in the database during interactions with the bot.

- **Key Features**:
  - Updates or creates user information such as `telegramId`, `username`, `firstName`, `lastName`, `isActive`, and `lastInteraction`.
  - Ensures that the `lastInteraction` field is updated with the current timestamp to track user activity.
  - Uses MongoDB's `findOneAndUpdate` method with the `upsert: true` option to handle both updates and new user creation.

---

### 2. RabbitMQ Integration for Broadcasting Messages

The bot integrates with RabbitMQ to consume messages from a queue and broadcast them to all registered users.

- **Key Features**:
  - Listens for messages with the action `"broadcast"`.
  - Retrieves all active users from the database and sends the broadcast message to each user's `telegramId` using the Telegram Bot API.
  - Logs a message if no users are found in the database.

---

### 3. Admin Commands

#### `/users`

This command allows the bot administrator to retrieve statistics about the total number of users and the number of new users registered today.

- **Key Features**:
  - Accessible only by the admin (verified via `ADMIN_ID`).
  - Provides:
    - Total number of users in the database.
    - Number of new users registered since the start of the current day.
  - Sends the results as a formatted message to the admin.

#### `/get_users`

This command allows the bot administrator to retrieve a detailed list of all registered users.

- **Key Features**:
  - Accessible only by the admin (verified via `ADMIN_ID`).
  - Retrieves all users from the database and formats their details into a readable list.
  - Each user entry includes their name (or username if the name is unavailable) and their `chat_id` (`telegramId`).
  - If no users are found, it informs the admin that there are no registered users.

---

### 4. Error Handling

The bot includes robust error handling to ensure smooth operation:

- Logs errors for debugging purposes.
- Sends appropriate error messages to the admin in case of failures (e.g., database errors, message sending errors).

---

## Usage

### Prerequisites

- Node.js installed on your machine.
- MongoDB database for storing user information.
- RabbitMQ server for message broadcasting.

## Installation

Install the package via npm:

```bash
npm install telegram_bot_network
```

## Quick Start

1. Set up RabbitMQ: Ensure RabbitMQ is running and configure the connection settings.
1. Configure MongoDB: Connect to your MongoDB instance to store user data.
1. Initialize the Package:

```js
const { Telegraf } = require("telegraf");
const { initBot } = require("telegram_bot_network");

const bot = new Telegraf(process.env.BOT_TOKEN);

initBot({
  bot,
  admin_id: /* Telegram admin id */,
  mongodb_uri: /* mongodb_uri */,
  rabbitmq_queue: "bot-events" /* can use custom */,
});

bot.launch();
```

## Contributing

Contributions are welcome! Please read the contribution guidelines before submitting a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
