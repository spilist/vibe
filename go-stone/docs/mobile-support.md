# Mobile Support Features

## Overview

This document outlines the implementation of mobile support features in the Go Stone Flicking Game, making the game fully playable on touch-screen devices such as smartphones and tablets.

## Features

### Touch-Based Stone Selection

- **Tap to Select**: Players can now tap directly on a stone to select it, rather than using keyboard arrow keys.

- **Visual Feedback**: Selected stones are visually highlighted with a red outline, making it clear which stone is currently active.

- **Automatic Filtering**: The touch selection intelligently ignores stones that are currently in motion.

### Mobile Control Buttons

- **Shoot Button**: A large, touch-friendly button for firing the selected stone.

- **Directional Arrows**: Touch buttons for adjusting aim direction to the left or right.

- **Continuous Aiming**: When holding down a directional button, the aim continuously adjusts, providing smooth aiming control.

- **Responsive Design**: Control buttons dynamically resize based on screen size to ensure they're easily tappable on any device.

### Responsive Layout

- **Adaptive UI**: The game interface automatically adjusts to different screen sizes, with specialized layouts for mobile devices.

- **Mobile-First Instructions**: When viewed on mobile devices, the game displays touch-specific instructions instead of keyboard controls.

- **Optimized Header**: The game header reorganizes on smaller screens to maintain usability.

## Technical Implementation

### Touch Event Handling

1. **Canvas Touch Detection**: The game canvas listens for both `click` and `touchstart` events, with touch events being converted to appropriate coordinates.

2. **Prevent Default Behavior**: Touch events have `preventDefault()` called to prevent unwanted scrolling or zooming when interacting with the game.

3. **Coordinate Scaling**: Touch coordinates are properly scaled to account for differences between the canvas's rendered size and its internal dimensions.

### Mobile Controls System

1. **Control Button Events**: Mobile control buttons implement both `click` and `touchstart`/`touchend` events for maximum compatibility.

2. **Continuous Aiming**: Uses `setInterval` to continuously adjust aim direction when a directional button is held down, with proper cleanup on touch release.

3. **Media Queries**: CSS media queries are used to show/hide mobile controls based on screen size.

### Accessibility Considerations

1. **Touch Target Size**: All buttons are sized appropriately for touch (minimum 44×44px) to meet accessibility guidelines.

2. **Touch-action Attribute**: The CSS `touch-action: manipulation` is used to improve responsiveness by disabling browser handling of gestures.

3. **User-select: none**: Prevents text selection when rapidly tapping buttons, improving the user experience.

## Browser Compatibility

The mobile support features have been designed to work across modern browsers, including:

- Safari on iOS
- Chrome on Android
- Firefox on mobile devices
- Mobile Edge browser

## Game Flow on Mobile

1. **Stone Selection**: Tap directly on a non-moving stone to select it.

2. **Aiming**: Use the left and right arrow buttons to adjust the aim direction.

3. **Firing**: Tap the "Shoot" button to fire the selected stone.

4. **Repeat**: Continue selecting and firing stones until all shots are used.

The mobile interface maintains all the same game mechanics as the desktop version, including stone selection, aiming, power management, and scoring.
