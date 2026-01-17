import Phaser from "phaser";

export class ResultsScene extends Phaser.Scene {
    constructor() {
        super('ResultsScene')
    }

    preload() {
        this.load.image('results', 'Assets/Results/Pantalla_de_Resultado.png');
        this.load.image('gato1', 'Assets/Game/Adaptados/gato1.png');
        this.load.image('gato2', 'Assets/Game/Adaptados/gatoPasota.png');
        this.load.image('gato3', 'Assets/Game/Adaptados/gatoGordo.png');
        this.load.image('gato4', 'Assets/Game/Adaptados/gatoPeludo.png');
        this.load.image('gato5', 'Assets/Game/Adaptados/gatoNegro.png');
        this.load.image('gato6', 'Assets/Game/Adaptados/gatoAlegre.png');
    }

    create(traspaso) {
        this.add.image(600, 350, 'results');
        this.add.text(857,100, `Enhorabuena ${traspaso.winText}`, {
            fontFamily: 'MiFuente',
            fontSize:'80px',
            color: '#000000ff'
        }).setOrigin(0.5);
        this.add.image(310, 400, traspaso.gato).setOrigin(0.5).setScale(0.2);;
        
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