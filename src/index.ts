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

const game = new Engine({
  width: 800,
  height: 550,
});

class Scenery extends Actor {
  sceneryScale: number = 1;
  constructor() {
    super({ x: game.drawWidth / 2, y: game.drawHeight / 2 });
  }

  public update(_engine: Engine, delta: number): void {
    this.sceneryScale += delta * 0.0002 * this.sceneryScale;
    this.scale = new Vector(this.sceneryScale, this.sceneryScale);
  }
}

class Wall extends Actor {
  constructor({
    start,
    end,
    thiccness,
  }: {
    start: Vector;
    end: Vector;
    thiccness: number;
  }) {
    super({
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
      width: start.distance(end),
      height: Math.max(1, thiccness),
      color: Color.fromRGB(255, 120, 180),
      rotation: end.sub(start).toAngle(),
    });
    this.body.collisionType = CollisionType.Fixed;
  }
}

class SpaceShip extends Actor {
  constructor() {
    super({
      x: game.drawWidth / 2,
      y: game.drawHeight / 2 + 200,
      width: 20,
      height: 20,
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
      changeInPosition.clampMagnitude(1).scaleEqual(0.5 * delta)
    );
  }
}

const spaceship = new SpaceShip();
const scenery = new Scenery();

let position = vec(-(100 * Math.SQRT2) / 2 - 7.3, -8);
let direction = vec(100, 0).rotate(TAU / 8);
for (let i = 0; i < 100; i++) {
  const end = position.add(direction);
  const wall = new Wall({
    start: position,
    end,
    thiccness: direction.distance(Vector.Zero) / 10,
  });
  scenery.addChild(wall);
  position = end;
  direction = direction.rotate(-TAU / 4).scale(0.8);
}

for (const x of [scenery, spaceship]) {
  game.add(x);
}

game.backgroundColor = Color.Black;
game.start();
