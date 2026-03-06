/**
 * ====================================================
 *  FORTRESS FIGHTERS — Telegram Bot
 *  Node.js + grammy framework
 * ====================================================
 *  Kurulum:
 *    npm install grammy express
 *
 *  Çalıştır:
 *    BOT_TOKEN=xxx WEBAPP_URL=https://yoursite.com node bot.js
 * ====================================================
 */

const { Bot, InlineKeyboard } = require('grammy');
const express = require('express');

const BOT_TOKEN  = process.env.BOT_TOKEN  || 'YOUR_BOT_TOKEN_HERE';
const WEBAPP_URL = process.env.WEBAPP_URL  || 'https://your-game-url.com';
const PORT       = process.env.PORT        || 3000;

const bot = new Bot(BOT_TOKEN);
const app = express();
app.use(express.json());

// ====================================================
//  /start  —  Karşılama mesajı
// ====================================================
bot.command('start', async (ctx) => {
  const name = ctx.from?.first_name || 'Komutan';

  const keyboard = new InlineKeyboard()
    .webApp('🏰 Oyunu Aç', WEBAPP_URL).row()
    .text('📊 Profilim',   'profile').text('🏆 Liderlik', 'leaderboard').row()
    .text('👥 Klan',       'clan_info').text('🎁 Günlük Ödül', 'daily_reward');

  await ctx.replyWithPhoto(
    { url: 'https://i.imgur.com/ZvJn2qM.png' }, // Replace with your banner
    {
      caption:
`🏰 *Fortress Fighters'a Hoş Geldin, ${name}!*

Kalenizi inşa edin, ordunuzu büyütün ve düşmanlarınızı mağlup edin!

🔹 Binalar inşa et & yükselt
🔹 Farklı asker birimleri eğit  
🔹 PvE savaşlarında ganimet kazan
🔹 Klana katıl ve klan savaşları oyna
🔹 Günlük görevleri tamamla

*⬇️ Aşağıdaki butona tıkla ve oyuna başla!*`,
      parse_mode: 'Markdown',
      reply_markup: keyboard
    }
  );
});

// ====================================================
//  Inline button callbacks
// ====================================================
bot.callbackQuery('profile', async (ctx) => {
  await ctx.answerCallbackQuery();
  // In production: fetch player data from DB using ctx.from.id
  const keyboard = new InlineKeyboard()
    .webApp('🎮 Oyuna Dön', WEBAPP_URL);

  await ctx.reply(
`📊 *Profilin*

👤 İsim: ${ctx.from.first_name}
🆔 ID: \`${ctx.from.id}\`
🏰 Kale: Seviye 1
💪 Güç: 0
🪙 Altın: Oyunda görüntüle
⭐ XP: Oyunda görüntüle

_Tüm detaylar için oyunu aç!_`,
    { parse_mode: 'Markdown', reply_markup: keyboard }
  );
});

bot.callbackQuery('leaderboard', async (ctx) => {
  await ctx.answerCallbackQuery();
  // In production: query your database for top players
  await ctx.reply(
`🏆 *Bu Sezonun Liderleri*

🥇 SavaşKralı — 💪 1,850
🥈 DevirFatihi — 💪 1,620
🥉 GökKılıcı — 💪 1,440
4\\. IşıkSavaşçısı — 💪 1,280
5\\. KaranlıkAvcı — 💪 1,100

_Sıralamana çıkmak için savaşmaya devam et!_`,
    {
      parse_mode: 'MarkdownV2',
      reply_markup: new InlineKeyboard().webApp('⚔️ Savaş', WEBAPP_URL)
    }
  );
});

bot.callbackQuery('clan_info', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
`🛡️ *Klan: Demir Kalkan*

👥 Üyeler: 18 / 30
💪 Toplam Güç: 1,250
⚔️ Kazanılan Savaş: 3
🏆 Sezon: 2

_Klan savaşları her Cuma başlar\\!_`,
    {
      parse_mode: 'MarkdownV2',
      reply_markup: new InlineKeyboard().webApp('🛡️ Klan\'ı Gör', WEBAPP_URL)
    }
  );
});

bot.callbackQuery('daily_reward', async (ctx) => {
  await ctx.answerCallbackQuery('🎁 Günlük ödülün hazır!');
  await ctx.reply(
`🎁 *Günlük Ödül*

Bugünkü ödülün hazır! Oyunu açarak günlük görevleri tamamla:

✅ Giriş yap — 100🪙 + 25 XP
⚔️ 3 savaş kazan — 200🪙 + 50 XP
🏗️ 1 bina yükselt — 150🪙 + 40 XP
🪖 5 asker eğit — 120🪙 + 30 XP`,
    {
      parse_mode: 'Markdown',
      reply_markup: new InlineKeyboard().webApp('📋 Görevleri Gör', WEBAPP_URL)
    }
  );
});

// ====================================================
//  /help
// ====================================================
bot.command('help', async (ctx) => {
  await ctx.reply(
`🎮 *Fortress Fighters — Yardım*

*Komutlar:*
/start — Oyuna başla
/profile — Profil bilgilerin
/leaderboard — Lider tablosu  
/help — Bu mesaj

*Oyun Mekanikleri:*
🏰 Kale — Ana üs, tüm binalar buraya bağlı
⚔️ Kışla — Asker eğitmek için
🌾 Çiftlik — Yiyecek üretir
⛏️ Maden — Altın üretir
🧱 Surlar — Savunma bonusu
🔨 Demirci — Saldırı bonusu

*Savaş:*
Ordunun gücü düşman gücüyle kıyaslanır.
Güçlü ordu = yüksek kazanma şansı!

*Klan:*
Klanına katıl, haftalık savaşlarda puan kazan!`,
    { parse_mode: 'Markdown' }
  );
});

// ====================================================
//  Inline keyboard for share
// ====================================================
bot.command('invite', async (ctx) => {
  const inviteLink = `https://t.me/${ctx.me.username}?start=ref_${ctx.from.id}`;
  await ctx.reply(
`🔗 *Arkadaşlarını Davet Et!*

Bağlantını paylaş ve her başarılı davet için *200🪙 bonus* kazan:

\`${inviteLink}\``,
    { parse_mode: 'Markdown' }
  );
});

// ====================================================
//  Express webhook endpoint (for production)
// ====================================================
app.post(`/webhook/${BOT_TOKEN}`, (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

// ====================================================
//  Serve frontend (static)
// ====================================================
app.use(express.static('frontend'));

// ====================================================
//  Health check
// ====================================================
app.get('/health', (_, res) => res.json({ status: 'ok', game: 'Fortress Fighters' }));

// ====================================================
//  Start
// ====================================================
async function main() {
  // In production: set webhook
  // await bot.api.setWebhook(`https://yourdomain.com/webhook/${BOT_TOKEN}`);

  // In development: use long polling
  console.log('🏰 Fortress Fighters Bot başlatılıyor...');
  app.listen(PORT, () => console.log(`🌐 Server http://localhost:${PORT}`));
  await bot.start();
}

main().catch(console.error);
