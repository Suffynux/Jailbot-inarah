// export default {
//   name: 'free',
//   async execute(message, args, client) {
//     const modRoleName = "Mod";
//     const jailRoleName = "Jailed";
//     const logChannelName = "mod-logs";

//     if (!message.member.roles.cache.some(role => role.name === modRoleName)) {
//       return message.reply('❌ You do not have permission to use this command.');
//     }

//     const user = message.mentions.members.first();
//     if (!user) return message.reply("❌ Please mention a jailed user to release.");

//     const jailRole = message.guild.roles.cache.find(r => r.name === jailRoleName);
//     if (!jailRole) return message.reply("❌ Jail role not found.");

//     const savedRoles = client.jailedUsers[user.id];
//     if (!savedRoles) return message.reply("⚠️ No saved roles for this user.");

//     const rolesToAssign = savedRoles.map(id => message.guild.roles.cache.get(id)).filter(Boolean);
//     await user.roles.set(rolesToAssign);

//     delete client.jailedUsers[user.id];

//     const logChannel = message.guild.channels.cache.find(c => c.name === logChannelName);
//     if (logChannel) {
//       logChannel.send(`🔓 **${user.user.tag}** was released by **${message.author.tag}**.`);
//     }

//     message.channel.send(`✅ ${user.user.tag} has been released.`);
//   }
// };


import fs from 'fs';
import path from 'path';

export default {
  name: 'free',
  async execute(message, args, client) {
    const modRoleName = "Mod";
    const jailRoleName = "Jailed";
    const logChannelName = "mod-logs";

    // Check if user has mod role
    if (!message.member.roles.cache.some(role => role.name === modRoleName)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const user = message.mentions.members.first();
    if (!user) return message.reply("❌ Please mention a jailed user to release.");

    // Load jailedUsers.json data
    const jailedPath = path.resolve('./data/jailedUsers.json');
    let jailedData = {};
    try {
      if (fs.existsSync(jailedPath)) {
        const raw = fs.readFileSync(jailedPath, 'utf8');
        jailedData = JSON.parse(raw);
      }
    } catch (err) {
      console.error('Failed to load jailed users:', err);
      return message.reply("⚠️ Error loading jailed data.");
    }

    const savedRoles = jailedData[user.id];
    if (!savedRoles || savedRoles.length === 0) {
      return message.reply("⚠️ No saved roles found for this user.");
    }

    // Remove jail role
    const jailRole = message.guild.roles.cache.find(r => r.name === jailRoleName);
    if (jailRole && user.roles.cache.has(jailRole.id)) {
      await user.roles.remove(jailRole);
    }

    // Restore original roles
    const rolesToAdd = savedRoles
      .map(roleId => message.guild.roles.cache.get(roleId))
      .filter(role => role !== undefined);

    await user.roles.add(rolesToAdd);

    // Clean up jailedUsers.json
    delete jailedData[user.id];
    try {
      fs.writeFileSync(jailedPath, JSON.stringify(jailedData, null, 2));
    } catch (err) {
      console.error('Failed to update jailedUsers file:', err);
    }

    // Logging
    const logChannel = message.guild.channels.cache.find(c => c.name === logChannelName);
    if (logChannel) {
      logChannel.send(`🔓 **${user.user.tag}** was released by **${message.author.tag}**.`);
    }

    message.channel.send(`✅ ${user.user.tag} has been released and previous roles restored.`);
  }
};
