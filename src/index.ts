import { Actor, CollisionType, Color, Engine, Input, Vector } from "excalibur";

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
    [Input.Keys.Up, Vector.Up],
    [Input.Keys.Down, Vector.Down],
    [Input.Keys.Left, Vector.Left],
    [Input.Keys.Right, Vector.Right],
  ] as const;

  public update(_engine: Engine, delta: number): void {
    this.movements.forEach(([key, vector]) => {
      if (game.input.keyboard.isHeld(key)) {
        this.pos = this.pos.add(vector.scale(delta * 0.1));
      }
    });
  }
}

const spaceship = new SpaceShip();

game.add(spaceship);

game.backgroundColor = Color.Black;

game.start();
