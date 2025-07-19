export default {
  name: 'guardInfo',
  description: 'Tells you what the jail bot can do',

  async execute(message, args, client) {
    // Ignore if bot
    if (message.author.bot) return;

    await message.reply(`
👮‍♂️ **JailBot - Discord Jail System**

Hey <@${message.author.id}>! I'm your server's JailBot. Here's what I can do:

🔒 **!malejail @user** — Sends a male user to jail (removes their roles and gives them the \`Jailed\` role)

🔒 **!femalejail @user** — Sends a female user (with the \`Sis\` role) to the female jail (removes their roles and gives them the \`SisterJailed\` role)

🔓 **!free @user** — Frees a jailed user (restores their roles from backup)

📖 **!guardInfo** — Shows this help message

📌 Only users with the **Mod** role can use jail/free commands.

⚙️ Everything is configurable in \`config.json\`.
    `);
  }
};
