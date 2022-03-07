import Phaser from 'phaser';
import { cardStats } from '../js/cardStats';
import { getSoundSettings } from '../js/utils';
import { Slider } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import CharacterAnimation from '../components/characterAnimations';

export default class GameScene extends Phaser.Scene{
	init(){
		this.gameW = this.game.config.width;
        this.gameH = this.game.config.height;
        this.padding = this.gameW * 0.025;

        this.char_state = "running";
        this.game_state = "on";
	}

	generateGameplayUI(scene, bgMusic){
		//Put in separate class later
		this.anims.create({
            key: "heal_vfx",
            frameRate: 30,
            frames: this.anims.generateFrameNumbers("heal_spritesheet", { start: 0, end: 13 }),
        });


        this.anims.create({
            key: "levelUp_vfx",
            frameRate: 30,
            frames: this.anims.generateFrameNumbers("levelup_spritesheet", { start: 0, end: 47 }),
        });

		//Dummy data for testing
        this.player.gameModeData = {
            mode: 'adventure',
            team: { card_1: null, card_2: null, card_3: 'Alpha' },
            location: 'elven_forest'
        }

        this.player.playerInfo.cardsBattleData = [
        	{
		        level: 1, name: "Alpha", health: 20, attack: 2, defence: 1, speed: 1, critRate: 5, critDamage: 120,
		        evasion: 1, accuracy: 100, cooldownReduction: 0, currentXp: 0, levelupXp: 100,
		    }
        ]
		//end of dummy
		this.isAuto = true;
		this.bgm = [];
		this.charactersToPlay = [];
		this.enemies = this.physics.add.group();
		this.totalEnemyCount = 0;
		this.charAnimation = new CharacterAnimation(this);
		this.add.existing(this.charAnimation);
		this.isFighting = true;

		for(let i=1; i<=3; i++){
			if(this.player.gameModeData.team[`card_${i}`]){
				this.charactersToPlay.unshift(this.player.gameModeData.team[`card_${i}`])
			}
		}

		this.generateUpperRightUI(scene, bgMusic);
		this.generateCharacterStats(this.charactersToPlay);
		this.generateItemSlots();
		this.generateSkillSlots(this.charactersToPlay, 9);
		this.spawnEnemy(4, 8000, this.charactersToPlay);
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
			'auto_button_on'
		).setName('auto');

		let upperRightButtons = [pauseButton, multiplierButton, autoButton];

		upperRightButtons.forEach(button => {
			button.setInteractive().setOrigin(1,0).setDepth(20);

			button.on('pointerdown', () => {
				if(button.name == 'auto'){
					this.isAuto = !this.isAuto;
					autoButton.setTexture(`auto_button_${this.isAuto? 'on': 'off'}`);
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
			this[`${character}_attack`] = this[`${character}_stats`].attack;

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

	generateItemSlots(){
		let itemSlot = this.add.sprite(this.gameW - this.padding/2, this.gameH - this.padding/2, 'item_slot').setOrigin(1).setDepth(20);

		let potions = this.player.playerInfo.inventory.item.filter(item => item.properties.subType == 'potion');

		if(potions.length >= 1){
			let potionData = potions[0];
			this.potion = this.add.sprite(
				itemSlot.x - itemSlot.displayWidth/2, 
				itemSlot.y - itemSlot.displayWidth/2 - this.padding*0.1, 
				'Small heal potion slot'
			).setOrigin(0.5).setInteractive().setDepth(20);

			let potionText = this.add.text(this.potion.x, this.potion.y, potionData.quantity, {
				fontFamily: 'GameTextFont', fontSize: 40, fontStyle: 'Bold'
			}).setOrigin(0.5).setDepth(20);
			this.potion.setTint(0x808080);

			this.potion.on('pointerdown', () => {
				if(potionData.quantity >= 1){
					this.charactersToPlay.filter(character => {
						this.sound.play('healSfx', {volume: getSoundSettings('default')})

						//Heal animation
						this[`${character}_vfx`].setAlpha(1);
						this[`${character}_vfx`].play('heal_vfx');
						this[`${character}_vfx`].on('animationcomplete', () => {
							this[`${character}_vfx`].setAlpha(0);
						})

						let {multiplier, target, targetUI } = potionData.properties.effect;

						let newStat = Math.ceil(this[`${character}_${target.name}`] + (this[`${character}_${target.max}`]*multiplier));

						if(newStat  > this[`${character}_${target.max}`]){
							newStat = this[`${character}_${target.max}`];
						}

						this[`${character}_${target.name}`] = newStat;

						targetUI.filter(ui => {
							if(ui == 'Bar'){
								this[`${character}_${target.main}${ui}`].value = newStat/this[`${character}_${target.max}`]
							}
							else{
								this[`${character}_${target.main}${ui}`].setText(newStat + '/' + this[`${character}_${target.max}`]);
							}
						})
					})
				}
				else{
					potionData.quantity = 0;
				}

				potionData.quantity--;

				if(potionData.quantity < 0){
					potionData.quantity = 0;
				}

				potionText.setText(potionData.quantity);
			})
		}
	}

	generateSkillSlots(charactersToPlay, skillSlotAllowed){
		this.skills = [];

		charactersToPlay.forEach(character => {
			this.player.playerInfo.inventory.skill.forEach(skill => {
				if(skill.equipped.some(data => data == character)){
					this.skills.push({ character, skill })
				}
			})
		})

		for(let i=0; i<=skillSlotAllowed-1; i++){
			this[`skill_slot_${i+1}`] = this.add.sprite(this.padding/2 + (i*this.gameW * 0.075), this.gameH - this.padding/2, 'skill_slot').setOrigin(0,1).setDepth(25);
		}

		this.skills.forEach((item, index) => {
			let { skill } = item;

			this[`${skill.name} skill`] = this.add.sprite(
				this[`skill_slot_${index+1}`].x + this[`skill_slot_${index+1}`].displayWidth/2,
				this[`skill_slot_${index+1}`].y - this[`skill_slot_${index+1}`].displayWidth/2,
				`${skill.name} slot`
			).setOrigin(0.5).setDepth(25).setInteractive();

			this[`${skill.name} countdown`] = this.add.text(
				this[`${skill.name} skill`].x,
				this[`${skill.name} skill`].y,
				'',
				{ fontFamily: 'GameTextFont', fontSize: 25, fontStyle: 'Bold' }
			).setOrigin(0.5).setDepth(25);


			if(skill.properties.subType == "active"){
				this[`${skill.name} skill`].on('pointerdown', () => {
					this.activateSkill(item);		

					this[`${skill.name}_timeCountdown`] = skill.properties.cooldown;
					this[`${skill.name} skill`].disableInteractive().setTint(0x808080);
					this[`${skill.name} countdown`].setText(this[`${skill.name}_timeCountdown`]);

					this.time.addEvent({
						delay: 1000,
						repeat: skill.properties.cooldown - 1,
						callback: () => {
							this[`${skill.name}_timeCountdown`]--;
							this[`${skill.name} countdown`].setText(this[`${skill.name}_timeCountdown`]);

							if(this[`${skill.name}_timeCountdown`] === 0){
								this[`${skill.name} skill`].setInteractive().setTint(0xffffff);
								this[`${skill.name} countdown`].setText('');
							}
						},
					})
				});
			}
			else{
				//passive skills
				console.log(skill.name)
			}
		})
	}

	levelUp(level, scene, bgMusic){
		this.scene.pause(scene);
		this.scene.launch('levelUpScene', {scene, bgMusic, level});
	}

	lose(scene, bgMusic){
		this.scene.pause(scene);
		this.scene.launch('loseScene', {scene, bgMusic});
	}

	complete(scene, bgMusic){
		this.scene.pause(scene);
		this.scene.launch('completeScene', {scene, bgMusic});
	}

	activateSkill(skillData){
		console.log('SKILL ACTIVATED: ', skillData.skill.name);
	}

	spawnEnemy(maxSpawn, spawnInterval, charactersToPlay){
		let monsters = this.charAnimation.charactersAvailable.filter(monster => 
			monster.location == this.player.gameModeData.location && monster.role == "enemy") || [];

		this.time.addEvent({
			delay: (spawnInterval || 10000)/this.speedMultiplier,
			repeat: -1,
			callback: () => {
				if(this.enemies.getLength() <= 0 ){
					let numberOfEnemies = Math.ceil(Math.random()*maxSpawn);
					for(let i=0; i<=numberOfEnemies - 1;i++){
						
						this.totalEnemyCount++;
						// maxSpawn++;

						let enemyRandomlySelected = monsters[Math.ceil(Math.random()* (monsters.length)) - 1];
						let enemyRunAnim = this.charAnimation.generateAnimation(enemyRandomlySelected.name, "run", 4);

						let enemyName = `${enemyRandomlySelected.name}_${this.totalEnemyCount}`;

						this[enemyName] = this.physics.add.sprite(this.gameW*2, this.gameH*0.875, enemyRunAnim.spritesheet)
							.setOrigin(0, 1)
							.setDepth(10)
							.setName(enemyName)
							.setFlipX(enemyRandomlySelected.flipImage)
							.setData(enemyRandomlySelected);

						this.enemies.add(this[enemyName]);
						this[enemyName].play(enemyRunAnim.animation, true);
						this[enemyName].body.setSize(this[enemyName].width/2, this[enemyName].height/2, true);
						setTimeout(() => {
							this[enemyName].setVelocityX(-enemyRandomlySelected.speed * this.speedMultiplier);
						}, i* (Math.ceil(Math.random()*1500) + 500))

						//Enemy HP bar
						this[`${this[enemyName].name}_hp`] = new Slider(this, {
				            x: this[enemyName].x, 
				            y: this[enemyName].y - this[enemyName].height/2 - 20,
				            width: 80,
				            height: 10,
				            orientation: 'x',
				            value: 1,
				            track: this.add.sprite(0, 0, 'enemy_hpbar_frame'),
				            indicator: this.add.sprite(0, 0, 'enemy_hpbar'),
				            input: 'none',
				            easeValue: { duration: 1000 },
			        	}).setDepth(15).setOrigin(0,1).layout();

						this.add.existing(this[`${this[enemyName].name}_hp`]);

						//Enemy stats
						this[`${enemyName}_currentHp`] = enemyRandomlySelected.stats.health;
						this[`${enemyName}_maxHealth`] = enemyRandomlySelected.stats.health;

						charactersToPlay.forEach(character => {
							this.physics.add.overlap(this[`${character}_char`], this.enemies,this.encounterEnemy, null, this);			
						})
					}	
				}
			} 
		})
	}

	encounterEnemy(char, enemy){
        enemy.body.setEnable(false);

        let { stats, name, animation, xp } = enemy.data.values;
        let { attack, speed } = stats;

        //Character
		this[`${char.name}_currentHp`] = this[`${char.name}_currentHp`] - attack;

        if(this[`${char.name}_currentHp`] <= 0){
            this[`${char.name}_frame_image`].tint = 0x808080;
            this[`${char.name}_currentHp`] = 0;   
            this.lose(this.player.gameModeData.mode, this.bgm);   
        }

		this[`${char.name}_hpBar`].value = this[`${char.name}_currentHp`]/this[`${char.name}_maxHp`];
        this[`${char.name}_hpText`].setText(`${this[`${char.name}_currentHp`]}/${this[`${char.name}_maxHp`]}`);

        //Enemy
		this[`${enemy.name}_currentHp`] =  this[`${enemy.name}_currentHp`] - this[`${char.name}_attack`];
		this[`${enemy.name}_hp`].value = this[`${enemy.name}_currentHp`]/ this[`${enemy.name}_maxHealth`];

        if(this[`${enemy.name}_currentHp`] <= 0){
        	//Add player xp when enemy is dead
			this[`${char.name}_currentXp`] = this[`${char.name}_currentXp`] + xp;

			//Level up
			if(this[`${char.name}_currentXp`] >= this[`${char.name}_levelupXp`]){
		        this[`${char.name}_maxHp`] = this[`${char.name}_maxHp`] + 2;
	            this[`${char.name}_currentHp`] = this[`${char.name}_maxHp`];
	            this[`${char.name}_hpBar`].value = this[`${char.name}_currentHp`]/this[`${char.name}_maxHp`];
	            this[`${char.name}_hpText`].setText(`${this[`${char.name}_currentHp`]}/${this[`${char.name}_maxHp`]}`);
	            this[`${char.name}_attack`]++;

	            this[`${char.name}_currentXp`] = 0;
	            this[`${char.name}_levelupXp`] = this[`${char.name}_levelupXp`]*2;
	            this[`${char.name}_level`]++;
	            this[`${char.name}_levelText`].setText(this[`${char.name}_level`]);
	            this.levelUp(this[`${char.name}_level`], this.player.gameModeData.mode, this.bgm);

	            this[`${char.name}_levelUp`].setAlpha(1);
	            this[`${char.name}_levelUp`].play('levelUp_vfx');
        		this[`${char.name}_levelUp`].on('animationcomplete', () => {
					this[`${char.name}_levelUp`].setAlpha(0);
				})
			}

			this[`${char.name}_xpBar`].value = this[`${char.name}_currentXp`] / this[`${char.name}_levelupXp`];

			//Play dead animation and put a little delay before destroying to prevent error
        	enemy.body.setSize(enemy.width/2, enemy.height/2);
            let enemyDeadAnim = this.charAnimation.generateAnimation(name, "dead", 6, 0);
            enemy.play(enemyDeadAnim.animation, true);

            let currentAnim = enemy.anims.currentAnim;
            let frame = currentAnim.getFrameAt(animation.dead.end - animation.dead.start);
            enemy.stopOnFrame(frame);
            this[`${enemy.name}_hp`].destroy();

	        enemy.on('animationstop', () => {
	        	enemy.body.setEnable();
	        	this.time.addEvent({
	        		delay: 250,
	        		repeat: 0,
	        		callback: () => {
	        			this.tweens.add({
				            targets: enemy,
				            alpha: { value: 0, duration: 800, ease: 'Power1'},
				            onComplete: () => {
					            enemy.destroy();
				            }
				        });
	        		}
	        	})
	        }) 
        }

		setTimeout(() => {
			enemy.body.setEnable();
		}, (speed*1000)/this.speedMultiplier);
	}
}