import Phaser from "phaser";

export class ControlsScene extends Phaser.Scene {
    constructor() {
        super('ControlsScene');
    }

    preload() {
        // this.load.image('credits', 'Assets/MainMenu/inicio.jpg');
    }

    create() {
        // this.add.image(600, 350, 'credits');

        this.add.text(400, 160, 'Controles', {
            fontSize: '64px'
        }).setOrigin(0.5);

        /*this.add.text(400, 300, 'Programación: Sandra Abarca, Alexia Fernández,%nAsier Martín, Sara Pedrero y Sara Sanz%n'
            + 'Sprites gatos: Sandra Abarca y Sara Pedrero%n'
            + 'Sprites enemigos: Asier Martín%n'
            + 'Sprites power ups: Alexia Fernández%n'
            + 'Arte de los menús: Alexia Fernández%n'
            + 'Logo del juego: Sara Sanz%n', {
            fontSize: '24px'
        }).setOrigin(0.5);*/

        const startBtn = this.add.text(400, 400, 'Empezar juego', {
            fontSize: '24px',
            color: '#00ff00'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => startBtn.setStyle({ fill: '#00ff88'}))
        .on('pointerout', () => startBtn.setStyle({ fill: '#00ff00'}))
        .on('pointerdown', () => { this.scene.start('GameScene');
        });
    }
}