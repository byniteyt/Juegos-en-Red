import Phaser from "phaser";

export class LoginScene extends Phaser.Scene {

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
    }
}
