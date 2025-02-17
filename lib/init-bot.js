const User = require("../models/user");
const RabbitMQ = require("./RabbitMQ");
const { ADMIN_ID } = require("../constants");

function initBot(bot, rabbitMQQueue = "bot-events") {
  // Middleware для обновления пользователей
  bot.use(async (ctx, next) => {
    if (ctx.from) {
      try {
        await User.findOneAndUpdate(
          { telegramId: ctx.from.id },
          {
            telegramId: ctx.from.id,
            username: ctx.from.username,
            firstName: ctx.from.first_name,
            lastName: ctx.from.last_name,
            isActive: true,
            lastInteraction: new Date(),
          },
          { upsert: true, new: true }
        );
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
    return next();
  });

  // Инициализация RabbitMQ
  const rabbitMQ = new RabbitMQ(rabbitMQQueue);

  rabbitMQ.connect().then(() => {
    rabbitMQ.consume(async (msg) => {
      const event = JSON.parse(msg.content.toString());

      if (event.action === "broadcast") {
        try {
          const users = await User.find({});
          if (!users.length) {
            console.log("Пользователи не найдены.");
            return;
          }

          for (const user of users) {
            await bot.telegram.sendMessage(user.telegramId, event.message);
          }
        } catch (e) {
          console.error("Ошибка при отправке сообщения:", e);
        }
      }
    });
  });

  bot.command("users", async (ctx) => {
    try {
      if (ctx.from.id !== ADMIN_ID) return;
      // Получаем общее количество пользователей
      const totalUsers = await User.countDocuments();

      // Получаем количество новых пользователей за сегодня
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const newUsersToday = await User.countDocuments({
        createdAt: { $gte: startOfToday },
      });

      // Отправляем сообщение с результатами
      ctx.reply(
        `Всего пользователей: ${totalUsers}\nНовых пользователей за сегодня: ${newUsersToday}`
      );
    } catch (error) {
      console.error("Ошибка при получении данных о пользователях:", error);
      ctx.reply("Произошла ошибка при получении данных о пользователях.");
    }
  });

  bot.command("get_users", async (ctx) => {
    try {
      if (ctx.from.id !== ADMIN_ID) return;
      // Получаем всех пользователей
      const users = await User.find({});

      // Если пользователей нет
      if (users.length === 0) {
        return ctx.reply("Пользователей пока нет.");
      }

      // Формируем строку с информацией о каждом пользователе
      const usersList = users
        .map((user) => {
          const name = user.firstName || user.username || "Не указано";
          return `Имя: ${name}, chat_id: ${user.telegramId}`;
        })
        .join("\n");

      // Отправляем сообщение с результатами
      ctx.reply(`Список пользователей:\n${usersList}`);
    } catch (error) {
      console.error("Ошибка при получении данных о пользователях:", error);
      ctx.reply("Произошла ошибка при получении данных о пользователях.");
    }
  });

  return { rabbitMQ };
}

module.exports = initBot;
