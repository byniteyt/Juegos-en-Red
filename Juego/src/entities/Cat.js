export class Cat {

    constructor(scene, id, x, y, direction) {
        this.id = id;
        this.scene = scene;
        this.score = 0;

        this.baseHeight = 100;
        this.baseWidth = 20;
        this.baseSpeed = 300;


        this.sprite = this.scene.physics.add.sprite(x, y, direction);
        this.sprite.setImmovable(true);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = false;
    }
}