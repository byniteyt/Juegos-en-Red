/* eslint-disable no-unused-vars */
import Phaser from "phaser";
import { Cat } from "../entities/Cat.js";
import { Obstaculo } from "../entities/Obstaculos.js";
//import { ConnectionManager } from '../services/ConnectionManager';
//import { ConnectionLostScene } from "./ConnectionLostScene.js";


export class GameScene extends Phaser.Scene{
    constructor() {
        super('GameScene')
    }

    preload(){
        //this.load.audio('musicaFondo','Assets/Game/Audio/(ARCHIVO POR METER)')
        
        this.load.audio('efectoSprint','Assets/Game/Audio/sprint.mp3')
        this.load.image('juego', 'Assets/Game/juego.jpg');
        this.load.image('caja', 'Assets/Game/Obstaculos/caja1.png');
        this.loadCats();
    }
    loadCats(){
        this.load.spritesheet('gato1Up', `Assets/Game/Animar/gato1/Sube.png`, {frameWidth: 60,frameHeight: 60});
        this.load.spritesheet('gato1Lado', `Assets/Game/Animar/gato1/Lado.png`, {frameWidth: 60,frameHeight: 60});
        this.load.spritesheet('gato1Down', `Assets/Game/Animar/gato1/Baja.png`, {frameWidth: 60,frameHeight: 60});

        this.load.spritesheet('gato2Up', `Assets/Game/Animar/gato2/Sube.png`, {frameWidth: 60,frameHeight: 60});
        this.load.spritesheet('gato2Lado', `Assets/Game/Animar/gato2/Lado.png`, {frameWidth: 60,frameHeight: 60});
        this.load.spritesheet('gato2Down', `Assets/Game/Animar/gato2/Baja.png`, {frameWidth: 60,frameHeight: 60});

        this.load.spritesheet('gato3Up', `Assets/Game/Animar/gato3/Sube.png`, {frameWidth: 60,frameHeight: 60});
        this.load.spritesheet('gato3Lado', `Assets/Game/Animar/gato3/Lado.png`, {frameWidth: 60,frameHeight: 60});
        this.load.spritesheet('gato3Down', `Assets/Game/Animar/gato3/Baja.png`, {frameWidth: 60,frameHeight: 60});

        this.load.spritesheet('gato4Up', `Assets/Game/Animar/gato4/Sube.png`, {frameWidth: 60,frameHeight: 60});
        this.load.spritesheet('gato4Lado', `Assets/Game/Animar/gato4/Lado.png`, {frameWidth: 60,frameHeight: 60});
        this.load.spritesheet('gato4Down', `Assets/Game/Animar/gato4/Baja.png`, {frameWidth: 60,frameHeight: 60});

        this.load.spritesheet('gato5Up', `Assets/Game/Animar/gato5/Sube.png`, {frameWidth: 60,frameHeight: 60});
        this.load.spritesheet('gato5Lado', `Assets/Game/Animar/gato5/Lado.png`, {frameWidth: 60,frameHeight: 60});
        this.load.spritesheet('gato5Down', `Assets/Game/Animar/gato5/Baja.png`, {frameWidth: 60,frameHeight: 60});

        this.load.spritesheet('gato6Up', `Assets/Game/Animar/gato6/Sube.png`, {frameWidth: 60,frameHeight: 60});
        this.load.spritesheet('gato6Lado', `Assets/Game/Animar/gato6/Lado.png`, {frameWidth: 60,frameHeight: 60});
        this.load.spritesheet('gato6Down', `Assets/Game/Animar/gato6/Baja.png`, {frameWidth: 60,frameHeight: 60});
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

    create(traspaso) {
        //this.sound.add('musicaFondo').play();
        this.background = this.add.image(600, -350, 'juego').setOrigin(0.5);
        // Score texts
        this.scoreLeft = this.add.text(30, 50, '1º', {
            fontSize: '48px',
            color: '#2ba304ff'
        })

        this.scoreRight = this.add.text(1100, 50, '2º', {
            fontSize: '48px',
            color: '#a23062ff'
        })
        // Creamos las barras de sprint y las animaciones del gato 1
        var graphics1 = this.add.graphics();
        graphics1.fillStyle(0x97A13B);
        graphics1.fillRect(0, 0, 400, 50);
        graphics1.generateTexture(`sprintPJ1`, 400, 50);
        graphics1.destroy();

        this.sprintPJ1 = this.physics.add.sprite(90, 50, `sprintPJ1`).setOrigin(0);
        this.sprintPJ1.body.allowGravity = false;
        this.sprintPJ1.setImmovable(false);

        // Creamos las barras de sprint y las animaciones del gato 2
        var graphics = this.add.graphics();
        graphics.fillStyle(0xEDA3BB);
        graphics.fillRect(0, 0, 400, 50);
        graphics.generateTexture(`sprintPJ2`, 400, 50);
        graphics.destroy();

        this.sprintPJ2 = this.physics.add.sprite(700, 50, `sprintPJ2`).setOrigin(0);
        this.sprintPJ2.body.allowGravity = false;
        this.sprintPJ2.setImmovable(false);

        this.createBounds();
        this.setUpPlayers(traspaso);
        this.setUpObstacles();
        this.players.forEach(paddle=> {
            this.obstaculos.forEach(obs=>{
                this.physics.add.collider(paddle, obs,null, null, this);
                this.physics.add.overlap(obs,this.end, this.endWorld,null,this);
            })
            this.physics.add.overlap(this.goal, paddle, this.goalCondition,null,this);
            //this.physics.add.overlap( paddle, this.end, this.underScene,null,this);
        })


        this.escKey= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
/////////   LO COMENTADO ES PARTE DEL SERVIDOR, LO COMENTO PARA PODER USAR "npm run dev" SIN PROBLEMAS
        /*// Listener para cambios de conexión
        this.connectionListener = (data) => {
            if(!data.connected && this.scene.isActive())
            this.onConectionLost();
        };
        connectionManager.addListener(this.connectionListener);*/
    }
    /*onConectionLost(){
        this.scene.pause();
        this.scene.launch('ConnectionLostScene', {previousScene: 'GameScene'})
    }*/

    setUpPlayers(traspaso) {
        this.anims.create({
            key: 'cat1-walkX',
            frames: this.anims.generateFrameNumbers(traspaso.pj1+'Lado', { start: 0, end: 3 }),
            frameRate: 6,   // Velocidad
            repeat: -1      // Loop infinito mientras se mueve
        });
        this.anims.create({
            key: 'cat1-walkYDown',
            frames: this.anims.generateFrameNumbers(traspaso.pj1+'Down', { start: 0, end: 3 }),
            frameRate: 6,   // Velocidad
            repeat: -1      // Loop infinito mientras se mueve
        });
        
        this.anims.create({
            key: 'cat1-walkYUp',
            frames: this.anims.generateFrameNumbers(traspaso.pj1+'Up', { start: 0, end: 3 }),
            frameRate: 6,   // Velocidad
            repeat: -1      // Loop infinito mientras se mueve
        });

        const leftPaddle = new Cat(this, 'player1', 50, 300,traspaso.pj1+'Up', this.sprintPJ1,
            'efectoSprint','cat1-walkX','cat1-walkYUp','cat1-walkYDown');

        this.anims.create({
            key: 'cat2-walkX',
            frames: this.anims.generateFrameNumbers(traspaso.pj2+'Lado', { start: 0, end: 3 }),
            frameRate: 6,   // Velocidad
            repeat: -1      // Loop infinito mientras se mueve
        });
        this.anims.create({
            key: 'cat2-walkYDown',
            frames: this.anims.generateFrameNumbers(traspaso.pj2+'Down', { start: 0, end: 3 }),
            frameRate: 6,   // Velocidad
            repeat: -1      // Loop infinito mientras se mueve
        });
        
        this.anims.create({
            key: 'cat2-walkYUp',
            frames: this.anims.generateFrameNumbers(traspaso.pj2+'Up', { start: 0, end: 3 }),
            frameRate: 6,   // Velocidad
            repeat: -1      // Loop infinito mientras se mueve
        });
        const rightPaddle = new Cat(this, 'player2', 750, 300, traspaso.pj2+'Up', this.sprintPJ2,
            'efectoSprint','cat2-walkX','cat2-walkYUp','cat2-walkYDown');
        this.players.set('player1', leftPaddle);
        this.players.set('player2', rightPaddle);
        this.physics.add.collider(leftPaddle, rightPaddle,null, null, this);
        this.physics.add.collider(leftPaddle, rightPaddle,this.collisionVelocity, null, this)

        const InputConfig = [
            {
                playerId: 'player1',
                upKey: 'W',
                downKey: 'S',
                leftKey: 'A',
                rightKey: 'D',
                sprint: 'SPACE'
            }, 
            {
                playerId: 'player2',
                upKey: 'UP',
                downKey: 'DOWN',
                leftKey: 'LEFT',
                rightKey: 'RIGHT',
                sprint: 'ENTER'
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
                sprintObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.sprint]),
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
            this.endGame();
        }
    }

    // Se llama cuando el jugador toca el borde inferior
    underScene(pj, limite){
        if(this.worldVel>0){ // si es mayor significa que el mundo está en movimiento
            pj.disabled = pj.collision%2; // Cada frame se dibujará o no la imagen
            //console.log("choca");
            pj.y -= 50;
            pj.collision += 100;
            //console.log(pj + " a collision de "+ pj.collision)
        }
    }

    endWorld(obstaculo, fin){
            obstaculo.y = -70 - Math.random()*10; // Hacemos que suba de nuevo arriba

            obstaculo.x = Math.random()*(Math.abs(this.espacio-50)) + (obstaculo.x/this.espacio)*this.espacio; // Reubicamos en una posicion aleatoria
            //"(obstaculo.x/this.espacio)*this.espacio" asegura que se vuelva asituar en su region asignada sin pasarse a otras
            //console.log(obstaculo.sprite.x);
    }

    setPositions(){
        const j1 = this.players.get('player1');
        const j2 = this.players.get('player2');
        if (j1.y<j2.y){
            this.scoreRight.setText('2º');
            this.scoreLeft.setText('1º');
        }
        if (j1.y>j2.y){
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
        this.end.setVisible(false);
    }

    endGame(){
        this.players.forEach(paddle=> {
            paddle.effect.stop();
            paddle.setVelocity(0,0);
        })
        this.physics.pause();
        const winnerSprite = this.scoreLeft.text==='1º'?  'gato1':'gato2';
        const winnerText = this.scoreLeft.text==='1º'?'Gato Izquierdo gana!!':'Gato Derecho gana!!';
        this.add.text(400,250, winnerText, {
            fontSize:'64px',
            color: '#00ff00'
        }).setOrigin(0.5);

        this.scene.start('ResultsScene',{
            gato:winnerSprite,
            winText:winnerText
        });
        
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

        this.players.forEach(paddle=> {
            paddle.activeSpeed = (paddle.collision>0)? paddle.activeSpeed: paddle.baseSpeed;
            paddle.collision -= 1;
        })
        this.background.y += this.worldVel;
        if(this.escKey.isDown){
            this.tooglePause();
        }
        this.obstaculos.forEach(obstaculo=> {
             obstaculo.y += this.worldVel; 
        })
        this.inputsMapping.forEach(mapping => {
            const paddle = this.players.get(mapping.playerId);
            let speedX = 0;
            let speedY = this.worldVel;
            paddle.y += this.worldVel;
            if (mapping.upKeyObj.isDown){
                speedY += -paddle.activeSpeed;
                if(!paddle.movYUp.isPlaying)
                    paddle.anims.play(paddle.movYUp, true);
            }
            else if (mapping.downKeyObj.isDown){
                speedY += paddle.activeSpeed;
                if(!paddle.movYDown.isPlaying)
                    paddle.anims.play(paddle.movYDown, true);
            }
            
            if (mapping.leftKeyObj.isDown){
                speedX += -paddle.activeSpeed;
                paddle.flipX = false;         // Para voltear sprite
                if(!paddle.movX.isPlaying)
                    paddle.anims.play(paddle.movX, true);
            }
            else if (mapping.rightKeyObj.isDown){
                speedX += paddle.activeSpeed;
                paddle.flipX = true;         // Para voltear sprite
                paddle.anims.play(paddle.movX, true);
            }
            else if (speedY==this.worldVel){
                paddle.anims.stop(paddle.movX);         // O el frame que prefieras
            }
            if (mapping.sprintObj.isDown && paddle.sprintCharge.scaleX>0.005){
                speedX *= 1.3;
                speedY *= 1.3;
                paddle.sprintCharge.scaleX-=0.005;
                if(!paddle.effect.isPlaying&& paddle.sprintCharge.scaleX>0.01)
                    paddle.effect.play();
                if(paddle.sprintCharge.scaleX<0.01)
                    paddle.effect.stop();
            }

            else if(paddle.sprintCharge.scaleX<1) {
                paddle.sprintCharge.scaleX+=0.0025;
                paddle.effect.stop();
            }
            paddle.setVelocityY(speedY);
            paddle.setVelocityX(speedX);
        });
        this.setPositions();
    }
}