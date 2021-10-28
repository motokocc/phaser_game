import Phaser from 'phaser';

class Game extends Phaser.Scene {

    preload(){
    }

    create(){
        this.gameBg = this.add.image(0,0,'background');
        this.gameBg.setOrigin(0,0);
        this.gameBg.setScale(1.1);
    }

    update(){

    }
}

export default Game;