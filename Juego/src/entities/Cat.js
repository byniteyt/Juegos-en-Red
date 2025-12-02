import Phaser from "phaser";
export class Cat extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, id, x, y, direction, 
        sprintVar, audio, xAnim, YUpAnim, YDownAnim) {
        super(scene, x, y, direction);

        scene.physics.add.existing(this);
        this.sprintCharge = sprintVar;
        this.score = 0;
        this.movX = xAnim;
        this.movYUp = YUpAnim;
        this.movYDown = YDownAnim;
        this.effect = this.scene.sound.add(audio);
        this.baseHeight = 100;
        this.baseWidth = 20;
        this.baseSpeed = 300;
        this.activeSpeed = this.baseSpeed;
        this.collision = 0;

        this.setImmovable(false);
        this.setCollideWorldBounds(true);

        scene.add.existing(this);
    }
}