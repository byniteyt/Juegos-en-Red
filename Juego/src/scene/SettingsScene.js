// SettingsScene simplificado
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
        
        // Título
        this.add.text(600, 100, 'Ajustes', { 
            fontSize: '64px',
            color: '#EDA3BB'
        }).setOrigin(0.5);

        // Botón volver
        const mainMenuBtn = this.add.text(600, 500, 'Volver al menú inicial', {
            fontSize: '24px',
            color: '#EDA3BB'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => mainMenuBtn.setStyle({ fill: '#F4DFE6'}))
        .on('pointerout', () => mainMenuBtn.setStyle({ fill: '#EDA3BB'}))
        .on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

        // Instrucciones de volumen
        const volumeText = this.add.text(600, 200, 'Controles de Volumen:\n↑ SUBIR volumen\n↓ BAJAR volumen', {
            fontSize: '24px',
            color: '#EDA3BB',
            align: 'center'
        }).setOrigin(0.5);

        // Controles de teclado para volumen
        this.input.keyboard.on('keydown-UP', () => {
            const music = this.game.registry.get('bgMusic');
            if (music) {
                let currentVolume = music.volume + 0.1;
                if (currentVolume > 1) currentVolume = 1;
                music.setVolume(currentVolume);
                volumeText.setText(`Volumen: ${Math.round(currentVolume * 100)}%\n\nControles:\n↑ SUBIR volumen\n↓ BAJAR volumen`);
            }
        });

        this.input.keyboard.on('keydown-DOWN', () => {
            const music = this.game.registry.get('bgMusic');
            if (music) {
                let currentVolume = music.volume - 0.1;
                if (currentVolume < 0) currentVolume = 0;
                music.setVolume(currentVolume);
                volumeText.setText(`Volumen: ${Math.round(currentVolume * 100)}%\n\nControles:\n↑ SUBIR volumen\n↓ BAJAR volumen`);
            }
        });
    }
}