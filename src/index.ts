import { Actor, CollisionType, Color, Engine, Input } from "excalibur";

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
      color: Color.Blue,
      rotation: Math.PI / 4,
    });
    this.body.collisionType = CollisionType.Fixed;
  }

  public update(engine: Engine, delta: number): void {
    if (
      engine.input.keyboard.isHeld(Input.Keys.W) ||
      engine.input.keyboard.isHeld(Input.Keys.Up)
    ) {
      console.log("update");
      this.rotation += 0.001 * delta;
    }
  }
}

const spaceship = new SpaceShip();

game.add(spaceship);

game.backgroundColor = Color.Black;

game.start();
