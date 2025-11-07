import Phaser from 'phaser';

import { MenuScene } from './scene/MenuScene.js';
import { GameScene } from './scene/GameScene.js';
import { PauseScene } from './scene/PauseScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 700,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        } 
    },

    scene: [MenuScene, GameScene, PauseScene],
    backgroundColor: '#360246ff'
}

const game = new Phaser.Game(config);