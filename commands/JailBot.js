export default {
  name: 'inarah',
  description: 'Tells you what the jail bot can do',

  async execute(message, args, client) {
    // Ignore if bot
    if (message.author.bot) return;

    await message.reply(`
👮‍♂️ **JailBot - Discord Jail System**

Hey <@${message.author.id}>! I'm your server's JailBot. Here's what I can do:

🔒 **!jailbro @user** — Sends a user to jail (removes their roles and gives them the Jailed role)

  **!jailsis @user** — Sends a female user to jail (removes their roles and gives them the Jailed role)   
🔓 **!free @user** — Frees a user from jail (restores their roles)

📖 **!inarah** — Shows this help message

📌 Only users with the **Mod** role can use jail/free commands.

⚙️ Everything is configurable in \`config.json\`.
    `);
  }
};
