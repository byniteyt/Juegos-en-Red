export class Cat {

    constructor(scene, id, x, y, direction) {
        this.id = id;
        this.scene = scene;
        this.score = 0;

        this.baseHeight = 100;
        this.baseWidth = 20;
        this.baseSpeed = 300;
        this.activeSpeed = this.baseSpeed;



        this.sprite = this.scene.physics.add.sprite(x, y, direction);
        this.sprite.collision = 0;
        this.sprite.setImmovable(false);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = false;
    }
}