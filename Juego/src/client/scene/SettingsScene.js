import Phaser from "phaser";

export class SettingsScene extends Phaser.Scene {
    constructor() {
        super('SettingsScene');
    }

    preload() {
        this.load.image('Conf', 'Assets/MainMenu/Conf.png');
        this.load.image('fondo', 'Assets/Credits/Fondo_pantallas.png');
    }

    create() {
        this.add.image(600, 350, 'fondo');

        this.add.text(600, 100, 'Ajustes', { 
            fontSize: '64px',
            color: '#EDA3BB'
        }).setOrigin(0.5);

        const mainMenuBtn = this.add.text(600, 500, 'Volver al menú inicial', {
            fontSize: '24px',
            color: '#EDA3BB'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => mainMenuBtn.setStyle({ fill: '#F4DFE6'}))
        .on('pointerout', () => mainMenuBtn.setStyle({ fill: '#EDA3BB'}))
        .on('pointerdown', () => this.scene.start('MenuScene'));

        // Obtener música global
        const music = this.game.registry.get('bgMusic');

        const volumeText = this.add.text(600, 200, 
            `Volumen: ${Math.round(music.volume * 100)}%\n\n` +
            `Controles:\n↑ SUBIR volumen\n↓ BAJAR volumen`, 
        {
            fontSize: '24px',
            color: '#EDA3BB',
            align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-UP', () => {
            let v = music.volume + 0.1;
            if (v > 1) v = 1;
            music.setVolume(v);
            volumeText.setText(`Volumen: ${Math.round(v * 100)}%\n\nControles:\n↑ SUBIR\n↓ BAJAR`);
        });

        this.input.keyboard.on('keydown-DOWN', () => {
            let v = music.volume - 0.1;
            if (v < 0) v = 0;
            music.setVolume(v);
            volumeText.setText(`Volumen: ${Math.round(v * 100)}%\n\nControles:\n↑ SUBIR\n↓ BAJAR`);
        });
    }
}
