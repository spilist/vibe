# Target Stones Customization Feature

## Overview
The Go Stone Flicking Game now supports customizing the number of target stones and their distribution on the game board.

## Features

### Adjustable Target Stone Count
- Users can specify the number of target stones (from 1 to 30)
- The input field validates the entered value to ensure it's within acceptable limits
- Default value is 7 stones

### Random Distribution
- Target stones are randomly distributed across the right half of the board
- The algorithm ensures stones don't overlap
- Distribution creates a unique challenge each time a new game is started

### New Game Button
- The "New Game" button applies the current target stone count setting
- Resets the game state (score, remaining stones, etc.)
- Generates a new random distribution of target stones

## Implementation Details

### Random Position Generation
The game uses a constrained random algorithm to place stones on the board:
- Only places stones on the right half of the board (column 10 and above)
- Ensures stones don't overlap by tracking already occupied positions
- Has a maximum number of attempts to prevent infinite loops
- Handles edge cases like extremely high stone counts gracefully

### Game Reset Process
When starting a new game:
1. The physics world is cleared of all non-wall objects
2. Game state variables are reset (score, stones left, etc.)
3. New target stones are created at random positions
4. A new player stone is positioned at the starting location

## Usage
1. Enter the desired number of target stones in the numeric input
2. Click the "New Game" button
3. The game board will reset with the specified number of randomly distributed target stones
4. Play the game as usual
