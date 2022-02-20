import Phaser from 'phaser';
import { Slider } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

export default class GameScene extends Phaser.Scene{
	init(){
		this.gameW = this.game.config.width;
        this.gameH = this.game.config.height;
        this.padding = this.gameW * 0.025;
	}

	generateGameplayUI(scene, bgMusic){
		this.speedMultiplier = 1;
		let speedToggle = false;

		//Upper Right Buttons
		let pauseButton = this.add.sprite(this.gameW - this.padding/2, this.padding/2, 'pause_button').setName('pause')	;		
		
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
		});

		this.generateCharacterStats();

	}

	generateCharacterStats(){
		console.log('cardsData????', this.player.playerInfo.cardsBattleData);
		//Dummy data for testing
        this.player.gameModeData = {
            mode: 'adventure',
            team: {
                card_1: 'Alpha',
                card_2: 'Alpha',
                card_3: 'Alpha',
            }
        }

      //   this.player.playerInfo.cardsBattleData = [
      //   	   {
		    //     level: 1,
		    //     name: "Alpha",
		    //     health: 10,
		    //     attack: 2,
		    //     defence: 1,
		    //     speed: 1,
		    //     critRate: 5,
		    //     critDamage: 120,
		    //     evasion: 1,
		    //     accuracy: 100,
		    //     cooldownReduction: 0,
		    //     currentXp: 0,
		    //     levelupXp: 100,
		    // },
      //   ]
		//end of dummy

		let charactersToPlay = [];

		for(let i=1; i<=3; i++){
			if(this.player.gameModeData.team[`card_${i}`]){
				charactersToPlay.unshift(this.player.gameModeData.team[`card_${i}`])
			}
		}

		charactersToPlay.forEach((character, index) => {
			this[`${character}_status_frame_${index}`] = this.add.sprite(this.padding/2, this.padding/2 + (index*120), 'char_status_frame')
				.setOrigin(0).setDepth(25);

			this[`${character}_frame_image_${index}`] = this.add.sprite(
				this[`${character}_status_frame_${index}`].x + this.padding*0.65,
				this[`${character}_status_frame_${index}`].y + this.padding*0.65,
				`${character}_frame`
			).setOrigin(0).setDepth(21);

			this.add.sprite(
				this[`${character}_status_frame_${index}`].x + (this.padding/2)*0.2,
				this[`${character}_status_frame_${index}`].y + (this.padding/2)*0.2,
				'char_status_frame_fill'
			).setOrigin(0).setDepth(20);


		})		
	}
}