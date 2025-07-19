export default {
  name: 'inarah',
  description: 'Tells you what the jail bot can do',

  async execute(message, args, client) {
    // Ignore if bot
    if (message.author.bot) return;

    await message.reply(`
👮‍♀️ **Inarah Guard - Discord Jail System**

Hey <@${message.author.id}>! I'm Inarah Guard, here to help maintain order in the server. Here’s what I can do:

🔒 **!jailm @user** — Sends a user to Male Jail (removes all roles and gives them the **Jailed-Bro** role)

🔒 **!jailf @user** — Sends a user to Female Jail (removes all roles and gives them the **Jailed-Sis** role)

🔒 **!break @user** — Sends a user to the Break Room (removes all roles and gives them the **Break** role)

🔓 **!free @user** — Frees a user from jail or break (restores all previous roles)

📖 **!inarah** — Shows this help message

📌 Only users with the **Mod** role can use these commands.

⚠️ Follow the rules, or you'll be spending some time behind bars!
    `);
  }
};
