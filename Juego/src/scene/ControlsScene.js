import Phaser from "phaser";

export class ControlsScene extends Phaser.Scene {
    constructor() {
        super('ControlsScene');
    }

    preload() {
        this.load.image('controls', 'Assets/Credits/Fondo_pantallas.png');
    }

    create() {
        this.add.image(600, 350, 'controls');

        this.add.text(400, 160, 'Objetivo', {
            fontSize: '64px',
            color: '#EDA3BB'
        }).setOrigin(0.5);

        this.add.text(400, 250, '¡Competid para alcanzar la casa al final del mapa antes que el otro!\n'
            + '¡¡Cuidado con los obstáculos!!', {
            fontSize: '64px',
            color: '#EDA3BB'
        }).setOrigin(0.5);

        this.add.text(400, 300, 'Controles:', {
            fontSize: '64px',
            color: '#EDA3BB'
        }).setOrigin(0.5);

        this.add.text(400, 325, '- Jugador 1: utiliza las teclas "WASD" para desplazarte por el mapa.\n'
            + '  Utiliza la tecla ESPACIO para acelerar.\n'
            + '- Jugador 2: utiliza las teclas "↑←↓→" para desplazarte por el mapa.\n'
            + '  Utiliza la tecla ENTER apara acelerar.', {
            fontSize: '64px',
            color: '#EDA3BB'
        }).setOrigin(0.5);

        this.add.text(400, 350, 'Presiona la tecla de escape para pausar el juego.', {
            fontSize: '64px',
            color: '#EDA3BB'
        }).setOrigin(0.5);

        const startBtn = this.add.text(400, 400, 'Empezar juego', {
            fontSize: '24px',
            color: '#EDA3BB'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => startBtn.setStyle({ fill: '#F4DFE6'}))
        .on('pointerout', () => startBtn.setStyle({ fill: '#EDA3BB'}))
        .on('pointerdown', () => { this.scene.start('GameScene');
        });
    }
}