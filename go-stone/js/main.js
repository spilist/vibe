document.addEventListener('DOMContentLoaded', function () {
  // Initialize i18n first so translations are available
  const i18n = window.i18n = new I18n();

  const canvas = document.getElementById('gameCanvas');

  // Initialize the game
  const game = window.game = new Game(canvas);

  // Initialize the scoreboard and connect to game and i18n
  const scoreboard = window.scoreboard = new Scoreboard();
  game.setScoreboard(scoreboard);
  game.setI18n(i18n);
  scoreboard.setI18n(i18n);

  // Game update loop
  function update() {
    game.update();
    requestAnimationFrame(update);
  }

  // Start the update loop
  requestAnimationFrame(update);
});
