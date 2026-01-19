import Phaser from 'phaser';
import { Cat } from '../entities/Cat';
import { Obstaculo } from '../entities/Obstaculos';
import { connectionManager} from '../services/ConnectionManager';
//import { ConnectionLostScene } from "./ConnectionLostScene.js";

/**
 * Multiplayer Game Scene - Online pong game
 * Ball physics run on both clients (deterministic)
 * Server only tracks scores and relays paddle positions
 */
export class MultiplayerGameScene extends Phaser.Scene {

    constructor() {
        super('MultiplayerGameScene');
    }

    init(data) {
        this.ws = data.ws;
        this.playerRole = data.playerRole; // 'player1' or 'player2'
        this.roomId = data.roomId;
        this.isPaused = false;
        this.gameEnded = false;
        this.localPaddle = null;
        this.remotePaddle = null;
        this.localScore = 0;
        this.remoteScore = 0;
        this.cantidadX = 4;
        this.cantidadY = 13;
        this.obstaculos = new Map();
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
    setUpObstacles(){
            this.espacio = 860/this.cantidadX;
            this.altura = 2600/this.cantidadY;
            for(var posY = 0; posY <this.cantidadY; posY++){
                for(var index = 0;index<this.cantidadX;index++){
                    var x = 160 + Math.random()*(this.espacio) + index*this.espacio;
                    var y = Math.random()*(this.altura) + posY*this.altura;
                    this.obstaculos.set('obs'+index+'_'+posY,new Obstaculo(this, 'Caja'+index+'_'+posY, x, 
                    -y,'caja'));
                this.physics.add.collider(this.localPaddle, this.obstaculos.get('obs'+index+'_'+posY),this.breakbox, null, this);
                this.physics.add.collider(this.remotePaddle, this.obstaculos.get('obs'+index+'_'+posY),this.breakbox, null, this);
                this.physics.add.overlap(this.obstaculos.get('obs'+index+'_'+posY),this.end, this.endWorld,null,this);
                }

            }
            
            
        }
        endWorld(obstaculo, fin){
        this.obstaculos.delete(obstaculo.id);

        obstaculo.destroy();
        if (obstaculo.isBroken) {
            obstaculo.isBroken = false;
            obstaculo.setTexture('caja');
            obstaculo.body.checkCollision.none = false;
        }
    }
    breakbox(player, box){
        if(!player.force) return;
        box.body.checkCollision.none = true;
        this.obstaculos.delete(box.id);
        box.setTexture('caja_rota');
        this.time.delayedCall(1000, () => {
                box.destroy();
            });
    }
    preload(){
        this.load.audio('efectoSprint','Assets/Game/Audio/sprint.mp3')
        this.load.image('Juegoo', 'Assets/Game/Juegoo.png');
        this.load.image('caja', 'Assets/Game/Obstaculos/caja1.png');
        this.load.image('caja_rota', 'Assets/Game/Obstaculos/Caja rota.png');
        this.loadCats();
    }
    create() {
        
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.background = this.add.image(600, -350, 'Juegoo').setOrigin(0.5);
        this.createBounds();
        this.setUpPlayers();
        this.setUpObstacles();
            this.physics.add.overlap(this.goal, this.localPaddle, this.goalCondition,null,this);
            this.physics.add.overlap(this.goal, this.remotePaddle, this.goalCondition,null,this);
        // Score texts
        this.scoreLeft = this.add.text(30,49, '¡ya!', {
            fontFamily: 'MiFuente',
            fontSize: '48px',
            color: '#000000ff'
        })

        this.scoreRight = this.add.text(1120, 49, '¡ya!', {

            fontFamily: 'MiFuente',
            fontSize: '48px',
             color: '#000000ff'
        })

        // Role indicator
        const roleText = this.playerRole === 'player1' ? 'You are Player 1 (Left)' : 'You are Player 2 (Right)';
        this.add.text(400, 20, roleText, {
            fontSize: '16px',
            color: '#ffff00'
        }).setOrigin(0.5);


        // Set up WebSocket listeners
        this.setupWebSocketListeners();

        // Set up input - both players use arrow keys
        this.cursors = this.input.keyboard.createCursorKeys();
        // Listener para cambios de conexión
        this.connectionListener = (data) => {
            if(!data.connected && this.scene.isActive())
            this.onConectionLost();
        };
        connectionManager.addListener(this.connectionListener);
    }
    onConectionLost(){
        this.scene.pause();
        this.scene.launch('ConnectionLostScene', {previousScene: 'GameScene'})
    }

    setUpPlayers() {
        // carga de assets de los gatos generales

        // Creamos las barras de sprint del gato 2
        var graphics1 = this.add.graphics();
        graphics1.fillStyle(0x97A13B);
        graphics1.fillRect(0, 0, 400, 50);
        graphics1.generateTexture(`sprintPJ1`, 400, 50);
        graphics1.destroy();
        this.sprintPJ1 = this.physics.add.sprite(90, 50, `sprintPJ1`).setOrigin(0);
        this.sprintPJ1.body.allowGravity = false;
        this.sprintPJ1.setImmovable(false);
        this.anims.create({
            key: 'cat1-walkX',
            frames: this.anims.generateFrameNumbers('gato1Lado', { start: 0, end: 3 }),
            frameRate: 6,   // Velocidad
            repeat: -1      // Loop infinito mientras se mueve
        });
        this.anims.create({
            key: 'cat1-walkYDown',
            frames: this.anims.generateFrameNumbers('gato1Down', { start: 0, end: 3 }),
            frameRate: 6,   // Velocidad
            repeat: -1      // Loop infinito mientras se mueve
        });
        this.anims.create({
            key: 'cat1-walkYUp',
            frames: this.anims.generateFrameNumbers('gato1Up', { start: 0, end: 3 }),
            frameRate: 6,   // Velocidad
            repeat: -1      // Loop infinito mientras se mueve
        });

        // Creamos las barras de sprint del gato 2
        var graphics = this.add.graphics();
        graphics.fillStyle(0xEDA3BB);
        graphics.fillRect(0, 0, 400, 50);
        graphics.generateTexture(`sprintPJ2`, 400, 50);
        graphics.destroy();
        this.sprintPJ2 = this.physics.add.sprite(700, 50, `sprintPJ2`).setOrigin(0);
        this.sprintPJ2.body.allowGravity = false;
        this.sprintPJ2.setImmovable(false);
        this.anims.create({
            key: 'cat2-walkX',
            frames: this.anims.generateFrameNumbers('gato2Lado', { start: 0, end: 3 }),
            frameRate: 6,   // Velocidad
            repeat: -1      // Loop infinito mientras se mueve
        });
        this.anims.create({
            key: 'cat2-walkYDown',
            frames: this.anims.generateFrameNumbers('gato2Down', { start: 0, end: 3 }),
            frameRate: 6,   // Velocidad
            repeat: -1      // Loop infinito mientras se mueve
        });
        this.anims.create({
            key: 'cat2-walkYUp',
            frames: this.anims.generateFrameNumbers('gato1Up', { start: 0, end: 3 }),
            frameRate: 6,   // Velocidad
            repeat: -1      // Loop infinito mientras se mueve
        });

        // Asiganción de los jugadores    
        if (this.playerRole === 'player1') {
            this.localPaddle = new Cat(this, 'player1', 370, 300,'gato1Up', this.sprintPJ1,
            'efectoSprint','cat1-walkX','cat1-walkYUp','cat1-walkYDown');
            this.remotePaddle = new Cat(this, 'player2', 780, 300, 'gato2Up', this.sprintPJ2,
            'efectoSprint','cat2-walkX','cat2-walkYUp','cat2-walkYDown');
        } else {
            this.localPaddle = new Cat(this, 'player2', 780, 300, 'gato2Up', this.sprintPJ2,
            'efectoSprint','cat2-walkX','cat2-walkYUp','cat2-walkYDown');
            this.remotePaddle = new Cat(this, 'player1', 370, 300,'gato1Up', this.sprintPJ1,
            'efectoSprint','cat1-walkX','cat1-walkYUp','cat1-walkYDown');
        }
        
        this.physics.add.collider(this.localPaddle, this.remotePaddle);
    } 
    setPositions(){
        let j1 = this.localPaddle;
        let j2 = this.remotePaddle;
        if (this.playerRole === 'player1'){
            if (j1.y<j2.y){
                this.scoreRight.setText('2º');
                this.scoreLeft.setText('1º');
            }
            if (j1.y>j2.y){
                this.scoreRight.setText('1º');
                this.scoreLeft.setText('2º');
            }
        }
        else{
            if (j1.y<j2.y){
                this.scoreRight.setText('1º');
                this.scoreLeft.setText('2º');
            }
            if (j1.y>j2.y){
                this.scoreRight.setText('2º');
                this.scoreLeft.setText('1º');
            }
        }
    }
    goalCondition(meta, pj){
        if (this.background.y>=2220){
            this.endGame();
        }
    }
    setupWebSocketListeners() {
        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleServerMessage(data);
            } catch (error) {
                console.error('Error parsing server message:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket connection closed');
            if (!this.gameEnded) {
                this.handleDisconnection();
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            if (!this.gameEnded) {
                this.handleDisconnection();
            }
        };
    }

    handleServerMessage(data) {
        switch (data.type) {
            case 'paddleUpdate':
                // Update opponent's paddle position
                this.remotePaddle.y = data.y;
                this.remotePaddle.x = data.x;
                this.remotePaddle.sprintCharge.scaleX = data.scale;
                this.scoreLeft.text = data.pos1;
                this.scoreRight.text = data.pos2;

                break;

            case 'scoreUpdate':
                // Update scores from server
                this.localScore = this.playerRole === 'player1' ? data.player1Score : data.player2Score;
                this.remoteScore = this.playerRole === 'player1' ? data.player2Score : data.player1Score;

                this.scoreLeft.setText(data.player1Score.toString());
                this.scoreRight.setText(data.player2Score.toString());
                break;

            case 'ballRelaunch':
                break;

            case 'gameOver':
                this.endGame();
                break;

            case 'playerDisconnected':
                this.handleDisconnection();
                break;

            default:
                console.log('Unknown message type:', data.type);
        }
    }

    endGame() {
        this.gameEnded = true;
        this.localPaddle.setVelocity(0, 0);
        this.remotePaddle.setVelocity(0, 0);
        
        this.physics.pause();

        const p1IsWinner = this.scoreLeft.text === '1º';
        const winnerText    = p1IsWinner ? 'JUGADOR 1' : 'JUGADOR 2';
        const winnerGatoKey = p1IsWinner ? 'gato1' : 'gato2';

        this.scene.start('ResultsScene', {
        gato: winnerGatoKey,  // 'gatoTipo1', 'gatoTipo2', ...
        winText: winnerText
        });

    }

    handleDisconnection() {
        this.gameEnded = true;
        this.localPaddle.setVelocity(0, 0);
        this.remotePaddle.setVelocity(0, 0);
        this.physics.pause();

        this.add.text(400, 250, 'Opponent Disconnected', {
            fontSize: '48px',
            color: '#ff0000'
        }).setOrigin(0.5);

        this.createMenuButton();
    }

    createMenuButton() {
        const menuBtn = this.add.text(400, 400, 'Return to Main Menu', {
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => menuBtn.setColor('#cccccc'))
        .on('pointerout', () => menuBtn.setColor('#ffffff'))
        .on('pointerdown', () => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.close();
            }
            this.scene.start('MenuScene');
        });
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

       // LÍMITE IZQUIERDO
        this.boundLeft = this.physics.add.sprite(160, 350, null);
        this.boundLeft.setDisplaySize(20, 700);
        this.boundLeft.body.setSize(20, 700);
        this.boundLeft.setImmovable(true);
        this.boundLeft.setVisible(false);

        // LÍMITE DERECHO
        this.boundRight = this.physics.add.sprite(1040, 350, null);
        this.boundRight.setDisplaySize(20, 700);
        this.boundRight.body.setSize(20, 700);
        this.boundRight.setImmovable(true);
        this.boundRight.setVisible(false);
    }

    sendMessage(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    update(time, delta) {
    if (this.gameEnded) return;

    this.worldVel = this.background.y<2220? delta/10 :  0;
    this.obstaculos.forEach(obstaculo=> {
             obstaculo.y += this.worldVel; 
        })
    this.background.y += this.worldVel;
    let speedX = 1;
    let speedY = 1;

    // ===== SPRINT =====
    if (this.spaceBar.isDown && this.localPaddle.sprintCharge.scaleX > 0) {

        speedX = 1.3;
        speedY = 1.3;

        this.localPaddle.sprintCharge.scaleX -= 0.0005 * delta;

        this.localPaddle.sprintCharge.scaleX = Math.max(
            this.localPaddle.sprintCharge.scaleX,
            0
        );

        if (!this.localPaddle.effect.isPlaying) {
            this.localPaddle.effect.play();
        }

    } else {
        // ===== RECARGA =====
        if (this.localPaddle.sprintCharge.scaleX < 1) {
            this.localPaddle.sprintCharge.scaleX += 0.00003 * delta;
        }

        if (this.localPaddle.effect.isPlaying) {
            this.localPaddle.effect.stop();
        }
    }

    // ===== MOVIMIENTO =====
    const speed = 300;

    this.localPaddle.setVelocity(
        (this.cursors.left.isDown ? -1 : this.cursors.right.isDown ? 1 : 0) * speed * speedX,
        (this.cursors.up.isDown ? -1 : this.cursors.down.isDown ? 1 : this.worldVel/4) * speed * speedY
    );

    this.setPositions();
    // ===== SYNC SERVER =====
    this.sendMessage({
        type: 'paddleMove',
        y: this.localPaddle.y,
        x: this.localPaddle.x,
        scale: this.localPaddle.sprintCharge.scaleX,
        pos1:this.scoreLeft.text,
        pos2:this.scoreRight.text
    });
    if ((
    this.localPaddle.y <= this.goal.y+40 ||
    this.remotePaddle.y <= this.goal.y+40)&& this.worldVel==0)
 {
    this.endGame();
}

}


    shutdown() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.close();
        }
    }
}
