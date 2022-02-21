import Phaser from 'phaser';
import { getSoundSettings } from '../../js/utils';

export default class LevelUpScene extends Phaser.Scene{
	init(data){
		this.sceneData = data;
	}

	create(){
		let gameW = this.game.config.width;
        let gameH = this.game.config.height;
        let padding = gameW * 0.025;

        let {scene, bgMusic, level} = this.sceneData;

        bgMusic.forEach(bg => {
        	this.sound.get(bg).pause();
        })

		this.add.rectangle(gameW/2,gameH/2,gameW,gameH,0x000000,0.6).setOrigin(0.5);
	}
}