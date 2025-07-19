import { saveJailedData } from '../utils/jailUtils.js';

export default {
  name: 'break',
  async execute(message, args, client) {
    const modRoleName = "Mod";
    const breakRoleName = "Break";
    const logChannelName = "mod-log";

    // Check if user has Mod role
    if (!message.member.roles.cache.some(role => role.name === modRoleName)) {
      return message.reply("❌ You don't have permission to use this command.");
    }

    const target = message.mentions.members.first();
    if (!target) {
      return message.reply("⚠️ Please mention a valid user to send on break.");
    }

    const breakRole = message.guild.roles.cache.find(r => r.name === breakRoleName);
    if (!breakRole) return message.reply("❌ 'Break' role not found.");

    const logChannel = message.guild.channels.cache.find(c => c.name === logChannelName && c.isTextBased());
    if (!logChannel) {
      console.warn("⚠️ 'mod-log' channel not found. Skipping log.");
    }

    // Extract reason
    const reason = args.slice(1).join(' ') || "No reason provided.";

    // Save all roles (excluding @everyone and Break)
    const rolesToSave = target.roles.cache
      .filter(role => role.name !== '@everyone' && role.name !== breakRoleName)
      .map(role => role.id);

    saveJailedData(target.id, rolesToSave); // Optional: track this in case of future restoration

    try {
      // Remove all roles and add Break role
      await target.roles.remove(rolesToSave);
      await target.roles.add(breakRole);

      // DM the user
      await target.send(`🛑 You have been put on a **Break** by **${message.author.tag}**.\n**Reason:** ${reason}`);

      // Confirmation in current channel
      await message.reply(`✅ ${target.user.tag} has been sent on a break.\n📌 Reason: ${reason}`);

      // Log to mod-log
      if (logChannel) {
        logChannel.send(
          `🟡 **${target.user.tag}** was put on a break by **${message.author.tag}**.\n📝 **Reason:** ${reason}`
        );
      }
    } catch (err) {
      console.error("❌ Error sending user on break:", err);
      message.reply("❌ Something went wrong while applying the break.");
    }
  }
};
