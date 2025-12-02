import Phaser from "phaser";
export class PauseScene extends Phaser.Scene{
    constructor(){
        super('PauseScene');
    }
    create(data){
        this.add.text(400,160,'Pausado',{
            fontSize: '64px',
            color: '#EDA3BB'
        }).setOrigin(0.5);

        const resumeBtn = this.add.text(400,320, 'Reanudar',{
            fontSize:'60px',
            color: '#EDA3BB'
        }).setOrigin(0.5).setInteractive({useHandCursor:true})
        .on('pointerover',()=>resumeBtn.setColor('#F4DFE6'))
        .on('pointerout',()=>resumeBtn.setColor('#EDA3BB'))
        .on('pointerdown', ()=>{
            this.scene.stop();
            this.scene.resume(data.originalScene);
            this.scene.get(data.originalScene).resume();
        });

        const homeBtn = this.add.text(400,520, 'Menú inicial',{
            fontSize:'60px',
            color: '#EDA3BB'
        }).setOrigin(0.5).setInteractive({useHandCursor:true})
        .on('pointerover',()=>homeBtn.setColor('#F4DFE6'))
        .on('pointerout',()=>homeBtn.setColor('#EDA3BB'))
        .on('pointerdown', ()=>{
            this.scene.stop();
            this.scene.stop(data.originalScene);
            this.scene.launch('MenuScene');
        });
    }
}