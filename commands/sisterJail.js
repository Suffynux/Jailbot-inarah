import { saveJailedData } from '../utils/jailUtils.js';

export default {
  name: 'jailsis',
  async execute(message, args, client) {
    const modRoleName = "Mod";
    const sisterRoleName = "Sis";
    const jailRoleName = "JailedSis";
    const logChannelName = "mod-logs";

    if (!message.member.roles.cache.some(role => role.name === modRoleName)) {
      return message.reply("❌ You don't have permission to use this.");
    }

    const user = message.mentions.members.first();
    if (!user) return message.reply("❌ Please mention a user to jail.");

    if (!user.roles.cache.some(role => role.name === sisterRoleName)) {
      return message.reply("❌ That user doesn't have the Sister role.");
    }

    // Save roles (excluding @everyone and the jail role)
    const originalRoles = user.roles.cache
      .filter(role => role.name !== '@everyone' && role.name !== jailRoleName)
      .map(role => role.id);

    saveJailedData(user.id, originalRoles); // ⬅️ Save roles to JSON

    try {
      // Remove original roles
      await user.roles.remove(originalRoles);

      // Add SisterJailed role
      const jailedRole = message.guild.roles.cache.find(r => r.name === jailRoleName);
      if (!jailedRole) return message.reply("❌ 'SisterJailed' role not found.");
      await user.roles.add(jailedRole);

      // Log to mod-logs
      const logChannel = message.guild.channels.cache.find(c => c.name === logChannelName && c.isTextBased());
      if (logChannel) {
        logChannel.send(`🔒 **${user.user.tag}** was jailed (female) by **${message.author.tag}**.`);
      }

      // DM user
      await user.send("🚫 you have been jailed for talking too much... , you have been jailed in the **female jail**.");
      message.reply(`✅ ${user.user.tag} has been jailed to the female jail.`);
    } catch (err) {
      console.error("❌ Error jailing user:", err);
      message.reply("❌ Something went wrong.");
    }
  }
};
