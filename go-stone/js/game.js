class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.physics = new PhysicsEngine();
    this.render = Matter.Render.create({
      canvas: canvas,
      engine: this.physics.engine,
      options: {
        width: GAME_CONFIG.CANVAS_WIDTH,
        height: GAME_CONFIG.CANVAS_HEIGHT,
        wireframes: false,
        background: COLORS.BOARD
      }
    });

    this.score = 0;
    this.shotsRemaining = GAME_CONFIG.INITIAL_STONES;
    this.playerStones = [];
    this.selectedStoneIndex = 0;
    this.aimAngle = 0;
    this.isGameOver = false;
    this.power = 0;
    this.powerIncreasing = true;
    this.currentDifficulty = this.loadDifficulty();
    this.waitingForStonesToStop = false;
    this.scoreboard = null;
    this.i18n = null;

    // Disable automatic rendering
    Matter.Render.run(this.render);

    this.setupEventListeners();
    this.setupCollisionDetection();
    this.initializeStones();

    // Start our custom render loop
    this.renderLoop();
  }

  loadDifficulty() {
    const savedDifficulty = localStorage.getItem(STORAGE_KEYS.DIFFICULTY);
    if (savedDifficulty && ['EASY', 'MEDIUM', 'HARD'].includes(savedDifficulty)) {
      return savedDifficulty;
    }
    return 'EASY'; // Default
  }

  saveDifficulty(difficulty) {
    localStorage.setItem(STORAGE_KEYS.DIFFICULTY, difficulty);
    this.currentDifficulty = difficulty;
  }

  getTargetStoneCount() {
    return DIFFICULTY[this.currentDifficulty].targetStones;
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.getElementById('restartButton').addEventListener('click', () => this.restart());
    document.getElementById('restartAfterGameButton').addEventListener('click', () => this.restart());
    document.getElementById('scoreboardButton').addEventListener('click', () => {
      if (this.scoreboard) {
        this.scoreboard.showScoreboard();
      }
    });

    // Add click/touch event for stone selection
    this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
    this.canvas.addEventListener('touchstart', (e) => {
      // Prevent scrolling when interacting with the canvas
      e.preventDefault();
      // Convert touch to click event coordinates
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const clickEvent = {
          clientX: touch.clientX,
          clientY: touch.clientY,
          target: e.target
        };
        this.handleCanvasClick(clickEvent);
      }
    }, { passive: false });

    // Add event listener for shoot button
    const shootButton = document.getElementById('shootButton');
    if (shootButton) {
      shootButton.addEventListener('click', () => this.flickSelectedStone());
      shootButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.flickSelectedStone();
      }, { passive: false });
    }

    // Add event listeners for aim buttons
    const aimLeftButton = document.getElementById('aimLeftButton');
    const aimRightButton = document.getElementById('aimRightButton');

    if (aimLeftButton) {
      aimLeftButton.addEventListener('click', () => this.adjustAim(-0.1));
      aimLeftButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.startContinuousAim(-0.1);
      }, { passive: false });
      aimLeftButton.addEventListener('touchend', () => {
        this.stopContinuousAim();
      });
    }

    if (aimRightButton) {
      aimRightButton.addEventListener('click', () => this.adjustAim(0.1));
      aimRightButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.startContinuousAim(0.1);
      }, { passive: false });
      aimRightButton.addEventListener('touchend', () => {
        this.stopContinuousAim();
      });
    }

    // Difficulty selector
    const difficultySelect = document.getElementById('difficulty');
    difficultySelect.value = this.currentDifficulty;
    difficultySelect.addEventListener('change', (e) => {
      this.saveDifficulty(e.target.value);
      this.restart();
    });
  }

  setScoreboard(scoreboard) {
    this.scoreboard = scoreboard;
  }

  setI18n(i18n) {
    this.i18n = i18n;
  }

  setupCollisionDetection() {
    Matter.Events.on(this.physics.engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;

        // Handle collisions with walls
        if (this.physics.isWall(bodyA) || this.physics.isWall(bodyB)) {
          const stone = this.physics.isWall(bodyA) ? bodyB : bodyA;

          // Target stone hits wall - remove and increment score
          if (stone.label === 'target') {
            this.handleTargetRemoval(stone);
          }
          // Player stone hits wall - remove
          else if (stone.label === 'player') {
            // Remove the stone from our tracked player stones
            const index = this.playerStones.findIndex(s => s === stone);
            if (index !== -1) {
              this.playerStones.splice(index, 1);

              // If the removed stone was the selected one
              if (index === this.selectedStoneIndex) {
                this.selectNextStone();
              } else if (index < this.selectedStoneIndex) {
                // If we removed a stone before the selected one, adjust the index
                this.selectedStoneIndex--;
              }
            }

            this.physics.removeBody(stone);

            // Check if all stones are gone
            if (this.playerStones.length === 0) {
              this.waitingForStonesToStop = true;
            }
          }
          return;
        }

        // Make target stones non-static when hit by player stones
        if (bodyA.label === 'player' && bodyB.label === 'target') {
          Matter.Body.setStatic(bodyB, false);
        } else if (bodyB.label === 'player' && bodyA.label === 'target') {
          Matter.Body.setStatic(bodyA, false);
        }

        // Handle target stone colliding with another target stone
        else if (bodyA.label === 'target' && bodyB.label === 'target') {
          // Make sure both target stones are non-static
          if (bodyA.isStatic) Matter.Body.setStatic(bodyA, false);
          if (bodyB.isStatic) Matter.Body.setStatic(bodyB, false);
        }

        // Handle case where a moving target stone hits a static player stone
        else if (bodyA.label === 'target' && bodyB.label === 'player' && bodyB.isStatic) {
          Matter.Body.setStatic(bodyB, false);
        }
        else if (bodyB.label === 'target' && bodyA.label === 'player' && bodyA.isStatic) {
          Matter.Body.setStatic(bodyA, false);
        }
      });
    });
  }

  renderLoop() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw board background
    this.ctx.fillStyle = COLORS.BOARD;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid
    this.drawGrid();

    // Draw all physics objects
    Matter.Render.world(this.render);

    // Draw the aiming arrow on top if a stone is selected
    this.drawAimArrow();

    // Draw power gauge
    this.drawPowerGauge();

    // Continue the render loop
    requestAnimationFrame(() => this.renderLoop());
  }

  drawGrid() {
    const { CANVAS_WIDTH, CANVAS_HEIGHT, GRID_SIZE, CELL_SIZE } = GAME_CONFIG;
    this.ctx.strokeStyle = COLORS.GRID;
    this.ctx.lineWidth = 1;

    // Draw vertical lines
    for (let i = 0; i <= GRID_SIZE; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * CELL_SIZE, 0);
      this.ctx.lineTo(i * CELL_SIZE, CANVAS_HEIGHT);
      this.ctx.stroke();
    }

    // Draw horizontal lines
    for (let i = 0; i <= GRID_SIZE; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * CELL_SIZE);
      this.ctx.lineTo(CANVAS_WIDTH, i * CELL_SIZE);
      this.ctx.stroke();
    }
  }

  drawAimArrow() {
    // Only draw arrow for the selected stone
    if (this.playerStones.length === 0 || this.selectedStoneIndex >= this.playerStones.length) return;

    const selectedStone = this.playerStones[this.selectedStoneIndex];
    if (!selectedStone) return;

    // Only allow aiming if the stone is not moving and shots remaining
    if (Math.abs(selectedStone.velocity.x) > 0.05 || Math.abs(selectedStone.velocity.y) > 0.05 || this.shotsRemaining <= 0) return;

    const { position } = selectedStone;
    const arrowLength = 40;
    const endX = position.x + Math.cos(this.aimAngle) * arrowLength;
    const endY = position.y + Math.sin(this.aimAngle) * arrowLength;

    // Draw arrow line
    this.ctx.beginPath();
    this.ctx.moveTo(position.x, position.y);
    this.ctx.lineTo(endX, endY);
    this.ctx.strokeStyle = '#FF0000';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Draw arrow head
    const headLength = 10;
    const angle = Math.atan2(endY - position.y, endX - position.x);
    this.ctx.beginPath();
    this.ctx.moveTo(endX, endY);
    this.ctx.lineTo(
      endX - headLength * Math.cos(angle - Math.PI / 6),
      endY - headLength * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.lineTo(
      endX - headLength * Math.cos(angle + Math.PI / 6),
      endY - headLength * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.lineTo(endX, endY);
    this.ctx.fillStyle = '#FF0000';
    this.ctx.fill();

    // Highlight the selected stone
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, GAME_CONFIG.STONE_RADIUS + 2, 0, Math.PI * 2);
    this.ctx.strokeStyle = '#FF0000';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  drawPowerGauge() {
    // Only show power gauge if a stone is selected and not moving
    if (this.playerStones.length === 0 ||
      this.selectedStoneIndex >= this.playerStones.length ||
      this.shotsRemaining <= 0 ||
      this.isGameOver) return;

    const selectedStone = this.playerStones[this.selectedStoneIndex];
    if (!selectedStone || Math.abs(selectedStone.velocity.x) > 0.05 || Math.abs(selectedStone.velocity.y) > 0.05) return;

    // Draw power gauge background
    const gaugeWidth = 100;
    const gaugeHeight = 10;
    const gaugeX = 10;
    const gaugeY = 550;

    this.ctx.fillStyle = 'lightgray';
    this.ctx.fillRect(gaugeX, gaugeY, gaugeWidth, gaugeHeight);

    // Draw power level
    const powerColor = `rgb(${this.power * 255}, 0, ${255 - this.power * 255})`;
    this.ctx.fillStyle = powerColor;
    this.ctx.fillRect(gaugeX, gaugeY, gaugeWidth * this.power, gaugeHeight);
  }

  handleKeyDown(e) {
    if (this.isGameOver || this.waitingForStonesToStop) return;

    switch (e.key) {
      case 'ArrowLeft':
        this.adjustAim(-0.1);
        break;
      case 'ArrowRight':
        this.adjustAim(0.1);
        break;
      case 'ArrowUp':
        this.selectPreviousStone();
        break;
      case 'ArrowDown':
        this.selectNextStone();
        break;
      case ' ':
        this.flickSelectedStone();
        break;
    }
  }

  initializeStones() {
    // Create all player stones at their starting positions
    const { CELL_SIZE } = GAME_CONFIG;
    START_POSITIONS.PLAYER_STONES.forEach(pos => {
      const x = pos.x * CELL_SIZE;
      const y = pos.y * CELL_SIZE;
      const stone = this.physics.createStone(x, y, 'player');
      this.playerStones.push(stone);
    });

    // Create target stones
    this.createTargetStones(this.getTargetStoneCount());

    // Initialize selection to the first stone
    this.selectedStoneIndex = 0;
    this.updateStoneAppearance();

    this.updateUI();
  }

  selectNextStone() {
    if (this.playerStones.length === 0) return;

    // Circular selection - move to next stone or back to the first
    this.selectedStoneIndex = (this.selectedStoneIndex + 1) % this.playerStones.length;

    // Skip stones that are currently moving
    let attempts = 0;
    while (this.isStoneMoving(this.playerStones[this.selectedStoneIndex]) && attempts < this.playerStones.length) {
      this.selectedStoneIndex = (this.selectedStoneIndex + 1) % this.playerStones.length;
      attempts++;
    }

    // Update the visual appearance
    this.updateStoneAppearance();
  }

  selectPreviousStone() {
    if (this.playerStones.length === 0) return;

    // Circular selection - move to previous stone or to the last
    this.selectedStoneIndex = (this.selectedStoneIndex - 1 + this.playerStones.length) % this.playerStones.length;

    // Skip stones that are currently moving
    let attempts = 0;
    while (this.isStoneMoving(this.playerStones[this.selectedStoneIndex]) && attempts < this.playerStones.length) {
      this.selectedStoneIndex = (this.selectedStoneIndex - 1 + this.playerStones.length) % this.playerStones.length;
      attempts++;
    }

    // Update the visual appearance
    this.updateStoneAppearance();
  }

  isStoneMoving(stone) {
    if (!stone) return true;
    return Math.abs(stone.velocity.x) > 0.05 || Math.abs(stone.velocity.y) > 0.05;
  }

  updateStoneAppearance() {
    // Reset all stones to normal color
    this.playerStones.forEach(stone => {
      stone.render.fillStyle = COLORS.PLAYER_STONE;
    });

    // Highlight selected stone if it exists
    if (this.selectedStoneIndex < this.playerStones.length) {
      this.playerStones[this.selectedStoneIndex].render.fillStyle = COLORS.SELECTED_STONE;
    }
  }

  flickSelectedStone() {
    if (this.playerStones.length === 0 ||
      this.selectedStoneIndex >= this.playerStones.length ||
      this.shotsRemaining <= 0) return;

    const selectedStone = this.playerStones[this.selectedStoneIndex];

    // Don't allow firing moving stones
    if (this.isStoneMoving(selectedStone)) return;

    // Use the current power value for the flick
    const speed = this.power * 0.03 + 0.01;
    const force = {
      x: Math.cos(this.aimAngle) * speed,
      y: Math.sin(this.aimAngle) * speed
    };

    Matter.Body.setStatic(selectedStone, false);
    Matter.Body.applyForce(selectedStone, selectedStone.position, force);

    // Decrease shots remaining
    this.shotsRemaining--;

    // Select another stone that's not moving
    this.selectNextNonMovingStone();

    // Update UI
    this.updateUI();

    // Check if we've used all shots
    if (this.shotsRemaining <= 0) {
      this.waitingForStonesToStop = true;
    }
  }

  selectNextNonMovingStone() {
    // Try to find a stone that's not moving
    let found = false;
    let attempts = 0;
    const startIndex = this.selectedStoneIndex;

    while (!found && attempts < this.playerStones.length) {
      this.selectedStoneIndex = (this.selectedStoneIndex + 1) % this.playerStones.length;
      const stone = this.playerStones[this.selectedStoneIndex];
      if (!this.isStoneMoving(stone)) {
        found = true;
      }
      attempts++;
    }

    if (!found) {
      // If all stones are moving, just keep the current selection
      this.selectedStoneIndex = startIndex;
    }

    this.updateStoneAppearance();
  }

  handleTargetRemoval(targetStone) {
    this.physics.removeBody(targetStone);
    this.score++;
    this.updateUI();
  }

  updateUI() {
    document.getElementById('score').textContent = this.score;
    document.getElementById('stones-left').textContent = this.shotsRemaining;
  }

  endGame() {
    this.isGameOver = true;
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('finalScore').textContent = this.score;

    // Check if this is a high score
    if (this.scoreboard && this.scoreboard.isHighScore(this.currentDifficulty, this.score)) {
      document.getElementById('highScoreForm').style.display = 'block';
    } else {
      document.getElementById('highScoreForm').style.display = 'none';
    }
  }

  restart() {
    this.resetGame();
    this.initializeStones();
  }

  resetGame() {
    this.physics.clearWorld();
    this.score = 0;
    this.shotsRemaining = GAME_CONFIG.INITIAL_STONES;
    this.playerStones = [];
    this.selectedStoneIndex = 0;
    this.aimAngle = 0;
    this.isGameOver = false;
    this.waitingForStonesToStop = false;
    document.getElementById('gameOver').style.display = 'none';
    this.updateUI();
  }

  createTargetStones(count) {
    const { CELL_SIZE } = GAME_CONFIG;

    // Generate random positions for target stones (right half of the board)
    const positions = this.generateRandomPositions(count);

    // Create stones at those positions
    positions.forEach(pos => {
      const x = pos.x * CELL_SIZE;
      const y = pos.y * CELL_SIZE;
      this.physics.createStone(x, y, 'target');
    });
  }

  generateRandomPositions(count) {
    const { GRID_SIZE } = GAME_CONFIG;
    const positions = [];
    const minX = Math.floor(GRID_SIZE / 2); // Right half of the board
    const maxX = GRID_SIZE - 1;
    const minY = 1;
    const maxY = GRID_SIZE - 2;

    // Helper to check if a position is already taken
    const isPositionTaken = (x, y) => {
      return positions.some(pos => pos.x === x && pos.y === y);
    };

    // Generate unique random positions
    for (let i = 0; i < count; i++) {
      let x, y;
      let attempts = 0;
      const maxAttempts = 100; // Prevent infinite loop

      do {
        x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
        y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
        attempts++;
      } while (isPositionTaken(x, y) && attempts < maxAttempts);

      // If we couldn't find a unique position, break
      if (attempts >= maxAttempts) break;

      positions.push({ x, y });
    }

    return positions;
  }

  update() {
    if (this.isGameOver) return;

    // Update power gauge fluctuation
    this.updatePowerGauge();

    // Check if we need to end the game
    if (this.waitingForStonesToStop) {
      const areAllStonesStatic = this.areAllStonesStatic();
      if (areAllStonesStatic && !this.isGameOver) {
        this.endGame();
      }
    }
  }

  areAllStonesStatic() {
    // Check if all stones have stopped moving
    const movingStones = this.playerStones.filter(stone =>
      !stone.isStatic &&
      (Math.abs(stone.velocity.x) > 0.05 || Math.abs(stone.velocity.y) > 0.05)
    );

    return movingStones.length === 0;
  }

  updatePowerGauge() {
    if (this.powerIncreasing) {
      this.power += 0.01;
      if (this.power >= 1) {
        this.powerIncreasing = false;
      }
    } else {
      this.power -= 0.01;
      if (this.power <= 0) {
        this.powerIncreasing = true;
      }
    }
  }

  // Helper methods for continuous aiming on mobile
  startContinuousAim(step) {
    this.stopContinuousAim(); // Clear any existing interval
    this.aimInterval = setInterval(() => {
      this.adjustAim(step);
    }, 50); // Adjust every 50ms
  }

  stopContinuousAim() {
    if (this.aimInterval) {
      clearInterval(this.aimInterval);
      this.aimInterval = null;
    }
  }

  adjustAim(step) {
    if (this.isGameOver || this.waitingForStonesToStop) return;
    this.aimAngle = (this.aimAngle + step) % (2 * Math.PI);
  }

  handleCanvasClick(e) {
    if (this.isGameOver || this.waitingForStonesToStop) return;

    // Get canvas-relative coordinates
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Scale coordinates if canvas is rendered at a different size than its internal dimensions
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;

    // Find the clicked stone
    for (let i = 0; i < this.playerStones.length; i++) {
      const stone = this.playerStones[i];
      const distance = Math.sqrt(
        Math.pow(stone.position.x - canvasX, 2) +
        Math.pow(stone.position.y - canvasY, 2)
      );

      // If click is within the stone radius and stone isn't moving
      if (distance <= GAME_CONFIG.STONE_RADIUS * 1.5 && !this.isStoneMoving(stone)) {
        this.selectedStoneIndex = i;
        this.updateStoneAppearance();
        return;
      }
    }
  }
}
