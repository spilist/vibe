# Player Stone Selection Feature

## Overview
The Go Stone Flicking Game now supports having all player stones placed on the board initially, allowing the player to select and fire any stone they choose.

## Features

### Multiple Player Stones
- All 5 player stones are placed on the board at the start of the game
- Stones are positioned in a column on the left side of the board
- Each stone can be selected and fired individually

### Stone Selection
- Use the Up/Down arrow keys to cycle through available stones
- Selection is circular (pressing Down on the last stone selects the first one)
- The currently selected stone is highlighted with a red outline
- Only unfired stones can be selected

### Shot Tracking
- Instead of counting "stones left," the game now tracks "shots left"
- Each player has 5 shots total
- A shot is consumed when any stone is fired
- The game ends when all shots are used or all stones are removed

### Stone Management
- All stones remain on the board after firing
- Stones are removed only if they hit a wall
- No concept of "residual stones" - all player stones remain selectable until fired

## Implementation Details

### Stone Selection Algorithm
The game implements a smart selection system that:
- Skips stones that have already been fired
- Automatically selects the next available unfired stone after firing
- Handles cases where stones are removed from the board
- Adjusts selection index when stones are removed to maintain proper selection

### Game Flow
1. All player stones are placed at the start
2. Player selects a stone using Up/Down arrow keys
3. Player aims using Left/Right arrow keys
4. Player fires using Spacebar
5. The selected stone is marked as fired
6. The game automatically selects the next unfired stone
7. The game ends when all shots are used or all stones are gone

## Usage
1. Use Up/Down arrow keys to select the stone you want to fire
2. Use Left/Right arrow keys to aim
3. Press Spacebar to fire the selected stone
4. Continue selecting and firing stones strategically
5. Try to remove as many target stones as possible
