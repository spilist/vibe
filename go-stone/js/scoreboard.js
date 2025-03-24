class Scoreboard {
  constructor() {
    this.scores = {
      EASY: this.loadScores(STORAGE_KEYS.SCORES_EASY),
      MEDIUM: this.loadScores(STORAGE_KEYS.SCORES_MEDIUM),
      HARD: this.loadScores(STORAGE_KEYS.SCORES_HARD)
    };

    this.currentDifficulty = 'EASY';
    this.i18n = null;
    this.audio = null;
    this.effects = null;
    this.setupEventListeners();
  }

  setI18n(i18n) {
    this.i18n = i18n;
  }

  setAudio(audio) {
    this.audio = audio;
  }

  setEffects(effects) {
    this.effects = effects;
  }

  loadScores(storageKey) {
    const scoresJson = localStorage.getItem(storageKey);
    if (scoresJson) {
      return JSON.parse(scoresJson);
    }
    return [];
  }

  saveScores(difficulty) {
    const storageKey = this.getDifficultyStorageKey(difficulty);
    localStorage.setItem(storageKey, JSON.stringify(this.scores[difficulty]));
  }

  getDifficultyStorageKey(difficulty) {
    switch (difficulty) {
      case 'EASY': return STORAGE_KEYS.SCORES_EASY;
      case 'MEDIUM': return STORAGE_KEYS.SCORES_MEDIUM;
      case 'HARD': return STORAGE_KEYS.SCORES_HARD;
      default: return STORAGE_KEYS.SCORES_EASY;
    }
  }

  addScore(difficulty, name, score) {
    // Create a score entry with name, score, and timestamp
    const scoreEntry = {
      name,
      score,
      date: new Date().toISOString() // Store ISO format for consistent sorting
    };

    this.scores[difficulty].push(scoreEntry);

    // Sort by score (descending)
    this.scores[difficulty].sort((a, b) => b.score - a.score);

    // Determine rank of the new score
    const rank = this.scores[difficulty].findIndex(entry => entry.name === name && entry.score === score) + 1;

    // Keep only top 5
    if (this.scores[difficulty].length > 5) {
      this.scores[difficulty] = this.scores[difficulty].slice(0, 5);
    }

    this.saveScores(difficulty);
    this.displayScores(difficulty);

    if (this.effects && rank > 0) {
      this.effects.showHighScoreEffect(rank);
    }

    return rank;
  }

  isHighScore(difficulty, score) {
    if (this.scores[difficulty].length < 5) {
      return true;
    }

    const lowestScore = this.scores[difficulty][this.scores[difficulty].length - 1]?.score || 0;
    return score > lowestScore;
  }

  displayScores(difficulty) {
    const tableBody = document.getElementById('scoreTableBody');
    tableBody.innerHTML = '';

    this.scores[difficulty].forEach((entry, index) => {
      const row = document.createElement('tr');

      const rankCell = document.createElement('td');
      rankCell.textContent = index + 1;

      const nameCell = document.createElement('td');
      nameCell.textContent = entry.name;

      const scoreCell = document.createElement('td');
      scoreCell.textContent = entry.score;

      const dateCell = document.createElement('td');
      dateCell.textContent = this.i18n ? this.i18n.formatDate(entry.date) : '';

      // Apply rank styling
      if (this.effects && index < 3) {
        this.effects.applyRankStyling(row, index + 1);
      }

      row.appendChild(rankCell);
      row.appendChild(nameCell);
      row.appendChild(scoreCell);
      row.appendChild(dateCell);

      tableBody.appendChild(row);
    });

    // Add empty rows if less than 5 scores
    for (let i = this.scores[difficulty].length; i < 5; i++) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = `<td>${i + 1}</td><td>-</td><td>-</td><td>-</td>`;
      tableBody.appendChild(emptyRow);
    }
  }

  showScoreboard() {
    document.getElementById('scoreboard').style.display = 'block';

    // Set current difficulty to the game's difficulty
    if (game && game.currentDifficulty) {
      this.currentDifficulty = game.currentDifficulty;
    }

    // Update the active tab to reflect the current difficulty
    document.querySelectorAll('.tab-button').forEach(button => {
      button.classList.remove('active');
      if (button.dataset.difficulty === this.currentDifficulty) {
        button.classList.add('active');
      }
    });

    this.displayScores(this.currentDifficulty);
  }

  hideScoreboard() {
    document.getElementById('scoreboard').style.display = 'none';
  }

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', (e) => {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-button').forEach(btn => {
          btn.classList.remove('active');
        });

        // Add active class to clicked tab
        e.target.classList.add('active');

        // Update current difficulty and display corresponding scores
        this.currentDifficulty = e.target.dataset.difficulty;
        this.displayScores(this.currentDifficulty);
      });
    });

    // Close button
    document.getElementById('closeScoreboard').addEventListener('click', () => {
      this.hideScoreboard();
    });

    // Save score button
    document.getElementById('saveScoreButton').addEventListener('click', () => {
      const playerName = document.getElementById('playerName').value.trim() || 'Anonymous';
      const score = parseInt(document.getElementById('finalScore').textContent);
      const difficulty = game.currentDifficulty;

      const rank = this.addScore(difficulty, playerName, score);
      document.getElementById('highScoreForm').style.display = 'none';

      this.showScoreboard();
    });
  }
}
