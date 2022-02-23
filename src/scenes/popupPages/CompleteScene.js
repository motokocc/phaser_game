import Phaser from 'phaser';
import { getSoundSettings } from '../../js/utils';

export default class CompleteScene extends Phaser.Scene{
	init(data){
		this.sceneData = data;
	}

	create(){
		let gameW = this.game.config.width;
        let gameH = this.game.config.height;
        let padding = gameW * 0.025;

        let {scene, bgMusic } = this.sceneData;

		let levelUpSfx = this.sound.add('levelUpSfx', {volume: getSoundSettings('default') });
		let completeSfx = this.sound.add('completeSfx', {volume: getSoundSettings('default') });

	    levelUpSfx.play();

        setTimeout(() => {
            completeSfx.play();
        },1000);

        bgMusic.forEach(bg => {
        	this.sound.get(bg).pause();
        })

		this.add.rectangle(gameW/2,gameH/2,gameW,gameH,0x000000,0.75).setOrigin(0.5);

		let completePopup = this.add.sprite(gameW/2, gameH/2 + padding, 'complete_popup');
		let chestShine = this.add.sprite(completePopup.x, completePopup.y, 'complete_chest_glow');
		let chest = this.add.sprite(completePopup.x, chestShine.y, 'complete_chest').setOrigin(0.5).setAlpha(0).setInteractive().setScale(0);

		chest.on('pointerover', () => {
			chest.setScale(1.1);
			this.sound.play('hoverEffect', {volume: getSoundSettings('high') });
		});

		chest.on('pointerout', () => chest.setScale(1));

		chest.on('pointerdown', () => {
			this.sound.play('clickEffect', {volume: getSoundSettings('high') });
			levelUpSfx.destroy();
		    completeSfx.destroy();

			bgMusic.forEach(bg => {
				this[bg] = this.sound.get(bg);
	        	this[bg].stop(); 
	        	this[bg].destroy();
				this.sound.removeByKey(bg);
	        })
			this.scene.stop();
			this.scene.stop(scene);
			this.scene.start(scene);
		})

		let completeAssets = [completePopup, chestShine];

		completeAssets.forEach(item => {
			item.setAlpha(0).setScale(0).setOrigin(0.5);
		});

		this.tweens.add({
            targets: completeAssets,
            alpha: { value: 1, duration: 250, ease: 'Linear'},
            scale: { value: 1.2, duration: 250, ease: 'Linear'},
            yoyo: false
        });

		this.tweens.add({
            targets: chest,
            alpha: { value: 1, duration: 500, ease: 'Linear'},
            scale: { value: 1.2, duration: 500, ease: 'Back.easeOut'},
            yoyo: false,
            onComplete: () => {
	            this.tweens.add({
		            targets: chestShine,
		            angle: { from: 0, to: 360, duration: 30000, ease: 'Linear'},
		            repeat: -1
        		});

        		this.tweens.add({
		            targets: chestShine,
		            alpha: { value: 0.7, duration: 1000, ease: 'Linear'},
		            scale: { value: 1, duration: 1000, ease: 'Linear'},
		            yoyo: true,
		            repeat: - 1
        		});
            }
        });

	}
}