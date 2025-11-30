import Phaser from "phaser";
import { Cat } from "../entities/Cat.js";
import { Obstaculo } from "../entities/Obstaculos.js";


export class GameScene extends Phaser.Scene{
    constructor() {
        super('GameScene')
    }

    preload(){
        //this.load.audio('musicaFondo','Assets/Game/Audio/(ARCHIVO POR METER)')
        this.load.image('juego', 'Assets/Game/juego.jpg');
        this.load.image('caja', 'Assets/Game/Obstaculos/caja1.png');
        this.load.image('gato1', 'Assets/Game/Gatos jugables/PJCats_gato alegre.png');
        this.load.image('gato2', 'Assets/Game/Gatos jugables/PJCats_gato negro.png');
    }

    init() {
        this.players = new Map();
        this.obstaculos = new Map();
        this.inputsMapping = [];
        this.isPaused = false;
        this.escWasDown = false;
        this.worldVel = 5;
        this.cantidad = 8;
    } 

     resume(){
        this.isPaused = false;
    }

    create() {
        //this.sound.add('musicaFondo').play();
        this.background = this.add.image(600, -350, 'juego').setOrigin(0.5);
        // Score texts
        this.scoreLeft = this.add.text(50, 50, '1º', {
            fontSize: '48px',
            color: '#2ba304ff'
        })

        this.scoreRight = this.add.text(1100, 50, '2º', {
            fontSize: '48px',
            color: '#a23062ff'
        })
        this.createBounds();
        this.setUpPlayers();
        this.setUpObstacles();
        this.players.forEach(paddle=> {
            this.obstaculos.forEach(obs=>{
                this.physics.add.collider(paddle.sprite, obs.sprite,null, null, this);
                this.physics.add.overlap(obs.sprite,this.end, this.endWorld,null,this);
            })
            this.physics.add.overlap(this.goal, paddle.sprite, this.goalCondition,null,this);
            this.physics.add.overlap( paddle.sprite, this.end, this.underScene,null,this);
        })


        this.escKey= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    setUpPlayers() {
        const leftPaddle = new Cat(this, 'player1', 50, 300,'gato1');
        const rightPaddle = new Cat(this, 'player2', 750, 300, 'gato2');
        this.players.set('player1', leftPaddle);
        this.players.set('player2', rightPaddle);
        this.physics.add.collider(leftPaddle.sprite, rightPaddle.sprite,null, null, this);
        //this.physics.add.collider(leftPaddle.sprite, rightPaddle.sprite,this.collisionVelocity, null, this);

        const InputConfig = [
            {
                playerId: 'player1',
                upKey: 'W',
                downKey: 'S',
                leftKey: 'A',
                rightKey: 'D'
            }, 
            {
                playerId: 'player2',
                upKey: 'UP',
                downKey: 'DOWN',
                leftKey: 'LEFT',
                rightKey: 'RIGHT'
            }
        ];
        this.inputsMapping = InputConfig;
        this.inputsMapping = this.inputsMapping.map(config => {
            return {
                playerId: config.playerId,
                upKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.upKey]),
                downKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.downKey]),
                leftKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.leftKey]),
                rightKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.rightKey]),
            }
        });
    }

    setUpObstacles(){
        this.espacio = 1200/this.cantidad;
        for(var index = 0;index<this.cantidad;index++){
            var x = Math.random()*(this.espacio-25) + index*this.espacio;
            this.obstaculos.set('obs'+index,new Obstaculo(this, 'Caja'+index, x, 
            Math.random()*300 + 500,'caja'));
        }
        
    }
    goalCondition(meta, pj){
        if (this.background.y>=2220){
            this.endGame(pj);
        }
    }
underScene(pj, limite){
    if(pj.collision >0){ // si es mayor significa que está colisionando con una caja
        pj.disabled = pj.collision%2; // Cada frame se dibujará o no la imagen
    }
}

    endWorld(obstaculo, fin){
            obstaculo.y = -70 - Math.random()*10; // Hacemos que suba de nuevo arriba

            obstaculo.x = Math.random()*(Math.abs(this.espacio-50)) + (obstaculo.x/this.espacio)*this.espacio; // Reubicamos en una posicion aleatoria
            //"(obstaculo.x/this.espacio)*this.espacio" asegura que se vuelav asituar en su region asignada sin pasarse a otras
            //console.log(obstaculo.sprite.x);
    }
    setPositions(){
        const j1 = this.players.get('player1');
        const j2 = this.players.get('player2');
        if (j1.sprite.y<j2.sprite.y){
            this.scoreRight.setText('2º');
            this.scoreLeft.setText('1º');
        }
        if (j1.sprite.y>j2.sprite.y){
            this.scoreRight.setText('1º');
            this.scoreLeft.setText('2º');
        }
    }

    createBounds() {
        // Creamos la meta
        this.goal = this.physics.add.sprite(0, 0, null);
        this.goal.setDisplaySize(1200, 20);
        this.goal.body.setSize(1200, 20);
        this.goal.setImmovable(false);
        this.goal.setVisible(false);

        //Creamos el limite infreior para los obstáculos
        this.end = this.physics.add.sprite(0, 700, null);
        this.end.setDisplaySize(1200, 20);
        this.end.body.setSize(1200, 20);
        this.end.setImmovable(false);
    }

    endGame(winner){
        const winnerId = winner.id;
        this.players.forEach(paddle=> {
            paddle.sprite.setVelocity(0,0);
        })
        this.physics.pause();
        const winnerText = winnerId==='player1'?'Gato Izquierdo gana!!':'Gato Izquierdo gana!!';
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
        //this.worldVel = 0;
        //this.scene.pause();
        this.scene.start('ResultsScene');
        
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

    collisionVelocity(){
        this.players.forEach(paddle=> {
            paddle.collision = 3;
            paddle.activeSpeed = paddle.baseSpeed/4;
        })
    }

    update(){
        this.worldVel = this.background.y<2220? 1 :  0;
        
        /*this.players.forEach(paddle=> {
            paddle.activeSpeed = (paddle.collision>0)? paddle.activeSpeed: paddle.baseSpeed;
            paddle.collision -= 1;
        })*/
        this.background.y += this.worldVel;
        if(this.escKey.isDown){
            this.tooglePause();
        }
        this.obstaculos.forEach(obstaculo=> {
             obstaculo.sprite.y += this.worldVel; 
        })
        this.inputsMapping.forEach(mapping => {
            const paddle = this.players.get(mapping.playerId);
            let speedX = 0;
            let speedY = this.worldVel*145;
            paddle.y += this.worldVel;
            if (mapping.upKeyObj.isDown){
                speedY += -paddle.activeSpeed;
            }
            else if (mapping.downKeyObj.isDown){
                speedY += paddle.activeSpeed;
            }
            paddle.sprite.setVelocityY(speedY);
            if (mapping.leftKeyObj.isDown){
                speedX += -paddle.activeSpeed;
            }
            else if (mapping.rightKeyObj.isDown){
                speedX += paddle.activeSpeed;
            }
            paddle.sprite.setVelocityX(speedX);
        });
        this.setPositions();
    }
}
