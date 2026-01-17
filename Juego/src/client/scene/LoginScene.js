import Phaser from "phaser";
export class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene')
    }
    update(){
        this.input.keyboard.on('keydown',(event)=>{
            if(event.key){
                //
            }
        })
    }
}
