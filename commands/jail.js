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
  name: 'jailbro',
  async execute(message, args, client) {
    const modRoleName = "Mod";
    const brotherRoleName = "Brother";
    const jailRoleName = "JailedBro";
    const breakRoleName = "Break";
    const logChannelName = "mod-log";

    // Check if user has Mod role
    if (!message.member.roles.cache.some(role => role.name === modRoleName)) {
      return message.reply("❌ You don't have permission to use this command.");
    }

    const target = message.mentions.members.first();
    if (!target) {
      return message.reply("⚠️ Please mention a valid user to jail.");
    }

    // Check if target has Brother role
    if (!target.roles.cache.some(role => role.name === brotherRoleName)) {
      return message.reply("❌ That user doesn't have the Brother role.");
    }

    // ❗️Check if user already has Break role
    if (target.roles.cache.some(role => role.name === breakRoleName)) {
      return message.reply("⛔ You cannot jail someone who is currently on a break.");
    }

    const jailRole = message.guild.roles.cache.find(r => r.name === jailRoleName);
    if (!jailRole) return message.reply("❌ 'JailedBro' role not found.");

    const logChannel = message.guild.channels.cache.find(c => c.name === logChannelName && c.isTextBased());
    if (!logChannel) {
      console.warn("⚠️ 'mod-log' channel not found. Skipping log.");
    }

    const reason = args.slice(1).join(' ') || "No reason provided.";

    const rolesToSave = target.roles.cache
      .filter(role => role.name !== '@everyone' && role.name !== jailRoleName)
      .map(role => role.id);

    saveJailedData(target.id, rolesToSave);

    try {
      await target.roles.remove(rolesToSave);
      await target.roles.add(jailRole);

      await target.send(`🚫 You have been jailed in the **male jail** by **${message.author.tag}**.\n**Reason:** ${reason}`);
      await message.reply(`✅ ${target.user.tag} has been jailed to the male jail.\n📌 Reason: ${reason}`);

      if (logChannel) {
        logChannel.send(
          `📛 **${target.user.tag}** was jailed by **${message.author.tag}**.\n📝 **Reason:** ${reason}`
        );
      }
    } catch (err) {
      console.error("❌ Error jailing user:", err);
      message.reply("❌ Something went wrong while jailing the user.");
    }
  }
};
