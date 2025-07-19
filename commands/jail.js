// export default {
//   name: 'jail',
//   async execute(message, args, client) {
//     const modRoleName = "Mod";
//     const jailRoleName = "Jailed";
//     const logChannelName = "mod-logs";

//     if (!message.member.roles.cache.some(role => role.name === modRoleName)) {
//       return message.reply('❌ You do not have permission to use this command.');
//     }

//     const user = message.mentions.members.first();
//     if (!user) return message.reply("❌ Please mention a user to jail.");

//     const reason = args.slice(1).join(' ') || "No reason provided.";

//     const jailRole = message.guild.roles.cache.find(r => r.name === jailRoleName);
//     if (!jailRole) return message.reply("❌ Jail role not found.");

//     const currentRoles = user.roles.cache.map(role => role.id).filter(id => id !== message.guild.id);
//     client.jailedUsers[user.id] = currentRoles;

//     await user.roles.set([jailRole]);

//     const logChannel = message.guild.channels.cache.find(c => c.name === logChannelName);
//     if (logChannel) {
//       logChannel.send(`🔒 **${user.user.tag}** was jailed by **${message.author.tag}**.\n📝 Reason: ${reason}`);
//     }

//     message.channel.send(`✅ ${user.user.tag} has been jailed.`);
//   }
// };


// import { saveJailedData } from '../utils/jailUtils.js';

// export default {
//   name: 'jail',
//   async execute(message, args, client) {
//     // Check if user has permission
//     if (!message.member.roles.cache.some(role => role.name === "Mod")) {
//       return message.reply("❌ You don't have permission to use this command.");
//     }

//     const target = message.mentions.members.first();
//     if (!target) {
//       return message.reply("⚠️ Please mention a valid user to jail.");
//     }

//     const jailRole = message.guild.roles.cache.find(r => r.name === "Jailed");
//     if (!jailRole) return message.reply("❌ 'Jailed' role not found.");

//     // Save current roles (except @everyone and Jailed)
//     const rolesToSave = target.roles.cache
//       .filter(role => role.name !== '@everyone' && role.name !== 'Jailed')
//       .map(role => role.id);

//     // Store in jailedUsers.json
//     saveJailedData(target.id, rolesToSave);

//     // Remove current roles and assign jail
//     await target.roles.set([jailRole]);

//     return message.channel.send(`🚫 <@${target.id}> has been jailed.`);
//   }
// };




import { saveJailedData } from '../utils/jailUtils.js';

export default {
  name: 'jailmale',
  async execute(message, args, client) {
    // Check if user has permission
    if (!message.member.roles.cache.some(role => role.name === "Mod")) {
      return message.reply("❌ You don't have permission to use this command.");
    }

    const target = message.mentions.members.first();
    if (!target) {
      return message.reply("⚠️ Please mention a valid user to jail.");
    }

    const jailRole = message.guild.roles.cache.find(r => r.name === "Jailed");
    if (!jailRole) return message.reply("❌ 'Jailed' role not found.");

    const logChannel = message.guild.channels.cache.find(ch => ch.name === "mod-log");
    if (!logChannel) {
      console.warn("⚠️ 'mod-logs' channel not found. Skipping log.");
    }

    // Save current roles (except @everyone and Jailed)
    const rolesToSave = target.roles.cache
      .filter(role => role.name !== '@everyone' && role.name !== 'Jailed')
      .map(role => role.id);

    // Store in jailedUsers.json
    saveJailedData(target.id, rolesToSave);

    // Remove all current roles and assign only Jailed
    await target.roles.set([jailRole]);

    // Confirmation in the current channel
    await message.channel.send(`🚫 <@${target.id}> has been jailed.`);

    // Send log to mod-logs channel
    if (logChannel) {
      logChannel.send(`📛 <@${target.id}> has been **jailed** by <@${message.author.id}>.`);
    }
  }
};
