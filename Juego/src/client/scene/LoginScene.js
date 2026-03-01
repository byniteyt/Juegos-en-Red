import Phaser from "phaser";

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
        this.add.image(600, 350, 'credits');
        const text = this.add.text(600, 80, 'Please login to play', { color: 'black', fontFamily: 'Arial', fontSize: '32px '});

        const element = this.add.dom(600, 350).createFromCache('nameform');

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
                    text.setText(`Welcome ${inputUsername.value}\n Starting the game...`);
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
}