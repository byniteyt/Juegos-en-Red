import Phaser from "phaser";
export class Cat extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, id, x, y, direction, sprintVar) {
        super(scene, x, y, direction);

        scene.physics.add.existing(this);
        this.sprintCharge = sprintVar;
        this.score = 0;
        this.baseHeight = 100;
        this.baseWidth = 20;
        this.baseSpeed = 300;
        this.activeSpeed = this.baseSpeed;
        this.collision = 0;

        this.setImmovable(false);
        this.setCollideWorldBounds(true);
        this.body.allowGravity = false;

        scene.add.existing(this);
    }
}