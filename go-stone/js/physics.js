class PhysicsEngine {
  constructor() {
    this.engine = Matter.Engine.create();
    // Disable gravity
    this.engine.gravity.y = 0;
    this.engine.gravity.x = 0;

    this.world = this.engine.world;
    this.bodies = [];
    this.walls = [];

    // Create walls
    this.createWalls();

    // Start the physics engine
    Matter.Runner.run(this.engine);
  }

  createWalls() {
    const { CANVAS_WIDTH, CANVAS_HEIGHT, WALL_THICKNESS } = GAME_CONFIG;

    // Create walls with labels for collision detection
    const walls = [
      // Top wall
      Matter.Bodies.rectangle(CANVAS_WIDTH / 2, -WALL_THICKNESS / 2, CANVAS_WIDTH, WALL_THICKNESS, {
        isStatic: true,
        label: 'wall',
        render: { fillStyle: COLORS.WALL }
      }),
      // Bottom wall
      Matter.Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT + WALL_THICKNESS / 2, CANVAS_WIDTH, WALL_THICKNESS, {
        isStatic: true,
        label: 'wall',
        render: { fillStyle: COLORS.WALL }
      }),
      // Left wall
      Matter.Bodies.rectangle(-WALL_THICKNESS / 2, CANVAS_HEIGHT / 2, WALL_THICKNESS, CANVAS_HEIGHT, {
        isStatic: true,
        label: 'wall',
        render: { fillStyle: COLORS.WALL }
      }),
      // Right wall
      Matter.Bodies.rectangle(CANVAS_WIDTH + WALL_THICKNESS / 2, CANVAS_HEIGHT / 2, WALL_THICKNESS, CANVAS_HEIGHT, {
        isStatic: true,
        label: 'wall',
        render: { fillStyle: COLORS.WALL }
      })
    ];

    Matter.World.add(this.world, walls);
    this.bodies.push(...walls);
    this.walls = walls;
  }

  createStone(x, y, type) {
    const { STONE_RADIUS } = GAME_CONFIG;
    const stone = Matter.Bodies.circle(x, y, STONE_RADIUS, {
      friction: PHYSICS_CONFIG.FRICTION,
      restitution: PHYSICS_CONFIG.RESTITUTION,
      density: PHYSICS_CONFIG.DENSITY,
      frictionAir: PHYSICS_CONFIG.FRICTION_AIR,
      isStatic: type !== 'player', // Only player stones can move initially
      label: type,
      render: {
        fillStyle: type === 'player' ? COLORS.PLAYER_STONE :
          type === 'target' ? COLORS.TARGET_STONE :
            COLORS.RESIDUAL_STONE
      }
    });

    Matter.World.add(this.world, stone);
    this.bodies.push(stone);
    return stone;
  }

  isWall(body) {
    return body.label === 'wall';
  }

  removeBody(body) {
    Matter.World.remove(this.world, body);
    this.bodies = this.bodies.filter(b => b !== body);
  }

  clearWorld() {
    // Remove all bodies except walls
    this.bodies.forEach(body => {
      if (!body.isStatic || body.label === 'target') {
        Matter.World.remove(this.world, body);
      }
    });
    this.bodies = this.bodies.filter(body => body.isStatic && body.label !== 'target');
  }
}
