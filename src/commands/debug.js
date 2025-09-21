const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

async function handleDebugCommand(message, tournament) {
  const debugInfo = tournament.getDebugInfo();

  const debugEmbed = new EmbedBuilder()
    .setColor(config.EMBED_COLOR)
    .setTitle("🐛 Tournament Debug Info")
    .setDescription(
      `
**Games:** ${debugInfo.games.length}
**Current Round:** ${debugInfo.currentRound}
**Is Active:** ${debugInfo.isActive}
**Winner:** ${debugInfo.winner || "None"}
**Eliminated:** ${debugInfo.eliminatedGames.length}
**Current Matchups:** ${debugInfo.currentMatchups.length}

**Bracket Structure:**
\`\`\`json
${JSON.stringify(debugInfo.bracket, null, 2)}
\`\`\`
    `
    )
    .setTimestamp();

  await message.reply({ embeds: [debugEmbed] });
}

module.exports = { handleDebugCommand };
