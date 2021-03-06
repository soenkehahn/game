import {
  Actor,
  CollisionType,
  Color,
  Engine,
  Input,
  vec,
  Vector,
} from "excalibur";
import { Keys } from "excalibur/build/dist/Input/Keyboard";

const TAU = Math.PI * 2;

class CONFIG {
  static zoom = 0.01;
  static shipVelocity = 0.4 / CONFIG.zoom;
  static shipSize = 20 / CONFIG.zoom;
  static spiralAngle = -TAU * 0.24;
}

const game = new Engine({
  width: 800,
  height: 550,
});

class Scenery extends Actor {
  spaceship: SpaceShip;

  sceneryScale: number = 1;

  constructor(spaceship: SpaceShip) {
    super({ x: game.drawWidth / 2, y: game.drawHeight / 2 });
    this.spaceship = spaceship;
  }

  public update(_engine: Engine, delta: number): void {
    this.sceneryScale += delta * 0.0002 * this.sceneryScale;
    game.rootScene.camera.zoom = this.sceneryScale * CONFIG.zoom;
    spaceship.scale = vec(1 / this.sceneryScale, 1 / this.sceneryScale);
    spaceship.velocity = CONFIG.shipVelocity / this.sceneryScale;
  }
}

class Wall extends Actor {
  constructor({
    start,
    end,
    thiccness,
    nextThiccness,
  }: {
    start: Vector;
    end: Vector;
    thiccness: number;
    nextThiccness: number;
  }) {
    super({
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
      width: start.distance(end) + Math.max(1, nextThiccness),
      height: Math.max(1, thiccness),
      color: Color.fromRGB(255, 120, 180),
      rotation: end.sub(start).toAngle(),
    });
    this.body.collisionType = CollisionType.Fixed;
  }
}

class SpaceShip extends Actor {
  velocity: number = 0;

  constructor() {
    super({
      x: game.drawWidth / 2,
      y: game.drawHeight / 2 + 200,
      width: CONFIG.shipSize,
      height: CONFIG.shipSize,
      color: Color.Cyan,
      rotation: TAU / 8,
    });
    this.body.collisionType = CollisionType.Active;
  }

  movements = [
    [[Input.Keys.Up, Input.Keys.W], Vector.Up],
    [[Input.Keys.Down, Input.Keys.S], Vector.Down],
    [[Input.Keys.Left, Input.Keys.A], Vector.Left],
    [[Input.Keys.Right, Input.Keys.D], Vector.Right],
  ] as const;

  public update(_engine: Engine, delta: number): void {
    const changeInPosition = new Vector(0, 0);
    this.movements.forEach(([keys, vector]) => {
      if (keys.some((key: Keys) => game.input.keyboard.isHeld(key))) {
        changeInPosition.addEqual(vector);
      }
    });
    this.pos.addEqual(
      changeInPosition.clampMagnitude(1).scaleEqual(this.velocity * delta)
    );
    game.rootScene.camera.pos = spaceship.pos;
  }
}

const spaceship = new SpaceShip();
const scenery = new Scenery(spaceship);

let position = vec(0, 0);
let direction = vec(100 / CONFIG.zoom, 0).rotate(TAU / 8);
for (let i = 0; i < 100; i++) {
  const end = position.add(direction);
  const nextDirection = direction.rotate(CONFIG.spiralAngle).scale(0.8);
  const wall = new Wall({
    start: position,
    end,
    thiccness: direction.distance(Vector.Zero) / 10,
    nextThiccness: nextDirection.distance(Vector.Zero) / 10,
  });
  scenery.addChild(wall);
  position = end;
  direction = nextDirection;
}

for (const x of [scenery, spaceship]) {
  game.add(x);
}

game.backgroundColor = Color.Black;
game.start();
