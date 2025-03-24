class AudioManager {
  constructor() {
    this.sounds = {};
    this.enabled = this.loadAudioPreference();
    this.setupSounds();
  }

  loadAudioPreference() {
    const savedPref = localStorage.getItem(STORAGE_KEYS.AUDIO_ENABLED);
    return savedPref !== null ? savedPref === 'true' : true; // Default to enabled
  }

  saveAudioPreference(enabled) {
    localStorage.setItem(STORAGE_KEYS.AUDIO_ENABLED, enabled);
    this.enabled = enabled;
  }

  setupSounds() {
    // Initialize all game sounds
    this.sounds = {
      collision: new Audio('sounds/collision.mp3'),
      fall: new Audio('sounds/fall.wav'),
      gainScore: new Audio('sounds/gain-score.wav'),
      tada: new Audio('sounds/tada.mp3'),
      gameOver: new Audio('sounds/game-over.mp3')
    };

    // Set volume for all sounds
    for (const sound of Object.values(this.sounds)) {
      sound.volume = 0.5;
    }
  }

  play(soundName) {
    if (!this.enabled || !this.sounds[soundName]) return;

    // Clone the audio to allow multiple overlapping sounds
    const sound = this.sounds[soundName].cloneNode();
    sound.volume = this.sounds[soundName].volume;
    sound.play().catch(err => {
      // Handle autoplay restrictions gracefully
      console.log('Audio playback was prevented:', err);
    });
  }

  toggleSound() {
    this.enabled = !this.enabled;
    this.saveAudioPreference(this.enabled);
    return this.enabled;
  }

  setSoundEnabled(enabled) {
    this.enabled = enabled;
    this.saveAudioPreference(this.enabled);
  }

  isEnabled() {
    return this.enabled;
  }
}
