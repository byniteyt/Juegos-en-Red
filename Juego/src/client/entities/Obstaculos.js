import Phaser from "phaser";

export class Obstaculo extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, id, x, y, direction) {
        super(scene, x, y, direction);

        scene.physics.add.existing(this);

        this.id = id;
        this.baseHeight = 100;
        this.baseWidth = 20;
        this.baseSpeed = 300;
        this.collisionWithPlayer = 0;

        this.setOrigin(0.5);
        this.setImmovable(true);
        this.body.allowGravity = false;

        scene.add.existing(this);
    }
}