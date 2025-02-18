const User = require("../../models/user");
const Referral = require("../../models/referral");
const crypto = require("crypto");

async function generateUniqueReferralCode() {
  const code = crypto.randomBytes(8).toString("hex");
  return code;
}

// Core referral processing logic
async function processReferral(ctx, referralCode) {
  try {
    // Get or create user
    let user = await User.findOne({ telegramId: ctx.from.id });
    if (!user) {
      user = new User({
        telegramId: ctx.from.id,
        username: ctx.from.username,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
      });
    }

    // Handle referral if present
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer && referrer.telegramId !== ctx.from.id && !user.referredBy) {
        user.referredBy = referrer.telegramId;

        // Update referral statistics
        let referral = await Referral.findOne({ referralCode });
        if (referral) {
          if (!referral.referrals.includes(user.telegramId)) {
            referral.referrals.push(user.telegramId);
            await referral.save();
          }
        }

        // Notify referrer
        try {
          await ctx.telegram.sendMessage(
            referrer.telegramId,
            `🎉 Новый пользователь присоединился по вашей реферальной ссылке: ${
              user.username || "Неизвестно"
            }`
          );
        } catch (e) {
          console.error("Failed to notify referrer:", e);
        }
      }
    }

    // Generate referral code if user doesn't have one
    if (!user.referralCode) {
      user.referralCode = await generateUniqueReferralCode();

      // Create referral record
      const referral = new Referral({
        referralCode: user.referralCode,
        ownerId: user.telegramId,
        referrals: [],
      });
      await referral.save();
    }

    await user.save();
    return user;
  } catch (error) {
    console.error("Error processing referral:", error);
    throw error;
  }
}

// Function to use in start command
const onStartRef = async (ctx) => {
  try {
    const startPayload = ctx.message.text.split("?")[1];
    const referralCode = startPayload ? startPayload.split("=")[1] : null;

    await processReferral(ctx, referralCode);
    return true;
  } catch (error) {
    console.error("Error in start referral processing:", error);
    return false;
  }
};

// Handler for referral button/command
async function showReferralMenu(ctx) {
  try {
    const user = await User.findOne({ telegramId: ctx.from.id });
    if (!user) {
      return await ctx.reply("Пожалуйста воспользуйтесь командой /start.");
    }

    // Generate or get existing referral code
    if (!user.referralCode) {
      await processReferral(ctx, null);
    }

    // Get bot info and create referral link
    const botInfo = await ctx.telegram.getMe();
    const referralLink = `https://t.me/${botInfo.username}?start?referal=${user.referralCode}`;

    await ctx.reply(
      `🔗 Ваша реферальная ссылка\n\n` +
        `${referralLink}\n\n` +
        `Поделитесь ей с друзьями!\n\n` +
        `Используйте /mystats для проверки статистики вашей реферальной ссылки.`
    );
  } catch (error) {
    console.error("Error showing referral menu:", error);
    await ctx.reply("Извините, произошла ошибка при показе меню рефералов.");
  }
}

async function getReferralStats(ctx) {
  try {
    const user = await User.findOne({ telegramId: ctx.from.id });
    if (!user || !user.referralCode) {
      return await ctx.reply(
        "У вас нет реферальной ссылки. Используйте /referral для получения её."
      );
    }

    const referral = await Referral.findOne({
      referralCode: user.referralCode,
    });
    if (!referral) {
      return await ctx.reply("Не найдено рефералов.");
    }

    const referralCount = referral.referrals.length;
    await ctx.reply(
      `📊 Ваша реферальная статистика:\n\n` +
        `Всего рефералов: ${referralCount}\n` +
        `Ваша реферальная ссылка: ${user.referralCode}`
    );
  } catch (error) {
    console.error("Error getting referral stats:", error);
    await ctx.reply(
      "Извините, произошла ошибка при получении статистики вашей реферальной ссылки."
    );
  }
}

module.exports = {
  onStartRef,
  showReferralMenu,
  getReferralStats,
  processReferral,
};
