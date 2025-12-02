import Phaser from "phaser";

export class SettingsScene extends Phaser.Scene {
    constructor() {
        super('SettingsScene');
    }

    preload() {
        this.load.image('Conf', 'Assets/MainMenu/Conf.png'); // botón volver
        this.load.image('fondo', 'Assets/Credits/Fondo_pantallas.jpg'); //  fondo
    }

    create() {
        this.add.image(600, 350, 'fondo').setOrigin(0.5).setScale(1);
        this.add.text(600, 100, 'Ajustes', { 
            fontSize: '64px',
            color: '#EDA3BB'
         }).setOrigin(0.5);

        // Botón volver
      const mainMenuBtn = this.add.text(400, 400, 'Volver al menú inicial', {
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
