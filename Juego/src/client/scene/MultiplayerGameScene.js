import Phaser from 'phaser';
import { Cat } from '../entities/Cat';

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
        this.initialBall = data.initialBall;
        this.ball = null;
        this.isPaused = false;
        this.gameEnded = false;
        this.localPaddle = null;
        this.remotePaddle = null;
        this.localScore = 0;
        this.remoteScore = 0;
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

    preload(){
        this.loadCats();
    }
    create() {
        this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);

        // Center discontinued line
        for (let i = 0; i < 12; i++) {
            this.add.rectangle(400, i * 50 + 25, 10, 30, 0x444444);
        }

        // Score texts
        this.scoreLeft = this.add.text(100, 50, '0', {
            fontSize: '48px',
            color: '#00ff00'
        });

        this.scoreRight = this.add.text(700, 50, '0', {
            fontSize: '48px',
            color: '#00ff00'
        });

        // Role indicator
        const roleText = this.playerRole === 'player1' ? 'You are Player 1 (Left)' : 'You are Player 2 (Right)';
        this.add.text(400, 20, roleText, {
            fontSize: '16px',
            color: '#ffff00'
        }).setOrigin(0.5);

        this.createBounds();
        this.createBall();
        this.setUpPlayers();

        // Add colliders
        this.physics.add.collider(this.ball, this.localPaddle);
        this.physics.add.collider(this.ball, this.remotePaddle);
        this.physics.add.overlap(this.ball, this.leftGoal, this.scoreLeftGoal, null, this);
        this.physics.add.overlap(this.ball, this.rightGoal, this.scoreRightGoal, null, this);

        // Set up WebSocket listeners
        this.setupWebSocketListeners();

        // Set up input - both players use arrow keys
        this.cursors = this.input.keyboard.createCursorKeys();

        // Launch ball with server-provided initial state
        this.ball.setVelocity(this.initialBall.vx, this.initialBall.vy);
    }

    setUpPlayers() {
        // Create paddles based on player role
        if (this.playerRole === 'player1') {
            this.localPaddle = new Cat(this, 'player1', 370, 300,'gato1Up', null,
            null,'gato1Up','gato1Up','gato1Up');
            this.remotePaddle = new Cat(this, 'player1', 370, 300,'gato1Up', null,
            null,'gato1Up','gato1Up','gato1Up');
        } else {
            this.localPaddle = new Cat(this, 'player2', 750, 300);
            this.remotePaddle = new Cat(this, 'player1', 50, 300);
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
                break;

            case 'scoreUpdate':
                // Update scores from server
                this.localScore = this.playerRole === 'player1' ? data.player1Score : data.player2Score;
                this.remoteScore = this.playerRole === 'player1' ? data.player2Score : data.player1Score;

                this.scoreLeft.setText(data.player1Score.toString());
                this.scoreRight.setText(data.player2Score.toString());

                // Stop ball, server will relaunch it
                this.ball.setVelocity(0, 0);
                this.ball.setPosition(400, 300);
                break;

            case 'ballRelaunch':
                // Server is relaunching the ball with new velocity
                this.ball.setPosition(data.ball.x, data.ball.y);
                this.ball.setVelocity(data.ball.vx, data.ball.vy);
                break;

            case 'gameOver':
                this.endGame(data.winner, data.player1Score, data.player2Score);
                break;

            case 'playerDisconnected':
                this.handleDisconnection();
                break;

            default:
                console.log('Unknown message type:', data.type);
        }
    }

    scoreLeftGoal() {
        if (this.gameEnded) return;

        // Ball hit LEFT goal (x=0), so notify server
        this.sendMessage({ type: 'goal', side: 'left' });
    }

    scoreRightGoal() {
        if (this.gameEnded) return;

        // Ball hit RIGHT goal (x=800), so notify server
        this.sendMessage({ type: 'goal', side: 'right' });
    }

    endGame(winner, player1Score, player2Score) {
        this.gameEnded = true;
        this.ball.setVelocity(0, 0);
        this.localPaddle.setVelocity(0, 0);
        this.remotePaddle.setVelocity(0, 0);
        this.physics.pause();

        const isWinner = (winner === 'player1' && this.playerRole === 'player1') ||
                        (winner === 'player2' && this.playerRole === 'player2');

        const winnerText = isWinner ? 'You Win!' : 'You Lose!';
        const color = isWinner ? '#00ff00' : '#ff0000';

        this.add.text(400, 200, winnerText, {
            fontSize: '64px',
            color: color
        }).setOrigin(0.5);

        this.add.text(400, 280, `Final Score: ${player1Score} - ${player2Score}`, {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.createMenuButton();
    }

    handleDisconnection() {
        this.gameEnded = true;
        this.ball.setVelocity(0, 0);
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

    createBall() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('ball-multi', 16, 16);
        graphics.destroy();

        this.ball = this.physics.add.sprite(400, 300, 'ball-multi');
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1);
    }

    createBounds() {
        this.leftGoal = this.physics.add.sprite(0, 300, null);
        this.leftGoal.setDisplaySize(10, 600);
        this.leftGoal.body.setSize(10, 600);
        this.leftGoal.setImmovable(true);
        this.leftGoal.setVisible(false);

        this.rightGoal = this.physics.add.sprite(800, 300, null);
        this.rightGoal.setDisplaySize(10, 600);
        this.rightGoal.body.setSize(10, 600);
        this.rightGoal.setImmovable(true);
        this.rightGoal.setVisible(false);
    }

    sendMessage(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    update() {
        if (this.gameEnded) return;

        // Handle local paddle input - both players use arrow keys
        let direction = null;
        if (this.cursors.up.isDown) {
            direction = 'up';
        } else if (this.cursors.down.isDown) {
            direction = 'down';
        } else {
            direction = 'stop';
        }

        // Move local paddle
        const speed = 300;
        if (direction === 'up') {
            this.localPaddle.setVelocityY(-speed);
        } else if (direction === 'down') {
            this.localPaddle.setVelocityY(speed);
        } else {
            this.localPaddle.setVelocityY(0);
        }

        // Send paddle position to server
        this.sendMessage({
            type: 'paddleMove',
            y: this.localPaddle.y
        });
    }

    shutdown() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.close();
        }
    }
}
