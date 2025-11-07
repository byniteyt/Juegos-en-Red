import Phaser from "phaser";
import { Paddle } from "../entities/Paddle.js";

export class GameScene extends Phaser.Scene{
    constructor() {
        super('GameScene')
    }

    preload(){
        this.load.image('juego', 'Assets/juego.jpg');
    }

    init() {
        this.players = new Map();
        this.inputsMapping = [];
        this.ball = null;
        this.isPaused = false;
        this.escWasDown = false;
    } 

     resume(){
        this.isPaused = false;
    }

    create() {
        this.add.image(400, 300, 'juego');
        for (let i = 0; i < 17;i++){
            this.add.rectangle(400, i * 50 + 25, 10, 30, 0xffffff);
        }

        // Score texts
        this.scoreLeft = this.add.text(100, 50, '0', {
            fontSize: '48px',
            color: '#00ff00'
        })

        this.scoreRight = this.add.text(700, 50, '0', {
            fontSize: '48px',
            color: '#00ff00'
        })
        this.createBounds();
        this.createBall();
        this.launchBall();
        this.setUpPLayers();

        this.players.forEach(paddle => {
            this.physics.add.collider(this.ball, paddle.sprite);
        });

        this.physics.add.overlap(this.ball, this.leftGoal, this.scoreRightGoal, null, this);
        this.physics.add.overlap(this.ball, this.rightGoal, this.scoreLeftGoal, null, this);

        this.escKey= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    setUpPLayers() {
        const leftPaddle = new Paddle(this, 'player1', 50, 300);
        const rightPaddle = new Paddle(this, 'player2', 750, 300);
        this.players.set('player1', leftPaddle);
        this.players.set('player2', rightPaddle);

        const InputConfig = [
            {
                playerId: 'player1',
                upKey: 'W',
                downKey: 'S',
            }, 
            {
                playerId: 'player2',
                upKey: 'UP',
                downKey: 'DOWN',
            }
        ];
        this.inputsMapping = InputConfig;
        this.inputsMapping = this.inputsMapping.map(config => {
            return {
                playerId: config.playerId,
                upKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.upKey]),
                downKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.downKey]),
            }
        });
    }

    scoreRightGoal() {
        const player2 = this.players.get('player2');
        player2.score += 1;
        this.scoreRight.setText(player2.score.toString());
        if (player2.score >=10){
            this.endGame('player2');
            return;
        }
        this.resetBall();
    }

    scoreLeftGoal() {
        const player1 = this.players.get('player1');
        player1.score += 1;
        this.scoreLeft.setText(player1.score.toString());
        if (player1.score >=2){
            this.endGame('player1');
            return;
        }
        this.resetBall();
        
    }

    resetBall() {
        this.ball.setVelocity(0, 0);
        this.ball.setPosition(400, 300);
        this.time.delayedCall(1000, () => {
            this.launchBall();
        });
    }

    createBounds() {
        this.leftGoal = this.physics.add.sprite(0, 300, null);
        this.leftGoal.setDisplaySize(10, 600);
        this.leftGoal.body.setSize(10, 600);
        this.leftGoal.setImmovable(false);
        this.leftGoal.setVisible(false);

        this.rightGoal = this.physics.add.sprite(800, 300, null);
        this.rightGoal.setDisplaySize(10, 600);
        this.rightGoal.body.setSize(10, 600);
        this.rightGoal.setImmovable(false);
        this.rightGoal.setVisible(false);
    }

    createBall() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('ball', 16, 16);
        graphics.destroy();

        this.ball = this.physics.add.image(400, 300, 'ball');
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1);
    }

    launchBall() {
        const angle = Phaser.Math.Between(-30, 30);
        const speed = 600;
        const direction = Math.random() < 0.5 ? 1 : -1; 

        this.ball.setVelocity(
            Math.cos(Phaser.Math.DegToRad(angle)) * speed * direction,
            Math.sin(Phaser.Math.DegToRad(angle)) * speed
        )
    }

    endGame(winnerId){
        this.ball.setVelocity(0,0);
        this.players.forEach(paddle=> {
            paddle.sprite.setVelocity(0,0);
        })
        this.physics.pause();
        const winnerText = winnerId==='player1'?'Left Player Wins!!':'Right Player Wins!!';
        this.add.text(400,250, winnerText, {
            fontSize:'64px',
            color: '#00ff00'
        }).setOrigin(0.5);

        const menu = this.add.text(400,350,'Return',{
            fontSize:'32px',
            color: '#00ff00'
        }).setOrigin(0.5).setInteractive({useHandCursor:true})
        .on('pointerover',()=>menu.setColor('#ff0000'))
        .on('pointerout',()=>menu.setColor('#00ff00'))
        .on('pointerdown', ()=>{this.scene.start('MenuScene')});
        
    }

    tooglePause(){
        const newPausedState = !this.isPaused;
        this.setPauseState(newPausedState);
    }

    setPauseState(isPaused){
        this.isPaused = isPaused;
        if(isPaused){
            this.scene.launch('PauseScene', {originalScene:'GameScene'});
            this.scene.pause();
        }
        else{
            this.scene.stop();  
            this.scene.resume('GameScene');
        }
    }

    update(){
        if(this.escKey.isDown){
            this.tooglePause();
        }
        this.inputsMapping.forEach(mapping => {
            const paddle = this.players.get(mapping.playerId);
            //let direction = null;
            if (mapping.upKeyObj.isDown){
                paddle.sprite.setVelocityY(-paddle.baseSpeed);
            }
            else if (mapping.downKeyObj.isDown){
                paddle.sprite.setVelocityY(paddle.baseSpeed);
            }
            else {paddle.sprite.setVelocityY(0);}

        });
    }
}
