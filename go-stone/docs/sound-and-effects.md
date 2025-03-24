# Sound Effects and Visual Feedback

## Overview

This document outlines the implementation of sound effects and visual feedback features in the Go Stone Flicking Game. These features enhance user engagement and provide satisfying feedback for game actions.

## Sound System

### Features

- **Game Action Sounds**:
  - Stone shooting: Plays when a stone is flicked
  - Collision detection: Plays when stones hit other stones
  - Stone falling: Plays when a player stone falls off the board
  - Target scoring: Plays when a target stone falls off the board
  - Game end sounds: Two distinct sounds for regular game over and high score achievements

- **Sound Control**: Players can toggle sounds on/off via a button in the game header.

- **Persistence**: Sound preference is stored in localStorage, ensuring the setting remains consistent between game sessions.

### Implementation Details

- **AudioManager Class**: A dedicated class that handles loading, playing, and managing sound effects.

- **Event Integration**: Sound effects trigger at appropriate moments in the game flow:
  - When stones collide (`collision.mp3`)
  - When a player stone falls off the board (`fall.wav`)
  - When a target stone falls off the board, scoring a point (`gain-score.wav`)
  - When the game ends with a high score (`tada.mp3`)
  - When the game ends without a high score (`game-over.mp3`)

- **Accessibility**: Sound effects are optional and can be toggled off without affecting gameplay.

## Visual Effects

### Features

- **Confetti Effect**: Displays when a player achieves a high score, with visual intensity based on the rank achieved.

- **Rank-Based Styling**: High scores in the leaderboard are visually distinguished based on their rank:
  - 1st place: Gold color, larger text
  - 2nd place: Silver color, medium text
  - 3rd place: Bronze color, slightly enhanced text

- **Dynamic Animation**: The confetti effect uses randomized parameters for a more natural and varied appearance.

### Implementation Details

- **EffectsManager Class**: A dedicated class that handles visual effects creation and animation.

- **Rank-Based Intensity**: Higher ranks (1st place) receive more elaborate visual effects than lower ranks.

- **DOM-Based Animation**: Effects use CSS animations for efficient performance across devices.

## Integration with Game Flow

1. **Stone Flicking**:
   - When a player shoots a stone, a "shoot" sound plays.
   - The sound effect timing aligns with the visual feedback of the stone's movement.

2. **Collisions**:
   - When stones collide, a "collision" sound plays.
   - Multiple overlapping collision sounds are supported for chain reactions.

3. **Stone Falling**:
   - When a player stone falls off the board, a "fall" sound plays.
   - This provides feedback that the stone is no longer in play.

4. **Scoring**:
   - When a target stone falls off the board, a "gain-score" sound plays.
   - This provides positive reinforcement for scoring points.

5. **Game Over**:
   - Two distinct end game sounds:
     - "game-over" for standard game ending
     - "tada" for achieving a high score
   - This occurs simultaneously with the game over screen display.

## Technical Implementation

### Audio System Architecture

1. **Sound Loading**: Sound files are preloaded during initialization to prevent playback delays.

2. **Audio Cloning**: To allow multiple overlapping sounds (e.g., for rapid collisions), the audio elements are cloned before playback.

3. **Volume Control**: All sounds have consistent and appropriate volume levels.

4. **Error Handling**: The system gracefully handles scenarios where audio playback might be prevented by browser policies.

### Visual Effects Implementation

1. **Confetti Generation**: Dynamically created DOM elements with randomized properties:
   - Position, size, color, shape, rotation, and animation duration
   - Different intensities based on score rank

2. **CSS Animation**: Lightweight CSS animations ensure good performance across devices.

3. **Cleanup**: Effects automatically clean up after themselves to prevent memory issues.

## User Controls

1. **Sound Toggle**:
   - A dedicated button in the game header allows toggling sounds on/off.
   - The button text updates to reflect the current state (ON/OFF).
   - The setting is saved to localStorage for persistence.

2. **Visual Indication**:
   - The sound toggle button visually indicates the current state through color changes.
   - ON: Green color
   - OFF: Gray color

## Future Enhancements

Potential enhancements that could be added to the system:

1. **Volume Control**: Allow players to adjust sound volume instead of just toggling on/off.

2. **Additional Feedback**: Add subtle vibration feedback for mobile devices.

3. **Enhanced Visual Effects**: More elaborate animations for exceptional scores.

4. **Sound Themes**: Allow players to select different sound effect sets.

## Sound Credits

The game uses the following sound effects:

- collision.mp3: Stone collision sound
- fall.mp3: Stone falling off the board sound
- gain-score.mp3: Target stone scoring sound
- tada.mp3: High score celebration sound
- game-over.mp3: Regular game ending sound
