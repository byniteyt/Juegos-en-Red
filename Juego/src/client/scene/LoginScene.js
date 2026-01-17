import Phaser from "phaser";
export class LoginScene extends Phaser.Scene
{
    preload ()
    {
        /*this.load.setBaseURL('https://cdn.phaserfiles.com/v385');
        this.load.html('nameform', 'assets/text/loginform.html');
        this.load.image('pic', 'assets/pics/turkey-1985086.jpg');*/
    }

    create ()
    {
        //this.add.image(400, 300, 'pic');

        const text = this.add.text(10, 10, 'Login player', { color: 'white', fontFamily: 'Arial', fontSize: '32px '});
        this.add.rectangle(400, 450, 300, 50, 0x444444);

        const element = this.add.dom(400, 600).createFromCache('nameform');

        element.addListener('click');

        element.on('click', function (event)
        {

            if (event.target.name === 'loginButton')
            {
                // @ts-ignore
                const inputUsername = this.getChildByName('username');
                // @ts-ignore
                const inputPassword = this.getChildByName('password');

                //  Have they entered anything?
                if (inputUsername.value !== '' && inputPassword.value !== '')
                {
                    //  Turn off the click events
                    // @ts-ignore
                    this.removeListener('click');

                    //  Tween the login form out
                    // @ts-ignore
                    this.scene.tweens.add({ targets: element.rotate3d, x: 1, w: 90, duration: 3000, ease: 'Power3' });

                    // @ts-ignore
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
                    // @ts-ignore
                    this.scene.tweens.add({ targets: text, alpha: 0.1, duration: 200, ease: 'Power3', yoyo: true });
                }
            }

        });

    }
}