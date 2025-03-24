const GAME_CONFIG = {
  CANVAS_WIDTH: 600,
  CANVAS_HEIGHT: 600,
  GRID_SIZE: 19,
  CELL_SIZE: 30,
  STONE_RADIUS: 12,
  INITIAL_STONES: 5,
  WALL_THICKNESS: 20,
};

const COLORS = {
  BOARD: '#E6C19D',
  GRID: '#FFFFFF',
  PLAYER_STONE: '#000000',
  SELECTED_STONE: '#333333',
  TARGET_STONE: '#FFF',
  WALL: '#8B4513'
};

const PHYSICS_CONFIG = {
  FRICTION: 0.1,
  RESTITUTION: 0.7,
  DENSITY: 0.001,
  FRICTION_AIR: 0.02
};

// Difficulty levels
const DIFFICULTY = {
  EASY: {
    name: 'EASY',
    targetStones: 15
  },
  MEDIUM: {
    name: 'MEDIUM',
    targetStones: 10
  },
  HARD: {
    name: 'HARD',
    targetStones: 7
  }
};

// Local storage keys
const STORAGE_KEYS = {
  DIFFICULTY: 'gostone_difficulty',
  SCORES_EASY: 'gostone_scores_easy',
  SCORES_MEDIUM: 'gostone_scores_medium',
  SCORES_HARD: 'gostone_scores_hard',
  LANGUAGE: 'gostone_language',
  AUDIO_ENABLED: 'gostone_audio_enabled'
};

// Define positions for all 5 player stones
const START_POSITIONS = {
  PLAYER_STONES: [
    { x: 2, y: 5 },   // Top stone
    { x: 2, y: 8 },   // Upper middle stone
    { x: 2, y: 10 },  // Middle stone
    { x: 2, y: 12 },  // Lower middle stone
    { x: 2, y: 15 }   // Bottom stone
  ]
};

// Translations
const TRANSLATIONS = {
  EN: {
    gameName: "Vibe Go-Stone",
    gameDescription: " is a simple game to play with my 7-year-old daughter. Created in 4 hours of vibe coding.",
    score: "Score",
    difficulty: "Difficulty",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    shotsLeft: "Shots Left",
    scoreboard: "Scoreboard",
    controls: "Use the Up/Down arrow keys to select a stone, Left/Right to aim, and Spacebar to flick",
    restart: "Restart",
    gameOver: "No Stones Left!",
    yourScore: "Your score",
    congrats: "Congratulations! You've earned a high score!",
    enterName: "Enter your name",
    saveScore: "Save Score",
    highScores: "High Scores",
    rank: "Rank",
    name: "Name",
    date: "Date",
    close: "Close",
    language: "Language",
    english: "English",
    korean: "한국어",
    shoot: "Shoot",
    touchHint: "Tap a stone to select it, use arrows to aim, then tap Shoot",
    soundOn: "Sound: ON",
    soundOff: "Sound: OFF"
  },
  KO: {
    gameName: "알까기",
    gameDescription: "는 7살 딸아이와 함께 해보려고 만든 간단한 게임입니다. 첫 Vibe 코딩 프로젝트고 총 4시간 가량 걸렸습니다.",
    score: "점수",
    difficulty: "난이도",
    easy: "쉬움",
    medium: "보통",
    hard: "어려움",
    shotsLeft: "남은 발사",
    scoreboard: "점수판",
    controls: "위/아래 화살표로 돌 선택, 좌/우 화살표로 조준, 스페이스바로 튕기기",
    restart: "재시작",
    gameOver: "남은 바둑알이 없습니다!",
    yourScore: "당신의 점수",
    congrats: "축하합니다! 높은 점수를 기록했습니다!",
    enterName: "이름을 입력하세요",
    saveScore: "점수 저장",
    highScores: "최고 점수",
    rank: "순위",
    name: "이름",
    date: "날짜",
    close: "닫기",
    language: "언어",
    english: "English",
    korean: "한국어",
    shoot: "발사",
    touchHint: "돌을 탭하여 선택하고, 화살표로 조준한 후 발사 버튼을 탭하세요",
    soundOn: "소리: 켜기",
    soundOff: "소리: 끄기"
  }
};
