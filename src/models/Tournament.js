class Tournament {
  constructor() {
    this.games = [];
    this.bracket = [];
    this.currentRound = 0;
    this.isActive = false;
    this.winner = null;
    this.eliminatedGames = [];
  }

  addGame(game) {
    // Check if we've hit the max games limit
    if (this.games.length >= 32) {
      return { success: false, message: "Maximum of 32 games allowed!" };
    }

    // Check if game already exists (case insensitive)
    const gameExists = this.games.some(
      (g) => g.toLowerCase() === game.toLowerCase()
    );
    if (gameExists) {
      return { success: false, message: "This game has already been entered!" };
    }

    this.games.push(game);
    return { success: true, message: `Added "${game}" to the tournament!` };
  }

  startTournament() {
    if (this.games.length < 2) {
      return {
        success: false,
        message: "Need at least 2 games to start a tournament!"
      };
    }

    // Shuffle games for random seeding
    const shuffledGames = [...this.games].sort(() => Math.random() - 0.5);

    // Create initial bracket
    this.bracket = [];
    let currentRound = [...shuffledGames];

    while (currentRound.length > 1) {
      const pairs = [];

      // Pair up games
      for (let i = 0; i < currentRound.length; i += 2) {
        if (i + 1 < currentRound.length) {
          pairs.push([currentRound[i], currentRound[i + 1]]);
        } else {
          // Odd number of games - bye for the last one
          pairs.push([currentRound[i], null]);
        }
      }

      this.bracket.push(pairs);

      // Prepare next round
      const nextRound = [];
      for (const pair of pairs) {
        if (pair[1] !== null) {
          // Not a bye - add TBD for winner
          nextRound.push("TBD");
        } else {
          // Bye advances
          nextRound.push(pair[0]);
        }
      }

      currentRound = nextRound;
    }

    // Add final round if we have exactly one game left
    if (currentRound.length === 1 && currentRound[0] !== "TBD") {
      this.bracket.push([[currentRound[0], null]]);
    }

    this.currentRound = 0;
    this.isActive = true;
    this.winner = null;
    this.eliminatedGames = [];

    return { success: true, message: "Tournament started! 🎮" };
  }

  getCurrentMatchups() {
    if (!this.isActive || this.currentRound >= this.bracket.length) {
      return [];
    }
    return this.bracket[this.currentRound];
  }

  advanceWinner(winner, loser) {
    if (!this.isActive || this.currentRound >= this.bracket.length) {
      return {
        success: false,
        message: "No active tournament or invalid round!"
      };
    }

    // Add loser to eliminated games (only if loser is not null)
    if (loser !== null) {
      this.eliminatedGames.push(loser);
    }

    // Update bracket for next round
    if (this.currentRound + 1 < this.bracket.length) {
      const nextRound = this.bracket[this.currentRound + 1];
      for (let i = 0; i < nextRound.length; i++) {
        const pair = nextRound[i];
        if (pair.includes("TBD")) {
          // Replace first TBD with winner
          if (pair[0] === "TBD") {
            this.bracket[this.currentRound + 1][i][0] = winner;
          } else if (pair[1] === "TBD") {
            this.bracket[this.currentRound + 1][i][1] = winner;
          }
          break;
        }
      }
    }

    // Check if current round is complete
    const currentMatchups = this.getCurrentMatchups();
    let completedPairs = 0;

    for (const pair of currentMatchups) {
      if (
        pair[1] === null ||
        this.eliminatedGames.includes(pair[0]) ||
        this.eliminatedGames.includes(pair[1])
      ) {
        completedPairs++;
      }
    }

    if (completedPairs >= currentMatchups.length) {
      this.currentRound++;

      // Check if tournament is complete
      if (this.currentRound >= this.bracket.length) {
        this.isActive = false;
        // Find the winner - check the final round
        const finalRound = this.bracket[this.bracket.length - 1];
        for (const pair of finalRound) {
          if (pair[0] && !this.eliminatedGames.includes(pair[0])) {
            this.winner = pair[0];
            break;
          }
          if (pair[1] && !this.eliminatedGames.includes(pair[1])) {
            this.winner = pair[1];
            break;
          }
        }
      }
    }

    return {
      success: true,
      message: `"${winner}" advances to the next round!`
    };
  }

  reset() {
    this.games = [];
    this.bracket = [];
    this.currentRound = 0;
    this.isActive = false;
    this.winner = null;
    this.eliminatedGames = [];
  }

  getTournamentStatus() {
    if (this.games.length === 0) {
      return "No games entered yet. Type `!add <game name>` to add games!";
    }

    if (!this.isActive) {
      if (this.winner) {
        return `🏆 **Tournament Complete!**\n\nWinner: **${this.winner}**\n\nType \`!reset\` to start a new tournament!`;
      } else {
        return `**Games entered:** ${this.games.length}/32\n\nType \`!start\` to begin the tournament!`;
      }
    }

    const currentMatchups = this.getCurrentMatchups();
    if (currentMatchups.length === 0) {
      return "Tournament in progress...";
    }

    let status = `🎮 **Round ${this.currentRound + 1}** - ${
      currentMatchups.length
    } matchup(s)\n\n`;

    currentMatchups.forEach((pair, index) => {
      const matchNum = index + 1;
      if (pair[1] === null) {
        status += `**Match ${matchNum}:** ${pair[0]} (Bye)\n`;
      } else {
        status += `**Match ${matchNum}:** ${pair[0]} vs ${pair[1]}\n`;
      }
    });

    return status;
  }

  getGamesList() {
    if (this.games.length === 0) {
      return "No games entered yet.";
    }

    return this.games.map((game, index) => `${index + 1}. ${game}`).join("\n");
  }

  // Debug method to help troubleshoot
  getDebugInfo() {
    return {
      games: this.games,
      bracket: this.bracket,
      currentRound: this.currentRound,
      isActive: this.isActive,
      winner: this.winner,
      eliminatedGames: this.eliminatedGames,
      currentMatchups: this.getCurrentMatchups()
    };
  }
}

module.exports = Tournament;
