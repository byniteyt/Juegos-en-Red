import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene')
    }

    preload(){
        this.load.image('Logo', 'Assets/MainMenu/Logo.png');
        this.load.image('Conf', 'Assets/MainMenu/Conf.png');
        this.load.image('Play', 'Assets/MainMenu/Play.png');
        this.load.image('Title', 'Assets/MainMenu/Title.png');
        this.load.image('Decoration', 'Assets/MainMenu/Decoration.png');
        this.load.audio('musica', 'Assets/MainMenu/audio/musica_pixel.mp3');

         if (!this.game.registry.has('musicLoaded')) {
            this.load.audio('bgMusic', 'Assets/MainMenu/audio/musica_pixel.mp3');
            this.game.registry.set('musicLoaded', true);
        }

    }
   
    create() {

          if (!this.game.registry.has('bgMusic')) {
  
    const music = this.sound.add('musica', {
        loop: true,
        volume: 0.5
    });

    music.play();

    this.game.registry.set('bgMusic', music);
    this.game.registry.set('volume', 1.0);
} else {

    const music = this.game.registry.get('bgMusic');

    if (!music.isPlaying) {
        music.play();
    }
}


        /* Logo Animado */

        const logo = this.add.image(600, 200, 'Logo')
        .setOrigin(0.5)
        .setScale(0.25);

        this.logoTilting = false;
        this.logoTiltDirection = 1;

        const tiltLogo = () => {
            
            if (this.logoTilting) return;  
            this.logoTilting = true;

            this.tweens.add({
                targets: logo,
                angle: 15 * this.logoTiltDirection,
                duration: 1000,
                yoyo: true,
                ease: 'Sine.inOut',
                hold: 500,
                onComplete: () => {
                    logo.angle = 0;
                    this.logoTilting = false; 
                    this.logoTiltDirection *= -1; 
                },
            });
        };

        this.time.addEvent({
            delay: 5000,
            callback: tiltLogo,
            loop: true
        });

        /* Título del Juego */

        this.add.image(600, 350, 'Title')
        .setOrigin(0.5)
        .setScale(0.35);

        /* Decoración del Menú */

        this.add.image(600, 525, 'Decoration')
        .setOrigin(0.5)
        .setScale(0.3);

        /* Botones Interactivos */

        const confBtn = this.add.image(100, 625, 'Conf')
        .setOrigin(0.5)
        .setScale(0.25)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () =>{
            this.scene.start('SettingsScene');
        });

        const playBtn = this.add.image(1100, 625, 'Play')
        .setOrigin(0.5)
        .setScale(0.25)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () =>{
            this.scene.start('GameScene');
        });

        this.tweens.add({
            targets: [confBtn, playBtn],
            scale: 0.275,
            y: '-=10',
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
    }
}