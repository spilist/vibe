# Go Stone Flicking Game Test Cases

## Game Environment Tests
1. **Go Board Rendering**
   - ✅ A 19x19 grid go board is displayed
   - ✅ Grid lines are visible
   - ✅ The board is surrounded by walls

## Stone Tests
1. **Player Stone (Black)**
   - ✅ Positioned at starting point before flicking
   - ✅ Moves according to physics rules after being flicked
   - ✅ Converted to residual stone when it touches a wall
   - ✅ Converted to residual stone when it comes to a complete stop

2. **Target Stones (White)**
   - ✅ Initially placed at specific positions
   - ✅ Can be moved when hit by another stone
   - ✅ Are removed when they touch a wall
   - ✅ Each removed target stone increases the score

3. **Residual Stones**
   - ✅ Player stones remain on the board as residual stones after stopping
   - ✅ Residual stones can collide with other stones
   - ✅ Residual stones are removed when they touch a wall

## Game Mechanics Tests
1. **Flicking System**
   - ✅ Arrow keys adjust flick direction
   - ✅ Aiming arrow is displayed
   - ✅ Power is determined by an automatically fluctuating gauge
   - ✅ Spacebar is used to flick the stone

2. **Physics Simulation**
   - ✅ Realistic collision between stones
   - ✅ Wall interactions work properly
   - ✅ Friction and restitution are properly simulated

3. **Scoring and Counting**
   - ✅ Score increases when target stone is removed
   - ✅ Limited number of stones to flick
   - ✅ Game ends when all stones are used

## UI Tests
1. **Canvas and Display**
   - ✅ Game renders on a 570x570 pixel canvas
   - ✅ Go board grid, stones, and UI elements are displayed

2. **UI Elements**
   - ✅ Power gauge visualizes the flick power in real-time
   - ✅ Aiming arrow indicates the flick direction
   - ✅ Status display shows remaining stone count and current score
   - ✅ Game over message displays the final score when the game ends

## Sequence Tests
1. **Game Flow**
   - ✅ New player stone appears only after previous stone stops or is removed
   - ✅ Target stones stay in place until hit
   - ✅ Game over screen appears when all stones are used
