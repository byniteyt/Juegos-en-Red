import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene')
    }

    preload(){
        this.load.image('fondo', 'Assets/inicio.jpg');
    }
   
    create() {
        this.add.image(400, 300, 'fondo');
        
        this.add.text(400,100, 'Charming Cats:\nGet-a-Home',
        {   fontSize: '64px',
            color: '#ffffffff'
        }).setOrigin(0.5);

        const localBtn = this.add.text(400, 300, 'Local Play', {
            fontSize: '24px', color: '#1dd627ff'
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointover', () => localBtn.setStyle({fill: '#e7b14dff'}))
        .on('pointout', () => localBtn.setStyle({fill: '#1dd627ff'}))
        .on('pointerdown', () =>{
            this.scene.start('GameScene');
        });

    }
}