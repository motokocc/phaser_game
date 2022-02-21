import Phaser from 'phaser';
import { cardStats } from '../js/cardStats';
import { getSoundSettings } from '../js/utils';
import { Slider } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

export default class GameScene extends Phaser.Scene{
	init(){
		this.gameW = this.game.config.width;
        this.gameH = this.game.config.height;
        this.padding = this.gameW * 0.025;
	}

	generateGameplayUI(scene, bgMusic){
		//Dummy data for testing
        this.player.gameModeData = {
            mode: 'adventure',
            team: { card_1: null, card_2: 'Saya', card_3: 'Alpha' }
        }

        this.player.playerInfo.cardsBattleData = [
        	{
		        level: 1, name: "Alpha", health: 10, attack: 2, defence: 1, speed: 1, critRate: 5, critDamage: 120,
		        evasion: 1, accuracy: 100, cooldownReduction: 0, currentXp: 0, levelupXp: 100,
		    },
		    {
		        level: 1, name: "Saya", health: 30, attack: 5, defence: 5, speed: 1, critRate: 5, critDamage: 120,
		        evasion: 1, accuracy: 100, cooldownReduction: 0, currentXp: 0, levelupXp: 100,
		    },
        ]
		//end of dummy

		this.charactersToPlay = [];

		for(let i=1; i<=3; i++){
			if(this.player.gameModeData.team[`card_${i}`]){
				this.charactersToPlay.unshift(this.player.gameModeData.team[`card_${i}`])
			}
		}

		this.generateUpperRightUI(scene, bgMusic);
		this.generateCharacterStats(this.charactersToPlay);

	}

	generateUpperRightUI(scene, bgMusic){
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
					this.sound.play('clickSelectEffect', {loop: false, volume: getSoundSettings('default')});
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
	}

	generateCharacterStats(charactersToPlay){
		charactersToPlay.forEach((character, index) => {
			this[`${character}_status_frame`] = this.add.sprite(this.padding/2, this.padding/2 + (index*(this.gameW*0.1)), 'char_status_frame')
				.setOrigin(0).setDepth(25);

			this.add.sprite(
				this[`${character}_status_frame`].x + (this.padding/2)*0.2,
				this[`${character}_status_frame`].y + (this.padding/2)*0.2,
				'char_status_frame_fill'
			).setOrigin(0).setDepth(20);

			this[`${character}_frame_image`] = this.add.sprite(
				this[`${character}_status_frame`].x + this.padding*0.65,
				this[`${character}_status_frame`].y + this.padding*0.65,
				`${character}_frame`
			).setOrigin(0).setDepth(21);

			//Get stats to use for hp and xp slider

			this[`${character}_statsCheck`] = this.player.playerInfo.cardsBattleData.filter(cardData => cardData.name == character);

			if(this[`${character}_statsCheck`].length >= 1){
				this[`${character}_stats`] = this[`${character}_statsCheck`][0];
			}
			else{
				this[`${character}_stats`] = cardStats.filter(cardData => cardData.name == character)[0];
			}


			this[`${character}_currentHp`] = this[`${character}_stats`].health;
			this[`${character}_maxHp`] = this[`${character}_stats`].health;
			this[`${character}_currentXp`] = this[`${character}_stats`].currentXp;
			this[`${character}_levelupXp`] = this[`${character}_stats`].levelupXp;
			this[`${character}_level`] = this[`${character}_stats`].level;


			//HP Slider
			this[`${character}_hpBar`] = new Slider(this, {
	            x: this[`${character}_status_frame`].x + this[`${character}_frame_image`].displayWidth + this.padding*1.2,
	            y: this[`${character}_status_frame`].y + this.padding*1.2, 
	            width: this.gameW * 0.117,
	            height: undefined,
	            orientation: 'x',
	            value: this[`${character}_currentHp`] / this[`${character}_maxHp`],
	            indicator: this.add.sprite(0, 0, 'health_bar'),
	            input: 'none',
	            easeValue: { duration: 1000 },
        	})
            .setDepth(22).setOrigin(0,0.5).layout();

			this.add.existing(this[`${character}_hpBar`]);

			this[`${character}_hpText`] = this.add.text(
				this[`${character}_hpBar`].x + this[`${character}_hpBar`].displayWidth/2,
				this[`${character}_hpBar`].y + this.padding*0.05,
				`${this[`${character}_currentHp`]}/${this[`${character}_maxHp`]}`,
				{ fontFamily: 'GameTextFont', fontSize:14 }
			).setOrigin(0.5).setDepth(23);

			//XP Slider
			this[`${character}_xpBar`] = new Slider(this, {
	            x: this[`${character}_hpBar`].x + this.padding*0.24,
	            y: this[`${character}_hpBar`].y + this.padding*1.2, 
	            width: this.gameW*0.0762,
	            height: undefined,
	            orientation: 'x',
	            value: this[`${character}_currentXp`] / this[`${character}_levelupXp`],
	            indicator: this.add.sprite(0, 0, 'xp_bar'),
	            input: 'none',
	            easeValue: { duration: 1000 },
        	})
            .setDepth(22).setOrigin(0,0.5).layout();

            this.add.existing(this[`${character}_xpBar`]);

            let charLevelLabel = this.add.sprite(
				this[`${character}_xpBar`].x - this.padding,
				this[`${character}_xpBar`].y + this.padding/2,
				'char_level_indicator'
			).setOrigin(0.5).setDepth(26);

			this[`${character}_levelText`] = this.add.text(
				charLevelLabel.x, charLevelLabel.y, this[`${character}_level`], { fontFamily: 'GameTextFont', fontSize: 14 }
			).setOrigin(0.5).setDepth(26);

		})		
	}

	levelUp(level, scene, bgMusic){
		this.scene.pause(scene);
		this.scene.launch('levelUpScene', {scene, bgMusic, level});
	}
}