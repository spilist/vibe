document.addEventListener('DOMContentLoaded', function () {
  // Initialize i18n first so translations are available
  const i18n = window.i18n = new I18n();

  // Initialize audio and effects
  const audio = window.audio = new AudioManager();
  const effects = window.effects = new EffectsManager();

  const canvas = document.getElementById('gameCanvas');

  // Initialize the game
  const game = window.game = new Game(canvas);

  // Initialize the scoreboard and connect all components
  const scoreboard = window.scoreboard = new Scoreboard();

  // Connect all components
  game.setScoreboard(scoreboard);
  game.setI18n(i18n);
  game.setAudio(audio);
  game.setEffects(effects);

  scoreboard.setI18n(i18n);
  scoreboard.setAudio(audio);
  scoreboard.setEffects(effects);

  // Set up sound toggle button
  const soundToggleButton = document.getElementById('soundToggleButton');
  soundToggleButton.textContent = i18n.getTranslation(audio.isEnabled() ? 'soundOn' : 'soundOff');
  soundToggleButton.addEventListener('click', () => {
    const enabled = audio.toggleSound();
    soundToggleButton.textContent = i18n.getTranslation(enabled ? 'soundOn' : 'soundOff');
    soundToggleButton.classList.toggle('muted', !enabled);
  });

  // Game update loop
  function update() {
    game.update();
    requestAnimationFrame(update);
  }

  // Start the update loop
  requestAnimationFrame(update);
});
