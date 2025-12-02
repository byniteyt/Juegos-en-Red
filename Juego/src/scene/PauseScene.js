import Phaser from "phaser";
export class PauseScene extends Phaser.Scene{
    constructor(){
        super('PauseScene');
    }
    create(data){
        this.add.text(400,160,'Pausado',{
            fontSize: '64px'
        }).setOrigin(0.5);
        const resumeBtn = this.add.text(400,320, 'Reanudar',{
            fontSize:'60px'
        }).setOrigin(0.5).setInteractive({useHandCursor:true})
        .on('pointerover',()=>resumeBtn.setColor('#ff0000'))
        .on('pointerout',()=>resumeBtn.setColor('#00ff00'))
        .on('pointerdown', ()=>{
            this.scene.stop();
            this.scene.resume(data.originalScene);
            this.scene.get(data.originalScene).resume();
        });
        const homeBtn = this.add.text(400,520, 'Menú inicial',{
            fontSize:'60px'
        }).setOrigin(0.5).setInteractive({useHandCursor:true})
        .on('pointerover',()=>homeBtn.setColor('#ff0000'))
        .on('pointerout',()=>homeBtn.setColor('#00ff00'))
        .on('pointerdown', ()=>{
            this.scene.stop();
            this.scene.stop(data.originalScene);
            this.scene.launch('MenuScene');
        });
    }
}