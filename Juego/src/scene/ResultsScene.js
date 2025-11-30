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
    }
}