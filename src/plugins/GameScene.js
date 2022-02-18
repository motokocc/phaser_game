import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene{
	init(){
		this.gameW = this.game.config.width;
        this.gameH = this.game.config.height;
        this.padding = this.gameW * 0.025;
	}

	generateGameplayUI(scene, bgMusic){
		this.speedMultiplier = 1;
		let speedToggle = false;

		let pauseButton = this.add.sprite(this.gameW - this.padding, this.padding, 'pause_button').setName('pause')	;		
		
		let multiplierButton = this.add.sprite(
			pauseButton.x - pauseButton.displayWidth - this.padding/2, pauseButton.y,
			'multiplier_1x_button'
		).setName('multiplier');

		let autoButton = this.add.sprite(
			multiplierButton.x - multiplierButton.displayWidth - this.padding/2, multiplierButton.y,
			'auto_button'
		).setName('auto');

		let upperRightButtons = [pauseButton, multiplierButton, autoButton];

		upperRightButtons.forEach(button => {
			button.setInteractive().setOrigin(1,0).setDepth(20);

			button.on('pointerdown', () => {
				if(button.name == 'auto'){
					console.log('hey')
				}
				else if(button.name == 'pause'){
					this.scene.pause(scene);
					this.scene.launch('pauseScene', {scene, bgMusic});
				}
				else{
					speedToggle = !speedToggle;

					if(speedToggle){
						this.speedMultiplier = 2;
					}
					else{
						this.speedMultiplier = 1;
					}

					multiplierButton.setTexture(`multiplier_${this.speedMultiplier}x_button`);
					
					bgMusic.forEach(music => {
						this[`music_${music}`] = this.sound.get(music);
						this[`music_${music}`].setRate(this.speedMultiplier == 2? 1.5 : this.speedMultiplier);
					})
				}
			})
		})
	}
}