import { saveJailedData } from '../utils/jailUtils.js';

export default {
  name: 'jailsis',
  async execute(message, args, client) {
    const modRoleName = "Mod";
    const sisterRoleName = "Sister";
    const jailRoleName = "JailedSis";
    const logChannelName = "mod-log";

    if (!message.member.roles.cache.some(role => role.name === modRoleName)) {
      return message.reply("❌ You don't have permission to use this.");
    }

    const user = message.mentions.members.first();
    if (!user) return message.reply("❌ Please mention a user to jail.");

    if (!user.roles.cache.some(role => role.name === sisterRoleName)) {
      return message.reply("❌ That user doesn't have the Sister role.");
    }

    // Extract the reason
    const reason = args.slice(1).join(" ") || "No reason provided.";

    // Save roles (excluding @everyone and jail role)
    const originalRoles = user.roles.cache
      .filter(role => role.name !== '@everyone' && role.name !== jailRoleName)
      .map(role => role.id);

    saveJailedData(user.id, originalRoles); // Save roles to JSON

    try {
      // Remove original roles
      await user.roles.remove(originalRoles);

      // Add jail role
      const jailedRole = message.guild.roles.cache.find(r => r.name === jailRoleName);
      if (!jailedRole) return message.reply("❌ 'JailedSis' role not found.");
      await user.roles.add(jailedRole);

      // DM user with reason
      await user.send(`🚫 You have been jailed in the **female jail**.\n\n**Reason:** ${reason}`);

      // Confirmation message
      message.reply(`✅ ${user.user.tag} has been jailed to the female jail.`);

      // Log to mod-log
      const logChannel = message.guild.channels.cache.find(
        c => c.name === logChannelName && c.isTextBased()
      );
      if (logChannel) {
        logChannel.send(
          `📛 **${user.user.tag}** was jailed (female) by **${message.author.tag}**.\n**Reason:** ${reason}`
        );
      }
    } catch (err) {
      console.error("❌ Error jailing user:", err);
      message.reply("❌ Something went wrong.");
    }
  }
};
