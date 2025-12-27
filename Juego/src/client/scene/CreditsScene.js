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

        this.add.text(600, 125, 'Créditos', {
            fontFamily: 'MiFuente',
            fontSize: '90px',
            color: '#e7c941ff'
        }).setOrigin(0.5);

        this.add.text(370, 300, 'Programación: Sandra Abarca, Alexia Fernández, Asier Martín, \n                 Sara Pedrero y Sara Sanz\n'
            + 'Sprites gatos: Sandra Abarca y Sara Pedrero\n'
            + 'Sprites obstáculos: Asier Martín\n'
            + 'Arte de los menús: Alexia Fernández\n'
            + 'Logo del juego: Sara Sanz\n', {
            fontFamily: 'MiFuente',
            fontSize: '40px',
            color: '#000000ff'
        }).setOrigin(0.3);

         const mainMenuBtn = this.add.text(113, 640, '  Volver al \n menú inicial', {
            fontFamily: 'MiFuente',
            fontSize: '40px',
            color: '#276d21ff'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => mainMenuBtn.setStyle({ fontFamily: 'MiFuente',fill: 'rgba(113, 165, 108, 1)'}))
        .on('pointerout', () => mainMenuBtn.setStyle({fontFamily: 'MiFuente', fill: '#276d21ff'}))
        .on('pointerdown', () => this.scene.start('MenuScene'));
    }
}