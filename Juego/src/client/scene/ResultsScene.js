import Phaser from "phaser";

export class ResultsScene extends Phaser.Scene {
    constructor() {
        super('ResultsScene')
    }

    preload() {
        this.load.image('results', 'Assets/Results/Pantalla_de_Resultado.png');
    }

    create(traspaso) {
        this.add.image(600, 350, 'results');
        this.add.text(857,100, `Enhorabuena ${traspaso.winText}`, {
            fontFamily: 'MiFuente',
            fontSize:'80px',
            color: '#000000ff'
        }).setOrigin(0.5);
        this.add.image(250, 400, traspaso.gato).setOrigin(0.5);
        
        const mainMenuBtn = this.add.text(857, 400, 'Volver al menú inicial', {
            fontFamily: 'MiFuente',
            fontSize: '35px',
            color: '#e05fdaff'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => mainMenuBtn.setStyle({ fontFamily: 'MiFuente',fill: '#ebc6e9ff'}))
        .on('pointerout', () => mainMenuBtn.setStyle({ fontFamily: 'MiFuente',fill: '#e05fdaff'}))
        .on('pointerdown', () => { this.scene.start('MenuScene');
        });
    }
}