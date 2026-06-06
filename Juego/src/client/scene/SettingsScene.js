import Phaser from "phaser";

export class SettingsScene extends Phaser.Scene {
    constructor() {
        super('SettingsScene');
    }

    preload() {
        this.load.image('Conf', 'Assets/MainMenu/Conf.png');
        this.load.image('fondo', 'Assets/Credits/Fondo_pantallas.png');
    }

    create(traspaso) {
        this.add.image(600, 350, 'fondo');

        this.add.text(600, 125, 'AJUSTES', { 
            fontFamily: 'MiFuente',
            fontSize: '90px',
            color: '#2e7adfff'
        }).setOrigin(0.5);

        const mainMenuBtn = this.add.text(113, 640, '  Volver al \n menú inicial', {
            fontFamily: 'MiFuente',
            fontSize: '40px',
            color: '#276d21ff'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => mainMenuBtn.setStyle({ fontFamily: 'MiFuente',fill: 'rgba(113, 165, 108, 1)'}))
        .on('pointerout', () => mainMenuBtn.setStyle({fontFamily: 'MiFuente', fill: '#276d21ff'}))
        .on('pointerdown', () => this.scene.start('MenuScene'),{
                    player: traspaso.player
                });

        // Obtener música global
        const music = this.game.registry.get('bgMusic');

        const volumeText = this.add.text(600, 320, 
            `Volumen: ${Math.round(music.volume * 100)}%\n\n` +
            `Controles:\n↑ SUBIR VOLUMEN\n↓ BAJAR VOLUMEN`, 
        {
            fontFamily: 'MiFuente',
            fontSize: '40px',
            color: '#000000ff',
            align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-UP', () => {
            let v = music.volume + 0.1;
            if (v > 1) v = 1;
            music.setVolume(v);
            volumeText.setText(`Volumen: ${Math.round(v * 100)}%\n\nControles:\n↑ SUBIR VOLUMEN\n↓ BAJAR VOLUMEN`);
        });

        this.input.keyboard.on('keydown-DOWN', () => {
            let v = music.volume - 0.1;
            if (v < 0) v = 0;
            music.setVolume(v);
            volumeText.setText(`Volumen: ${Math.round(v * 100)}%\n\nControles:\n↑ SUBIR VOLUMEN\n↓ BAJAR VOLUMEN`);
        });
    }
}
