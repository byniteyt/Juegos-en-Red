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

        this.add.text(540,95, '¿CÓMO SE JUEGA?', {
            fontFamily: 'MiFuente',
            fontSize: '90px',
            color: '#000000ff'
        }).setOrigin(0.3);

        this.add.text(300, 210, 'Controles', {
            fontFamily: 'MiFuente',
            fontSize: '50px',
            color: '#000000ff'
        }).setOrigin(0.3);

        this.add.text(250, 280, ' Jugador 1: -utiliza las teclas "W A S D"\n               para desplazarte por el mapa.\n'
            + '             -Utiliza la tecla ESPACIO para acelerar.' , {
            fontFamily: 'MiFuente',
            fontSize: '24px',
            color: '#73c6ecff'
        }).setOrigin(0.3);

         this.add.text(250, 395, ' Jugador 2: -utiliza las teclas "↑←↓→"\n               para desplazarte por el mapa.\n'
            + '             -Utiliza la tecla ENTER apara acelerar.', {
            fontFamily: 'MiFuente',
            fontSize: '24px',
            color: '#e78746ff'
        }).setOrigin(0.3);

        this.add.text(800, 210, 'OBJETIVO', {
            fontFamily: 'MiFuente',
            fontSize: '50px',
            color: '#000000ff'
        }).setOrigin(0.3);

        this.add.text(800, 290, '¡Competid para alcanzar la casa al final del mapa \n antes que el otro!\n\n'
            + '¡¡Cuidado con los obstáculos!!', {
            fontFamily: 'MiFuente',    
            fontSize: '24px',
            color: '#000000ff'
        }).setOrigin(0.3);

        this.add.text(295, 490, 'Presionad la tecla de escape para pausar el juego.', {
            fontFamily: 'MiFuente',
            fontSize: '24px',
            color: '#000000ff'
        }).setOrigin(0.4);

        const startBtn = this.add.text(1050, 620, 'Seleccionar gatos', {
            fontFamily: 'MiFuente',
            fontSize: '40px',
            color: '#e05fdaff'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => startBtn.setStyle({fontFamily: 'MiFuente', fill: '#dfaadcff'}))
        .on('pointerout', () => startBtn.setStyle({fontFamily: 'MiFuente', fill: '#e05fdaff'}))
        .on('pointerdown', () => { this.scene.start('SelectCatScene');
        });
    }
}