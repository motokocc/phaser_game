import Phaser from 'phaser';
import { getSoundSettings } from '../../js/utils';

export default class PauseScene extends Phaser.Scene{
	init(data){
		this.sceneData = data;
	}

	create(){
		let gameW = this.game.config.width;
        let gameH = this.game.config.height;
        let padding = gameW * 0.025;

        this.sceneData.bgMusic.forEach(bg => {
        	this.sound.get(bg).pause();
        })

		this.add.rectangle(gameW/2,gameH/2,gameW,gameH,0x000000,0.6).setOrigin(0.5);

		let pausePopUpBody = this.add.rectangle(gameW/2,gameH/2,gameW,gameH*0.475,0x000000,0.8).setOrigin(0.5);

		let pauseText = this.add.sprite(pausePopUpBody.x, pausePopUpBody.y - pausePopUpBody.displayHeight/2 + padding*2, 
			'pause_text', 
		).setOrigin(0.5, 0);

		this.add.sprite(pauseText.x - pauseText.displayWidth/2  - padding, pauseText.y + pauseText.displayHeight/2,
			'pause_arrow'
		).setOrigin(1, 0.5);

		this.add.sprite( pauseText.x + pauseText.displayWidth/2  + padding, pauseText.y + pauseText.displayHeight/2,
			'pause_arrow'
		).setOrigin(0, 0.5).setFlipX(true);

		let restartButton = this.add.sprite(
			pausePopUpBody.x, 
			pausePopUpBody.y + pausePopUpBody.displayHeight/2 - padding*1.5, 
			'restart_button'
		).setOrigin(0.5,1).setName('restart');

		let continueButton = this.add.sprite(restartButton.x - restartButton.displayWidth/2  - padding, restartButton.y,
			'continue_button'
		).setOrigin(1).setName('continue');

		let quitButton = this.add.sprite( restartButton.x + restartButton.displayWidth/2  + padding, restartButton.y,
			'quit_button'
		).setOrigin(0, 1).setName('quit');

		let buttons = [ restartButton, continueButton, quitButton ];

		buttons.forEach(button => {
			button.setInteractive();
			button.on('pointerup', () => {
				button.setAlpha(1);
			});

			button.on('pointerover', () => {
				this.sound.play('hoverEffect', {volume: getSoundSettings('high') });
				button.setScale(1.05);
			});

			button.on('pointerout', () => {
				button.setScale(1);
			});

			button.on('pointerdown', () => {
				this.sound.play('clickEffect', {volume: getSoundSettings('high') });
				button.setAlpha(0.7);

				if(button.name == 'continue'){
					this.sceneData.bgMusic.forEach(bg => {
			        	this.sound.get(bg).resume();
			        })
					this.scene.stop();
					this.scene.resume(this.sceneData.scene || 'adventure');
				}
				else if(button.name == 'restart'){
					this.sceneData.bgMusic.forEach(bg => {
						this[bg] = this.sound.get(bg);
			        	this[bg].stop(); 
			        	this[bg].destroy();
						this.sound.removeByKey(bg);
			        })

					this.scene.stop();
					this.scene.stop(this.sceneData.scene);
					this.scene.start(this.sceneData.scene);
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
					this.scene.stop(this.sceneData.scene || 'adventure');
					this.scene.start('transitionScreen', { nextPage: 'game', bgMusic: this.sceneData.bgMusic, nextBgMusic: 'titleBgMusic' });
				}
			})
		})
	}
}