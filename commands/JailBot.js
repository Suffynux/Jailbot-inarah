export default {
  name: 'jailbot',
  description: 'Tells you what the jail bot can do',

  async execute(message, args, client) {
    // Ignore if bot
    if (message.author.bot) return;

    await message.reply(`
👮‍♂️ **JailBot - Discord Jail System**

Hey <@${message.author.id}>! I'm your server's JailBot. Here's what I can do:

🔒 **!jail @user** — Sends a user to jail (removes their roles and gives them the Jailed role)

sis  **!jail @user** — Sends a user to jail (removes their roles and gives them the Jailed role)   
🔓 **!free @user** — Frees a user from jail (restores their roles)

📖 **!jailbot** — Shows this help message

📌 Only users with the **Mod** role can use jail/free commands.

⚙️ Everything is configurable in \`config.json\`.
    `);
  }
};
