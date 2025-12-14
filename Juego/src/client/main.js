import Phaser from 'phaser';

import { MenuScene } from './scene/MenuScene.js';
import { GameScene } from './scene/GameScene.js';
import { PauseScene } from './scene/PauseScene.js';
import { ResultsScene } from './scene/ResultsScene.js';
import { CreditsScene } from './scene/CreditsScene.js';
import { SettingsScene } from './scene/SettingsScene.js';
import { ControlsScene } from './scene/ControlsScene.js';
import { ConnectionLostScene } from './scene/ConnectionLostScene.js';


const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 700,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x: 0,y: 0},
            debug: false
        } 
    },

    scene: [MenuScene, GameScene, PauseScene, ResultsScene, CreditsScene, SettingsScene,ControlsScene, ConnectionLostScene],
    //backgroundColor: '#360246ff'
    backgroundColor: '#ffffff'
}

const game = new Phaser.Game(config);