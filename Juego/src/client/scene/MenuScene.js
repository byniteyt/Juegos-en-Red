import Phaser from "phaser";
import { connectionManager } from '../services/ConnectionManager';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene')
    }

    preload(){
        this.load.image('Logo', 'Assets/MainMenu/Final/Logo.png');
        this.load.image('Shines', 'Assets/MainMenu/Final/Shines.png');
        this.load.image('Cred_Button', 'Assets/MainMenu/Final/Cred_Button.png');
        this.load.image('Cred_Shadow', 'Assets/MainMenu/Final/Cred_Shadow.png');
        this.load.image('Conf_Button', 'Assets/MainMenu/Final/Conf_Button.png');
        this.load.image('Conf_Shadow', 'Assets/MainMenu/Final/Conf_Shadow.png');
        this.load.image('Play_Button', 'Assets/MainMenu/Final/Play_Button.png');
        this.load.image('Play_Shadow', 'Assets/MainMenu/Final/Play_Shadow.png');

        this.load.image('Title', 'Assets/MainMenu/Sketch/Title.png');
        this.load.image('Decoration', 'Assets/MainMenu/Sketch/Decoration.png');
        this.load.audio('musica', 'Assets/MainMenu/audio/musica_pixel.mp3');

         if (!this.game.registry.has('musicLoaded')) {
            this.load.audio('bgMusic', 'Assets/MainMenu/audio/musica_pixel.mp3');
            this.game.registry.set('musicLoaded', true);
        }
    }
   
    create() {

        if (!this.game.registry.has('bgMusic')) {

        var music = this.sound.add('musica', {
            loop: true,
            volume: 0.5
        });

        music.play();

        this.game.registry.set('bgMusic', music);
        this.game.registry.set('volume', 1.0);
        } else {

            music = this.game.registry.get('bgMusic');

            if (!music.isPlaying) {
                music.play();
            }
        }

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
            this.scene.start('SettingsScene');
        });

        const confShadow = this.add.image(95, 630, 'Conf_Shadow')
        .setDepth(0)
        .setOrigin(0.5)
        .setScale(0.35);

        // eslint-disable-next-line no-unused-vars
        const credButton = this.add.image(1110, 75, 'Cred_Button')
        .setDepth(1)
        .setOrigin(0.5)
        .setScale(0.35)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () =>{
            this.scene.start('CreditsScene');
        });

        const credShadow = this.add.image(1105, 80, 'Cred_Shadow')
        .setDepth(0)
        .setOrigin(0.5)
        .setScale(0.35);

        const playButton = this.add.image(1100, 625, 'Play_Button')
        .setDepth(1)
        .setOrigin(0.5)
        .setScale(0.35)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () =>{
            music.stop();
            this.scene.start('ControlsScene');
        });

        const playShadow = this.add.image(1095, 630, 'Play_Shadow')
        .setDepth(0)
        .setOrigin(0.5)
        .setScale(0.35);

        this.tweens.add({
            targets: [confButton, playButton, credButton],
            y: '-=15',
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });

        this.tweens.add({
            targets: [confShadow, playShadow, credShadow],
            y: '-=15',
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut',
            delay: 150
        });
        // Indicador de conexión al servidor
        this.connectionText = this.add.text(600, 430, 'Servidor: Comprobando...', {
            fontFamily: 'MiFuente',
            fontSize: '24px',
            color: '#dfb912ff'
        }).setOrigin(0.5);
        const onlineBtn = this.add.text(400, 390, 'Online Multiplayer', {
            fontSize: '24px',
            color: '#00ff00',
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => onlineBtn.setColor('#00ff88'))
        .on('pointerout', () => onlineBtn.setColor('#00ff00'))
        .on('pointerdown', () => {
            this.scene.start('LobbyScene');
        });
        // Listener para cambios de conexión
        this.connectionListener = (data) => {
            this.updateConnectionDisplay(data);
        };
        connectionManager.addListener(this.connectionListener);
    }
    
    updateConnectionDisplay(data) {
        // Solo actualizar si el texto existe (la escena está creada)
        if (!this.connectionText || !this.scene || !this.scene.isActive('MenuScene')) {
            return;
        }

        try {
            if (data.connected) {
                this.connectionText.setText(`Servidor: ${data.count} usuario(s) conectado(s)`);
                this.connectionText.setColor('#307430ff');
            } else {
                this.connectionText.setText('Servidor: Desconectado');
                this.connectionText.setColor('#d63838ff');
            }
        } catch (error) {
            console.error('[MenuScene] Error updating connection display:', error);
        }
    }

    shutdown() {
        // Remover el listener
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
        }
    }
}