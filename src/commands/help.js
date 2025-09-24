const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

async function handleHelpCommand(message) {
  const helpEmbed = new EmbedBuilder()
    .setColor(config.EMBED_COLOR)
    .setTitle("🎮 Game Decider Bot Commands")
    .setDescription(
      `
**!add <game name>** - Add a game to the tournament
**!games** or **!list** - List all entered games
**!start** - Start the tournament
**!status** - Check tournament status
**!reset** - Reset the tournament
**!elis** - Learn about the plumpest pig at the farm

**🎵 Voice Commands:**
**!enter** - Join your voice channel
**!leave** - Leave voice channel
**!boop <sound>** - Play a sound (e.g., !boop kurt)
**!sounds** - List available sounds

**!help** - Show this help message

**How it works:**
1. Add games using \`!add <game name>\`
2. Start the tournament with \`!start\`
3. Vote on matchups using the polls
4. The bot will automatically advance winners
5. Continue until one game remains!
        `
    )
    .setTimestamp();

  await message.reply({ embeds: [helpEmbed] });
}

module.exports = { handleHelpCommand };
