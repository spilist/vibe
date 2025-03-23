# Difficulty Levels and Scoreboard

## Overview

This document outlines the implementation of difficulty levels and the scoreboard feature in the Go Stone Flicking Game. These features enhance gameplay by adding progression and competition elements.

## Difficulty Levels

### Features

- **Three Difficulty Levels**:
  - EASY: 15 target stones
  - MEDIUM: 10 target stones
  - HARD: 7 target stones

- **Persistent Settings**: The selected difficulty level is stored in the browser's localStorage, so it remains the same between game sessions.

- **User Interface**: A dropdown selector in the game header allows players to change difficulty levels at any time.

- **Automatic Reset**: When a player changes difficulty, the game automatically restarts with the appropriate number of target stones.

### Implementation Details

- **Storage**: The current difficulty is saved using the key `gostone_difficulty` in localStorage.

- **Configuration**: Difficulty settings are defined in the constants file, allowing for easy modification.

- **Extensibility**: The difficulty system is structured to potentially include other parameters in the future, such as physics configurations or starting positions.

## Scoreboard System

### Features

- **Per-Difficulty Tracking**: Separate high score lists for each difficulty level.

- **Top 5 Scores**: Maintains the five highest scores for each difficulty.

- **User Interface**:
  - Accessible via the "Scoreboard" button in the game header.
  - Tabbed interface to switch between difficulty levels.
  - Shows player name and score for each entry.

- **High Score Entry**:
  - After game over, if the score qualifies as a high score, a form appears.
  - Players can enter their name (or remain "Anonymous").
  - Scores are sorted in descending order.

### Implementation Details

- **Storage**: Scores are saved in localStorage with keys for each difficulty level:
  - `gostone_scores_easy`
  - `gostone_scores_medium`
  - `gostone_scores_hard`

- **Data Structure**: Each score entry contains:
  - `name`: Player's name (string)
  - `score`: Player's score (number)

- **Score Validation**: The `isHighScore` method determines if a score qualifies for the leaderboard.

- **Persistence**: All scores persist between browser sessions.

## Usage

1. **Select Difficulty**:
   - Choose a difficulty from the dropdown menu in the game header.
   - The game will restart with the appropriate number of target stones.

2. **View Scoreboard**:
   - Click the "Scoreboard" button to open the high scores panel.
   - Use the tabs to switch between difficulty levels.
   - Click "Close" to return to the game.

3. **Submit High Score**:
   - Play the game until game over.
   - If your score qualifies, an input field appears.
   - Enter your name and click "Save Score" to add your score to the leaderboard.

## Integration with Game Flow

1. The game checks the current difficulty on startup, defaulting to "EASY" if none is saved.
2. When a game ends, the system checks if the score qualifies for the leaderboard.
3. The scoreboard system manages the storage and display of high scores independently.
4. Player data is saved automatically when a high score is submitted.
