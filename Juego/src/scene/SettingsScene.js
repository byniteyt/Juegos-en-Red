import Phaser from "phaser";

export class SettingsScene extends Phaser.Scene {
    constructor() {
        super('SettingsScene');
    }

    preload() {
        this.load.image('Conf', 'Assets/MainMenu/Conf.png'); // botón volver
        this.load.image('fondo', 'Assets/Credits/Fondo_pantallas.png'); //  fondo
        this.load.audio('musica','Assets/MainMenu/audio/musica_pixel.mp3' );
    }

    create() {
        this.add.image(600, 350, 'fondo');
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


        this.add.text(300, 200, 'Volumen Música:', { 
            fontSize: '24px', 
            color: '#EDA3BB' 
        }).setOrigin(0.5);

        let audio = this.sound.add('musica', {loop: true});
        audio.play();

        this.input.keyboard.on('keydown_UP', ()=>{
            audio.volume -=0.1;
        });
        this.input.keyboard.on('keydown_DOWN', ()=>{
            audio.volume =1;
        });


         

    }
}
