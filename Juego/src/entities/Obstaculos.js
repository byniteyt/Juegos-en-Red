export class Obstaculo{
    constructor(scene, id, x, y, direction) {
        this.id = id;
        this.scene = scene;

        this.baseHeight = 100;
        this.baseWidth = 20;
        this.baseSpeed = 300;
        this.collisionWithPlayer = 0;

        this.sprite = this.scene.physics.add.sprite(x, y, direction).setOrigin(0.5);
        this.sprite.setImmovable(true);
        this.sprite.body.allowGravity = false;
    }
}