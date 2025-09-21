const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const config = require("../../config");

// Tournament round management
async function startNextRound(channel, tournament) {
  try {
    const matchups = tournament.getCurrentMatchups();

    if (matchups.length === 0) {
      // Tournament is complete
      const winnerEmbed = new EmbedBuilder()
        .setColor(config.SUCCESS_COLOR)
        .setTitle("🏆 Tournament Complete!")
        .setDescription(
          `**Winner: ${tournament.winner}**\n\nType \`!reset\` to start a new tournament!`
        )
        .setTimestamp();

      await channel.send({ embeds: [winnerEmbed] });
      return;
    }

    // Create polls for each matchup
    for (let i = 0; i < matchups.length; i++) {
      const [game1, game2] = matchups[i];

      if (game2 === null) {
        // Bye - game1 advances automatically
        await tournament.advanceWinner(game1, null);
        continue;
      }

      const pollEmbed = new EmbedBuilder()
        .setColor(config.EMBED_COLOR)
        .setTitle(`🎮 Match ${i + 1} - Round ${tournament.currentRound + 1}`)
        .setDescription(
          `**${game1}** vs **${game2}**\n\nVote for your favorite game!`
        )
        .setFooter({ text: `Poll expires in ${config.POLL_DURATION} seconds` })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`vote_${i}_${game1}_${game2}_1`)
          .setLabel(game1)
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`vote_${i}_${game2}_${game1}_2`)
          .setLabel(game2)
          .setStyle(ButtonStyle.Secondary)
      );

      const pollMessage = await channel.send({
        embeds: [pollEmbed],
        components: [row]
      });

      // Set up button collector to collect all votes
      const collector = pollMessage.createMessageComponentCollector({
        time: config.POLL_DURATION_MS
        // No max limit - collect all votes
      });

      const votes = { [game1]: 0, [game2]: 0 };

      collector.on("collect", async (interaction) => {
        try {
          const parts = interaction.customId.split("_");
          const [action, matchIndex, votedGame, otherGame, buttonNum] = parts;

          // Count the vote
          votes[votedGame]++;

          // Update the poll embed to show current vote count
          const updatedEmbed = new EmbedBuilder()
            .setColor(config.EMBED_COLOR)
            .setTitle(
              `🎮 Match ${i + 1} - Round ${tournament.currentRound + 1}`
            )
            .setDescription(
              `**${game1}** vs **${game2}**\n\nVote for your favorite game!\n\n**Current Votes:**\n${game1}: ${votes[game1]} votes\n${game2}: ${votes[game2]} votes`
            )
            .setFooter({
              text: `Poll expires in ${config.POLL_DURATION} seconds`
            })
            .setTimestamp();

          await interaction.update({
            embeds: [updatedEmbed],
            components: [row]
          });
        } catch (error) {
          console.error("Error handling button interaction:", error);
          try {
            await interaction.reply({
              content:
                "❌ An error occurred while processing your vote. Please try again.",
              ephemeral: true
            });
          } catch (replyError) {
            console.error("Error sending error reply:", replyError);
          }
        }
      });

      collector.on("end", async (collected) => {
        try {
          // Determine winner based on votes
          let winner, loser;

          if (votes[game1] > votes[game2]) {
            winner = game1;
            loser = game2;
          } else if (votes[game2] > votes[game1]) {
            winner = game2;
            loser = game1;
          } else {
            // Tie - randomly pick a winner
            winner = Math.random() < 0.5 ? game1 : game2;
            loser = winner === game1 ? game2 : game1;
          }

          await tournament.advanceWinner(winner, loser);

          const resultEmbed = new EmbedBuilder()
            .setColor(config.SUCCESS_COLOR)
            .setTitle("✅ Match Complete!")
            .setDescription(
              `**Final Votes:**\n${game1}: ${votes[game1]} votes\n${game2}: ${votes[game2]} votes\n\n**${winner}** advances to the next round!`
            )
            .setTimestamp();

          await pollMessage.edit({
            embeds: [resultEmbed],
            components: []
          });
        } catch (error) {
          console.error("Error processing match results:", error);
          try {
            const errorEmbed = new EmbedBuilder()
              .setColor(config.ERROR_COLOR)
              .setTitle("❌ Match Error")
              .setDescription(
                "An error occurred while processing this match. The tournament may need to be reset."
              )
              .setTimestamp();

            await pollMessage.edit({
              embeds: [errorEmbed],
              components: []
            });
          } catch (editError) {
            console.error("Error editing poll message:", editError);
          }
        }
      });
    }

    // Wait for polls to complete, then start next round
    setTimeout(async () => {
      try {
        if (tournament.isActive) {
          await startNextRound(channel, tournament);
        }
      } catch (error) {
        console.error("Error in startNextRound timeout:", error);
        try {
          const errorEmbed = new EmbedBuilder()
            .setColor(config.ERROR_COLOR)
            .setTitle("❌ Tournament Error")
            .setDescription(
              "An error occurred while advancing the tournament. Please use `!reset` to restart."
            )
            .setTimestamp();

          await channel.send({ embeds: [errorEmbed] });
        } catch (sendError) {
          console.error("Error sending error message:", sendError);
        }
      }
    }, config.POLL_DURATION_MS + 2000); // Extra 2 seconds buffer
  } catch (error) {
    console.error("Error in startNextRound:", error);
    try {
      const errorEmbed = new EmbedBuilder()
        .setColor(config.ERROR_COLOR)
        .setTitle("❌ Tournament Error")
        .setDescription(
          "An error occurred while starting the next round. The tournament may need to be reset."
        )
        .setTimestamp();

      await channel.send({ embeds: [errorEmbed] });
    } catch (sendError) {
      console.error("Error sending error message:", sendError);
    }
  }
}

module.exports = { startNextRound };
