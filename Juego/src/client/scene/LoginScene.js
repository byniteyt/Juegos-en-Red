import Phaser from "phaser";
import { connectionManager } from '../services/ConnectionManager';

export class LoginScene extends Phaser.Scene 
{
    constructor() {
    super('LoginScene');
  }

    preload ()
    {
        this.load.html('nameform', 'Assets/Login/loginform.html');
        this.load.image('credits', 'Assets/Credits/Fondo_pantallas.png');
    }
    create ()
    {
        const scene = this;
        this.add.image(600, 350, 'credits');
        this.text = this.add.text(600, 80, 'Please login to play', 
            { color: 'black', fontFamily: 'MiFuente', fontSize: '32px '})
            .setOrigin(0.5);

        const element = this.add.dom(600, 350).createFromCache('nameform');

        element.addListener('click');

        element.on('click', async function (event)
        {
            if (event.target.name === 'loginButton')
            {
                const inputUsername = this.getChildByName('username');
                const inputPassword = this.getChildByName('password');

                //  Have they entered anything?
                if (inputUsername.value !== '' && inputPassword.value !== ''        //Si no valores en al menos un campo nos salimos 
                    &&scene.text.text != 'Servidor: Desconectado')                  //Si no hay conexion al server nos salimos 
                {
                    try {
                            
                            var response = await fetch('/api/users', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    name: inputUsername.value,
                                    password: inputPassword.value,
                                    avatar: '',
                                    level: 1
                                })
                            });

                            if (!response.ok) {
                                response = await fetch(`/api/users/${inputUsername.value}`,{
                                method: 'GET'});

                                const data = await response.json();

                                if (!response.ok) {
                                    throw new Error(data.error || 'Error creando usuario');
                                }
                                if(data.password != inputPassword.value){
                                    throw new Error('La contraseña no es correcta');
                                }

                                // Usuario cargado correctamente
                                scene.text.setText(`Welcome ${data.name}\nStarting the game...`);

                                scene.scene.start('MenuScene', {
                                    playerName: data.name
                                });
                            }

                            const user = await response.json();

                            // Usuario creado correctamente
                            scene.text.setText(`Welcome ${user.name}\nStarting the game...`);

                            scene.scene.start('MenuScene', {
                                    playerName: user.name
                                });

                        }catch(error) {
                            scene.text.setText(error.message);
                            scene.text.setColor('#ff0000');
                        }
                }
                else
                {
                    //  Flash the prompt
                    this.scene.tweens.add({ targets: scene.text, alpha: 0.1, duration: 200, ease: 'Power3', yoyo: true });
                }
            }
        });

        this.tweens.add({
            targets: element,
            y: 300,
            duration: 3000,
            ease: 'Power3'
        });
        
        this.connectionListener = (data) => {
                    this.updateConnectionDisplay(data);
                };
        connectionManager.addListener(this.connectionListener);
    }
    updateConnectionDisplay(data) {
        // Solo actualizar si el texto existe (la escena está creada)
        if (!this.text || !this.scene || !this.scene.isActive('LoginScene')) {
            return;
        }

        try {
            if (data.connected) {
                if(this.text.text == 'Servidor: Desconectado')      // Actualizamos solamente si el server estaba caido
                this.text.setText('Please login to play');
                this.text.setColor('rgb(18, 16, 16)');
            } else {
                this.text.setText('Servidor: Desconectado');
                this.text.setColor('#d63838ff');
            }
        } catch (error) {
            console.error('[MenuScene] Error updating connection display:', error);
        }
    }

    connectToServer() {
    try {
      // Connect to WebSocket server (same host as web server)
        const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
        const wsUrl = `${protocol}://${location.host}`;
        this.ws = new WebSocket(wsUrl);
        console.log("Conectado al servidor: "+wsUrl);

        this.ws.onopen = () => {
            console.log('Connected to WebSocket server');
            console.log("Conectado al servidor: "+wsUrl);

            // Join matchmaking queue
            this.ws.send(JSON.stringify({ type: 'joinQueue' }));
        };

      this.ws.onmessage = (event) => {
            try {
            const data = JSON.parse(event.data);
            this.handleServerMessage(data);
            } catch (error) {
            console.error('Error parsing server message:', error);
            }
        };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        //this.statusText.setText('Connection error!');
        //this.statusText.setColor('#ff0000');
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        if (this.scene.isActive('LobbyScene')) {
            
          //this.statusText.setText('Connection lost!');
          //this.statusText.setColor('#ff0000');
        }
      };
    } catch (error) {
      console.error('Error connecting to server:', error);
      //this.statusText.setText('Failed to connect!');
      //this.statusText.setColor('#ff0000');
    }
  }
  handleServerMessage(data) {
    switch (data.type) {
      case 'queueStatus':
        break;

      default:
        console.log('Unknown message type:', data.type);
    }
  }
}