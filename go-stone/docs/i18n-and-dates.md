# Internationalization and Date Format Features

## Overview

This document describes the implementation of two new features in the Go Stone Flicking Game: internationalization (i18n) support for English and Korean languages, and date/time display in the scoreboard.

## Internationalization (i18n)

### Features

- **Multi-language Support**: The game now supports both English and Korean languages with a seamless switching mechanism.

- **Persistent Language Selection**: The user's language preference is stored in localStorage, ensuring it remains the same between game sessions.

- **Translation Coverage**: All UI elements including buttons, labels, instructions, and messages are translated.

- **User Interface**: A language dropdown selector in the game header allows players to switch between languages at any time without restarting the game.

### Implementation Details

- **Translation System**: A central `TRANSLATIONS` object in `constants.js` contains all text strings in both languages, organized by language code and string key.

- **I18n Class**: A dedicated `I18n` class handles language loading, switching, and text translation.

- **DOM Integration**: HTML elements use `data-i18n` attributes to mark text that needs translation, allowing for easy identification and updates.

- **Storage**: The current language setting is saved using the key `gostone_language` in localStorage.

## Date and Time in Scoreboard

### Features

- **Timestamp Recording**: Each score entry now includes a timestamp showing when the score was achieved.

- **Formatted Display**: Dates are displayed in a readable format (DD-MM-YY HH:MM for English, YY-MM-DD HH:MM for Korean).

- **Language-aware Formatting**: Date format changes based on the selected language to match cultural conventions.

### Implementation Details

- **Storage Format**: Dates are stored in ISO format in the score entries for consistent sorting and internationalization.

- **Display Formatting**: The I18n class includes a `formatDate()` method that formats dates according to the current language preference.

- **Scoreboard Integration**: The scoreboard table now includes a date column, showing when each high score was achieved.

## Integration between Features

- The date formatting respects the currently selected language, changing format when the language is switched.
- The scoreboard display is updated in real-time when language is changed.
- All new features maintain compatibility with existing difficulty levels and scoring systems.

## Technical Implementation

### I18n System Architecture

1. **Translation Keys**: Each translatable text element is assigned a key in the `TRANSLATIONS` object.

2. **HTML Markup**: Elements containing text use the `data-i18n` attribute with the corresponding translation key.

3. **Translation Process**: The `translatePage()` method scans for all elements with `data-i18n` attributes and replaces their content with the appropriate translation.

4. **Language Switching**: When the language is changed, all UI text is dynamically updated without page refresh.

### Date Handling

1. **Storage**: Timestamps are stored in ISO format to ensure proper sorting and language-independent storage.

2. **Formatting**: Dates are formatted at display time according to language preference.

3. **Input**: Timestamps are automatically generated when a score is saved, capturing the exact moment of achievement.

## Usage

1. **Change Language**:
   - Select your preferred language (English or Korean) from the dropdown in the game header.
   - All UI text will immediately update to the selected language.

2. **View Score Dates**:
   - Open the scoreboard by clicking the "Scoreboard" button.
   - Each high score entry includes the date and time when it was achieved.
   - Date format changes automatically when language is switched.
