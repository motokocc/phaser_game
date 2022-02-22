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

		let levelUpSfx = this.sound.add('levelUpSfx', {volume: getSoundSettings('default') });
		let completeSfx = this.sound.add('completeSfx', {volume: getSoundSettings('default') });

	    levelUpSfx.play();

        setTimeout(() => {
            completeSfx.play();
        },1000);

        bgMusic.forEach(bg => {
        	this.sound.get(bg).pause();
        })

		this.add.rectangle(gameW/2,gameH/2,gameW,gameH,0x000000,0.75).setOrigin(0.5).setInteractive()
			.on('pointerdown', () => {
				bgMusic.forEach(bg => {
		        	this.sound.get(bg).resume();
		        })
		        levelUpSfx.destroy();
		        completeSfx.destroy();
				this.scene.stop();
				this.scene.resume(scene || 'adventure');
			});

		let levelUpFrame = this.add.sprite(gameW/2, gameH/2 + padding, 'levelUp_frame').setOrigin(0.5).setDepth(5);
		let levelUpShine = this.add.sprite(levelUpFrame.x, levelUpFrame.y, 'levelUp_shine').setOrigin(0.5);
		let levelUpStars = this.add.sprite(levelUpFrame.x, levelUpFrame.y - padding, 'levelUp_stars').setOrigin(0.5);
		let levelUpText = this.add.sprite(levelUpFrame.x, levelUpFrame.y - levelUpFrame.displayHeight/2 + padding, 'levelUp_text').setOrigin(0.5).setDepth(5);
		let levelNumber = this.add.text(
			levelUpFrame.x, 
			levelUpFrame.y - padding, 
			level,
			{ fontFamily: 'GameTextFont', fontSize: 70, fontStyle: 'Bold' }
		).setOrigin(0.5).setDepth(6);

		let levelUp = [levelNumber, levelUpText, levelUpFrame];
		let shines = [levelUpStars, levelUpShine];

		let levelUpWhole = levelUp.concat(shines);

		levelUpWhole.forEach(item => {
			item.setAlpha(0).setScale(0);
		});

		this.tweens.add({
            targets: levelUp,
            alpha: { value: 1, duration: 500, ease: 'Linear'},
            scale: { value: 1, duration: 500, ease: 'Back.easeOut'},
            yoyo: false
        });

        this.tweens.add({
            targets: shines,
            alpha: { value: 1, duration: 250, ease: 'Linear'},
            scale: { value: 1, duration: 250, ease: 'Linear'},
            yoyo: false
        });
	}
}