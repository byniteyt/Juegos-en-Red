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

        this.add.text(600, 125,'PAUSA',{
            fontFamily: 'MiFuente',
            fontSize: '90px',
            color: '#000000ff'
        }).setOrigin(0.5);

        const resumeBtn = this.add.text(600,290, 'Reanudar',{
            fontFamily: 'MiFuente',
            fontSize:'40px',
            color: '#EDA3BB'
        }).setOrigin(0.5).setInteractive({useHandCursor:true})
        .on('pointerover',()=>resumeBtn.setColor('#f7e5f4ff'))
        .on('pointerout',()=>resumeBtn.setColor('#EDA3BB'))
        .on('pointerdown', ()=>{
            this.scene.stop();
            this.scene.resume(data.originalScene);
            this.scene.get(data.originalScene).resume();
        });

        const homeBtn = this.add.text(600,380, 'Menú inicial',{
            fontFamily: 'MiFuente',
            fontSize:'40px',
            color: '#276d21ff'
        }).setOrigin(0.5).setInteractive({useHandCursor:true})
        .on('pointerover',()=>homeBtn.setColor('#c6e2c4ff'))
        .on('pointerout',()=>homeBtn.setColor('#276d21ff'))
        .on('pointerdown', ()=>{
            this.scene.stop();
            this.scene.stop(data.originalScene);
            this.scene.launch('MenuScene');
        });
    }
}