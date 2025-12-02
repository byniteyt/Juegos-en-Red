import Phaser from "phaser";

export class ResultsScene extends Phaser.Scene {
    constructor() {
        super('ResultsScene')
    }

    preload() {
        this.load.image('results', 'Assets/Results/Pantalla_de_Resultado.png');
    }

    create() {
        this.add.image(600, 350, 'results');

        const mainMenuBtn = this.add.text(850, 150, 'Volver al menú inicial', {
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