class EffectsManager {
  constructor() {
    this.setupContainer();
  }

  setupContainer() {
    // Create container for confetti if it doesn't exist
    let container = document.querySelector('.confetti-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'confetti-container';
      document.body.appendChild(container);
    }
    this.container = container;
  }

  showConfetti(intensity = 2) {
    // Clear any existing confetti
    this.container.innerHTML = '';

    // Create confetti based on intensity (1-3)
    const confettiCount = 50 * intensity;
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f', '#ff5722', '#e91e63', '#9c27b0'];

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';

      // Random initial position
      const x = Math.random() * 100;
      confetti.style.left = `${x}%`;
      confetti.style.top = '-10px';

      // Random size
      const size = Math.random() * 6 + 4;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;

      // Random shape (square, circle, rectangle)
      const shapes = ['', '50%', '0 50%'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      if (shape) confetti.style.borderRadius = shape;

      // Random color
      const color = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.backgroundColor = color;

      // Random rotation
      const rotation = Math.random() * 360;
      confetti.style.transform = `rotate(${rotation}deg)`;

      // Random animation duration
      const duration = (Math.random() * 2 + 2) * (4 - intensity); // Faster for higher ranks
      confetti.style.animationDuration = `${duration}s`;

      this.container.appendChild(confetti);
    }

    // Clean up confetti after animation completes
    setTimeout(() => {
      this.container.innerHTML = '';
    }, 6000);
  }

  applyRankStyling(element, rank) {
    if (rank >= 1 && rank <= 3) {
      element.classList.add(`rank-${rank}`);
    }
  }

  showHighScoreEffect(rank) {
    // Show confetti with intensity based on rank
    const intensity = rank <= 3 ? 4 - rank : 1;
    this.showConfetti(intensity);

    // Highlight the score row
    setTimeout(() => {
      const scoreRows = document.querySelectorAll('#scoreTableBody tr');
      if (scoreRows.length >= rank) {
        const rowToHighlight = scoreRows[rank - 1];
        rowToHighlight.style.animation = 'highlight 1s ease-in-out 3';
      }
    }, 500);
  }
}
