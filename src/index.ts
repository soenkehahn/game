import { Actor, CollisionType, Color, CoordPlane, Engine, Input, Physics, PhysicsStats, Vector } from "excalibur";
import { Keys } from "excalibur/build/dist/Input/Keyboard";


const game = new Engine({
  width: 800,
  height: 550,
});

class Scenery extends Actor {
  sceneryScale: number = 1;
  constructor() {
    super({ x: game.drawWidth / 2, y: game.drawHeight / 2 })
  }

  public update(_engine: Engine, delta: number): void {
    this.sceneryScale += delta * 0.0001 * this.sceneryScale;
    this.scale = new Vector(this.sceneryScale, this.sceneryScale);
  }
}

class Wall extends Actor {
  constructor({ x, y, rotation, length, thiccness }: { x: number; y: number; rotation: number; length: number; thiccness: number }) {
    super({
      x: x,
      y: y,
      width: length,
      height: thiccness,
      color: Color.fromRGB(255, 120, 180),
      rotation
    });
    this.body.collisionType = CollisionType.Fixed;
  }
}

class SpaceShip extends Actor {
  constructor() {
    super({
      x: game.drawWidth / 2,
      y: game.drawHeight / 2,
      width: 20,
      height: 20,
      color: Color.Cyan,
      rotation: Math.PI / 4,
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
        changeInPosition.addEqual(vector)
      }
    });
    this.pos.addEqual(changeInPosition.clampMagnitude(1).scaleEqual(0.5 * delta));
  }
}

const TAU = Math.PI * 2

class SpiralPiece extends Actor {
  constructor(length: number) {
    super()
    const thiccness = 10
    const south = new Wall({ x: 0, y: 0, rotation: 0, length, thiccness })
    const east = new Wall({ x: length / 2 - thiccness / 2, y: -length / 2, rotation: TAU / 4, length, thiccness })
    const north = new Wall({ x: 0, y: -length, rotation: 0, length, thiccness })
    this.addChild(south)
    this.addChild(east)
    this.addChild(north)
  }
}

const spaceship = new SpaceShip();
const scenery = new Scenery();
const spiral = new SpiralPiece(150);
scenery.addChild(spiral);
for (const x of [scenery, spaceship]) {
  game.add(x);
}
game.backgroundColor = Color.Black;
game.start();
