/* eslint-disable no-unused-vars */
import Phaser from "phaser";
import { Cat } from "../entities/Cat.js";
export class SelectCatScene extends Phaser.Scene{
    constructor() {
        super('SelectCatScene')
    }
    preload(){
        //#region Gato Inicial
        this.load.image('gato1-Vacio', 'Assets/Selection/Gato1/Vacio.png'); 
        this.load.image('gato1-PJ1', 'Assets/Selection/Gato1/PJ1.png'); 
        this.load.image('gato1-PJ2', 'Assets/Selection/Gato1/PJ2.png'); 
        this.load.image('gato1-Ambos', 'Assets/Selection/Gato1/Both.png'); 
        //#endregion
        
        //#region Gato Alegre
        this.load.image('gato6-Vacio', 'Assets/Selection/Gato6/Vacio.png'); 
        this.load.image('gato6-PJ1', 'Assets/Selection/Gato6/PJ1.png'); 
        this.load.image('gato6-PJ2', 'Assets/Selection/Gato6/PJ2.png'); 
        this.load.image('gato6-Ambos', 'Assets/Selection/Gato6/Both.png'); 
        //#endregion
        
        //#region Gato Negro
        this.load.image('gato5-Vacio', 'Assets/Selection/Gato5/Vacio.png'); 
        this.load.image('gato5-PJ1', 'Assets/Selection/Gato5/PJ1.png'); 
        this.load.image('gato5-PJ2', 'Assets/Selection/Gato5/PJ2.png'); 
        this.load.image('gato5-Ambos', 'Assets/Selection/Gato5/Both.png'); 
        //#endregion

        //#region Gato Peludo
        this.load.image('gato4-Vacio', 'Assets/Selection/Gato4/Vacio.png'); 
        this.load.image('gato4-PJ1', 'Assets/Selection/Gato4/PJ1.png'); 
        this.load.image('gato4-PJ2', 'Assets/Selection/Gato4/PJ2.png'); 
        this.load.image('gato4-Ambos', 'Assets/Selection/Gato4/Both.png'); 
        //#endregion

        //#region Gato Gordo
        this.load.image('gato3-Vacio', 'Assets/Selection/Gato3/Vacio.png'); 
        this.load.image('gato3-PJ1', 'Assets/Selection/Gato3/PJ1.png'); 
        this.load.image('gato3-PJ2', 'Assets/Selection/Gato3/PJ2.png'); 
        this.load.image('gato3-Ambos', 'Assets/Selection/Gato3/Both.png'); 
        //#endregion

        //#region Gato Pasota
        this.load.image('gato2-Vacio', 'Assets/Selection/Gato2/Vacio.png');
        this.load.image('gato2-PJ1', 'Assets/Selection/Gato2/PJ1.png'); 
        this.load.image('gato2-PJ2', 'Assets/Selection/Gato2/PJ2.png'); 
        this.load.image('gato2-Ambos', 'Assets/Selection/Gato2/Both.png'); 
        //#endregion
    }
    create(traspaso){
        this.traspaso = traspaso;
        this.isPlayer1 = true;
        this.catPJ1 = null;
        this.catPJ2 = null;
        this.cat1 = this.add.image(300, 400, 'gato1-Vacio').setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () =>{
            this.selectedCat(this.cat1,'gato1')
        });
        this.cat2 = this.add.image(420, 400, 'gato2-Vacio').setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () =>{
            this.selectedCat(this.cat2,'gato2')
        });
        this.cat3 = this.add.image(540, 400, 'gato3-Vacio').setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () =>{
            this.selectedCat(this.cat3,'gato3')
        });
        this.cat4 = this.add.image(660, 400, 'gato4-Vacio').setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () =>{
            this.selectedCat(this.cat4,'gato4')
        });
        this.cat5 = this.add.image(780, 400, 'gato5-Vacio').setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () =>{
            this.selectedCat(this.cat5,'gato5')
        });
        this.cat6 = this.add.image(900, 400, 'gato6-Vacio').setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () =>{
            this.selectedCat(this.cat6,'gato6')
        });
        this.cats = {
            gato1: this.cat1,
            gato2: this.cat2,
            gato3: this.cat3,
            gato4: this.cat4,
            gato5: this.cat5,
            gato6: this.cat6
        };

        const startBtn = this.add.text(600, 570, 'Empezar juego', {
             fontFamily: 'MiFuente',
            fontSize: '50px',
            color: '#e05fdaff'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => startBtn.setStyle({ fontFamily: 'MiFuente',fill: '#ecc5eaff'}))
        .on('pointerout', () => startBtn.setStyle({fontFamily: 'MiFuente', fill: '#e05fdaff'}))
        .on('pointerdown', () => { this.startGame();});

        this.textoSelecciona = this.add.text(600, 125, '¡Elegid vuestros gatos!', {
            fontFamily: 'MiFuente',
            fontSize: '90px',
            color: '#000000ff'
        }).setOrigin(0.5);

        this.activePLayer = this.add.text(600, 250, 'Jugador 1: ', {
            fontFamily: 'MiFuente',
            fontSize: '50px',
            color: '#43c8e2'
        }).setOrigin(0.5);
    }
    update(){
        
    }
    selectedCat(catSprite, catId) {

    if (this.isPlayer1) {

        const previousCat = this.catPJ1;
        this.catPJ1 = catId;

        if (previousCat && previousCat !== catId) {
            this.updateCatTexture(this.cats[previousCat], previousCat);
        }
        this.activePLayer.text = 'Jugador 2:';
        this.activePLayer.setColor('#e78746ff');
        
        this.updateCatTexture(catSprite, catId);
    }
    else {

        const previousCat = this.catPJ2;
        this.catPJ2 = catId;

        if (previousCat && previousCat !== catId) {
            this.updateCatTexture(this.cats[previousCat], previousCat);
        }
        this.activePLayer.text = 'Jugador 1:';
        this.activePLayer.setColor('#73c6ecff');

        this.updateCatTexture(catSprite, catId);
    }
    
    console.log(`Gato 1 = ${this.catPJ1}-   Gato2 = ${this.catPJ2}`);

    this.isPlayer1 = !this.isPlayer1;
}

    updateCatTexture(catSprite, catId) {

    if (this.catPJ1 === catId && this.catPJ2 === catId) {
        catSprite.setTexture(`${catId}-Ambos`);
    }
    else if (this.catPJ1 === catId) {
        catSprite.setTexture(`${catId}-PJ1`);
    }
    else if (this.catPJ2 === catId) {
        catSprite.setTexture(`${catId}-PJ2`);
    }
    else {
        catSprite.setTexture(`${catId}-Vacio`);
    }
}

    deselectcat(idPlayer,catSprite, catId, catname){
        if (idPlayer) this.catPJ1 = null;
        if (!idPlayer) this.catPJ2 = null;
        if (this.catPJ1 === catname) {
            catSprite.setTexture(`${catId}-PJ1`);
        } else if (this.catPJ2 === catname) {
            catSprite.setTexture(`${catId}-PJ2`);
        } else {
            catSprite.setTexture(`${catId}-Vacio`);
        }
    }
    updateSingleCat(catId) {
        const catSprite = this[catId]; // this.gato1, this.gato2, etc
        this.updateCatTexture(catSprite, catId);
    }
    
    startGame(){
        if(this.catPJ2===null) return;
  
     this.scene.start('GameScene',{
        player: this.traspaso.player,
         pj1Type: this.catPJ1,  // 'gato1', 'gato2', 'gato3'...
         pj2Type: this.catPJ2,  // 'gato1', 'gato2', 'gato3'...
         pj1:     this.catPJ1,  // Para las animaciones
         pj2:     this.catPJ2   // Para las animaciones
         });
    }
}