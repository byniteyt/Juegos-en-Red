import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene')
    }

    preload(){
        this.load.image('Logo', 'Assets/MainMenu/Final/Logo.png');
        this.load.image('Shines', 'Assets/MainMenu/Final/Shines.png');
        this.load.image('Conf_Button', 'Assets/MainMenu/Final/Conf_Button.png');
        this.load.image('Conf_Shadow', 'Assets/MainMenu/Final/Conf_Shadow.png');
        this.load.image('Play_Button', 'Assets/MainMenu/Final/Play_Button.png');
        this.load.image('Play_Shadow', 'Assets/MainMenu/Final/Play_Shadow.png');

        this.load.image('Title', 'Assets/MainMenu/Sketch/Title.png');
        this.load.image('Decoration', 'Assets/MainMenu/Sketch/Decoration.png');
    }
   
    create() {

        /* Logo Animado */

        const logo = this.add.image(600, 175, 'Logo')
        .setOrigin(0.5)
        .setScale(0.1875);

        this.logoTilting = false;
        this.logoTiltDirection = 1;

        const tiltLogo = () => {
            
            if (this.logoTilting) return;  
            this.logoTilting = true;

            this.tweens.add({
                targets: [logo, shines],
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

        const shines = this.add.image(600, 175, 'Shines')
        .setOrigin(0.5)
        .setScale(0.1875);

        this.tweens.add({
            targets: shines,
            y: '+=2.5',
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
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

        const confButton = this.add.image(100, 625, 'Conf_Button')
        .setDepth(1)
        .setOrigin(0.5)
        .setScale(0.35)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () =>{
            this.scene.start('ControlsScene');
        });

        const confShadow = this.add.image(95, 630, 'Conf_Shadow')
        .setDepth(0)
        .setOrigin(0.5)
        .setScale(0.35);

        const playButton = this.add.image(1100, 625, 'Play_Button')
        .setDepth(1)
        .setOrigin(0.5)
        .setScale(0.35)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () =>{
            this.scene.start('GameScene');
        });

        const playShadow = this.add.image(1095, 630, 'Play_Shadow')
        .setDepth(0)
        .setOrigin(0.5)
        .setScale(0.35);

        this.tweens.add({
            targets: [confButton, playButton],
            y: '-=15',
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });

        this.tweens.add({
            targets: [confShadow, playShadow],
            y: '-=15',
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut',
            delay: 150
        });
    }
}