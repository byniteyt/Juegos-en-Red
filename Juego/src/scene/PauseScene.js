import Phaser from "phaser";
export class PauseScene extends Phaser.Scene{
    constructor(){
        super('PauseScene');
    }

    preload() {
        this.load.image('pause', 'Assets/Credits/Fondo_pantallas.png');
    }

    create(data){
        this.add.image(600, 350, 'pause');

        this.add.text(600,160,'Pausado',{
            fontSize: '64px',
            color: '#EDA3BB'
        }).setOrigin(0.5);

        const resumeBtn = this.add.text(600,300, 'Reanudar',{
            fontSize:'40px',
            color: '#EDA3BB'
        }).setOrigin(0.5).setInteractive({useHandCursor:true})
        .on('pointerover',()=>resumeBtn.setColor('#F4DFE6'))
        .on('pointerout',()=>resumeBtn.setColor('#EDA3BB'))
        .on('pointerdown', ()=>{
            this.scene.stop();
            this.scene.resume(data.originalScene);
            this.scene.get(data.originalScene).resume();
        });

        const homeBtn = this.add.text(600,380, 'Menú inicial',{
            fontSize:'40px',
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