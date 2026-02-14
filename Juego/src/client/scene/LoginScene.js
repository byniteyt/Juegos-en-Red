import Phaser from "phaser";

export class LoginScene extends Phaser.Scene 
{
    preload ()
    {
        this.load.html('nameform', 'Assets/Login/loginform.html');
    }

    create ()
    {
        const text = this.add.text(10, 10, 'Please login to play', { color: 'white', fontFamily: 'Arial', fontSize: '32px '});

        const element = this.add.dom(400, 600).createFromCache('nameform');

        element.addListener('click');

        element.on('click', function (event)
        {
            if (event.target.name === 'loginButton')
            {
                const inputUsername = this.getChildByName('username');
                const inputPassword = this.getChildByName('password');

                //  Have they entered anything?
                if (inputUsername.value !== '' && inputPassword.value !== '')
                {
                    //  Turn off the click events
                    this.removeListener('click');

                    //  Tween the login form out
                    this.scene.tweens.add({ targets: element.rotate3d, x: 1, w: 90, duration: 3000, ease: 'Power3' });

                    this.scene.tweens.add({
                        targets: element, scaleX: 2, scaleY: 2, y: 700, duration: 3000, ease: 'Power3',
                        onComplete: function ()
                        {
                            element.setVisible(false);
                        }
                    });

                    //  Populate the text with whatever they typed in as the username!
                    text.setText(`Welcome ${inputUsername.value}`);
                }
                else
                {
                    //  Flash the prompt
                    this.scene.tweens.add({ targets: text, alpha: 0.1, duration: 200, ease: 'Power3', yoyo: true });
                }
            }
        });

        this.tweens.add({
            targets: element,
            y: 300,
            duration: 3000,
            ease: 'Power3'
        });
    }

    /* Esto es la parte que tratamos de hacer por nuestra cuenta
    constructor() {
        super('LoginScene')
    }

    preload() {
        this.load.image('login', 'Assets/Credits/Fondo_pantallas.png');
    }

    create() {
        this.add.image(600, 350, 'login');
    }

    loginInput() {
        let text = "";
        let inputText = this.add.text(800, 290, '', {
            fontFamily: 'MiFuente',    
            fontSize: '24px',
            color: '#000000ff'
        }).setOrigin(0.3);;

        this.input.keyboard.on('keydown',(event)=>{
            // Borrar
            if(event.keyCode === 8 && text.length > 0) {
                text = text.slice(0, -1);
                updateText();
            }
            // Enter / finalizar
            else if(event.keyCode === 13 && text.trim().length > 0) {
                this.input.keyboard.off('keydown');
            }
            // Texto del input del usuario
            else if(event.keyCode === 1 && text.trim().length < 12) {
                // No permitir caracteres que no sean números o letras
                if(/[a-zA-Z0-9 _-]/.test(event.key)) {
                    text += event.key;
                }
            }
        });

        const updateText = () => {
            inputText.setText(text);
            const textWidth = inputText.width;
        }
    }*/
}
