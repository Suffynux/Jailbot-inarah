export default {
  name: 'sisterjail',
  async execute(message, args, client) {
    const modRoleName = "Mod";
    const sisterRoleName = "Sis";
    const jailRoleName = "Jailed";
    const femaleJailChannel = "female-jail"; // channel name
    const logChannelName = "mod-logs";

    // Check if user has permission
    if (!message.member.roles.cache.some(role => role.name === modRoleName)) {
      return message.reply("❌ You don't have permission to use this.");
    }

    const user = message.mentions.members.first();
    if (!user) return message.reply("❌ Please mention a user to jail.");

    // Check if user has the Sister role
    if (!user.roles.cache.some(role => role.name === sisterRoleName)) {
      return message.reply("❌ That user doesn't have the Sister role.");
    }

    // Save user's roles somewhere before removing (for future restore)
    const originalRoles = user.roles.cache.map(role => role.id).filter(id => id !== message.guild.id);
    // Store to your DB or temporary file
    // await saveJailedData(user.id, originalRoles);

    // Remove all roles
    await user.roles.remove(originalRoles);

    // Add Jailed role
    const jailedRole = message.guild.roles.cache.find(r => r.name === jailRoleName);
    if (jailedRole) await user.roles.add(jailedRole);

    // Send to mod-log
    const logChannel = message.guild.channels.cache.find(c => c.name === logChannelName);
    if (logChannel) {
      logChannel.send(`🔒 ${user} was jailed (female) by ${message.author}`);
    }

    
//     // Optional: DM user
//     user.send("You have been jailed in the **female jail** channel.");
  }
};
