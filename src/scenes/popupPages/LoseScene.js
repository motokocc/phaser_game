import Phaser from 'phaser';
import { getSoundSettings } from '../../js/utils';

export default class LoseScene extends Phaser.Scene{
	init(data){
		this.sceneData = data;
	}

	create(){
		let gameW = this.game.config.width;
        let gameH = this.game.config.height;
        let padding = gameW * 0.025;

        let {scene, bgMusic} = this.sceneData;

        bgMusic.forEach(bg => {
        	this.sound.get(bg).pause();
        })

		let loseSfx = this.sound.add('loseSfx', {volume: getSoundSettings('default') });

	    loseSfx.play();

		this.add.rectangle(gameW/2,gameH/2,gameW,gameH,0x000000,0.75).setOrigin(0.5);
        let losePopup = this.add.sprite(gameW/2, gameH/2, 'lose_popup').setOrigin(0.5).setScale(1.2);

        let restartButton = this.add.sprite(
			gameW/2 - padding/5 , 
			gameH/2 + padding*1.5, 
			'restart_button'
		).setOrigin(1,0).setName('restart');

		let quitButton = this.add.sprite(
			gameW/2 + padding/5,
			restartButton.y,
			'quit_button'
		).setOrigin(0,0).setName('quit');

		let buttons = [ restartButton, quitButton ];

		buttons.forEach(button => {
			button.setInteractive().setScale(0.8);
			button.on('pointerup', () => {
				button.setAlpha(1);
			});

			button.on('pointerover', () => {
				this.sound.play('hoverEffect', {volume: getSoundSettings('high') });
			});

			button.on('pointerdown', () => {
				this.sound.play('clickEffect', {volume: getSoundSettings('high') });
				button.setAlpha(0.7);
				loseSfx.destroy();

				if(button.name == 'restart'){
					bgMusic.forEach(bg => {
						this[bg] = this.sound.get(bg);
			        	this[bg].stop(); 
			        	this[bg].destroy();
						this.sound.removeByKey(bg);
			        });

					this.scene.stop();
					this.scene.stop(scene);
					this.scene.start(scene);
				}
				else{
	                this.player.gameModeData = {
	                    mode: null,
	                    team: { card_1: null, card_2: null, card_3: null }
	                };

	               	this.sceneData.bgMusic.forEach(bg => {
			        	this[bg] = this.sound.get(bg);
			        	this[bg].stop();
			        })

					this.scene.stop();
					this.scene.stop(scene || 'adventure');
					this.scene.start('transitionScreen', { nextPage: 'game', bgMusic, nextBgMusic: 'titleBgMusic' });
				}
			})
		})

		let losePopupContainer = this.add.container(0,-150);
		losePopupContainer.add([ losePopup, restartButton, quitButton ]);
		losePopupContainer.setAlpha(0);

        this.tweens.add({
            targets: losePopupContainer,
            alpha: { value: 1, duration: 500, ease: 'easeOut'},
            y: { value: 0, duration: 500, ease: 'easeOut'},
            yoyo: false
        });
	}
}