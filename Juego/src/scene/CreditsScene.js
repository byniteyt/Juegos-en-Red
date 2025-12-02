import Phaser from "phaser";

export class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene')
    }

    preload() {
        this.load.image('credits', 'Assets/Credits/Fondo_pantallas.png');
    }

    create() {
        this.add.image(600, 350, 'credits');

        this.add.text(400, 160, 'Créditos', {
            fontSize: '64px',
            color: '#EDA3BB'
        }).setOrigin(0.5);

        this.add.text(400, 270, 'Programación: Sandra Abarca, Alexia Fernández,\nAsier Martín, Sara Pedrero y Sara Sanz\n'
            + 'Sprites gatos: Sandra Abarca y Sara Pedrero\n'
            + 'Sprites obstáculos: Asier Martín\n'
            + 'Arte de los menús: Alexia Fernández\n'
            + 'Logo del juego: Sara Sanz\n', {
            fontSize: '24px',
            color: '#EDA3BB'
        }).setOrigin(0.3);

        const mainMenuBtn = this.add.text(400, 430, 'Volver al menú inicial', {
            fontSize: '24px',
            color: '#EDA3BB'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => mainMenuBtn.setStyle({ fill: '#F4DFE6'}))
        .on('pointerout', () => mainMenuBtn.setStyle({ fill: '#EDA3BB'}))
        .on('pointerdown', () => { this.scene.start('MenuScene');
        });
    }
}