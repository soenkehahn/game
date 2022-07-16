import { Actor, CollisionType, Color, Engine, Input, Vector } from "excalibur";
import { Keys } from "excalibur/build/dist/Input/Keyboard";

const game = new Engine({
  width: 800,
  height: 550,
});

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
    this.body.collisionType = CollisionType.Fixed;
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

const spaceship = new SpaceShip();

game.add(spaceship);

game.backgroundColor = Color.Black;

game.start();
