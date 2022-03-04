import 'regenerator-runtime/runtime';
import GameScene from '../plugins/GameScene';
import { getSoundSettings } from '../js/utils';
import CharacterAnimation from '../components/characterAnimations';

class Adventure extends GameScene {

    create(){
        this.anims.create({
            key: "alpha_idle_state",
            frameRate: 20,
            frames: this.anims.generateFrameNumbers("alpha_idle", { start: 0, end: 19 }),
            repeat: -1
        });

        this.anims.create({
            key: "alpha_run_state",
            frameRate: 24,
            frames: this.anims.generateFrameNumbers("alpha_run", { start: 0, end: 21, frames:[
                14,15,16,17,18,19,20,21,0,1,2,3,4,5,6,7,8,9,10,11,12,13
            ] }),
            repeat: -1
        });

        //Audio
        let battle_bgm = this.sound.add('battle_loop', {loop: true, volume: getSoundSettings('default')});        
        let intro_bgm = this.sound.add('battle_intro', { volume: getSoundSettings('default') });

        setTimeout(() => {
            intro_bgm.play();

            intro_bgm.once('complete', music => {
                battle_bgm.play();
            });
        }, 500)

        this.generateGameplayUI(this.player.gameModeData.mode, [intro_bgm.key, battle_bgm.key]);
        this.bgm.push(intro_bgm.key);
        this.bgm.push(battle_bgm.key);

        //BG
        let forest_width = 2133;
        this.forest_layer_0 = this.add.tileSprite(0,0,forest_width, this.game.config.height,'forest_layer_0').setOrigin(0).setScrollFactor(0, 1);
        this.forest_layer_1 = this.add.tileSprite(0,0,forest_width, this.game.config.height,'forest_layer_1').setOrigin(0).setScrollFactor(0, 1);
        this.forest_layer_2 = this.add.tileSprite(0,0,forest_width, this.game.config.height,'forest_layer_2').setOrigin(0).setScrollFactor(0, 1);
        this.forest_layer_3 = this.add.tileSprite(0,0,forest_width, this.game.config.height,'forest_layer_3').setOrigin(0).setScrollFactor(0, 1);
        this.forest_layer_4 = this.add.tileSprite(0,0,forest_width, this.game.config.height,'forest_layer_4').setOrigin(0).setScrollFactor(0, 1);
        this.forest_layer_5 = this.add.tileSprite(0,0,forest_width, this.game.config.height,'forest_layer_5').setOrigin(0).setScrollFactor(0, 1);

        this.charAnimation = new CharacterAnimation(this);
        this.add.existing(this.charAnimation);
        this.Alpha_char = this.physics.add.sprite(0, this.game.config.height*0.875, "alpha_idle").setOrigin(1).setDepth(10).setName('Alpha');
        this.Alpha_char.play("alpha_run_state");
        this.Alpha_char.body.setSize(this.Alpha_char.width*0.6, this.Alpha_char.height/2,true);

         //TESTING HP & XP(TO BE REMOVED LATER)
         let damage = 2;
         let xp = 10;
         let hpButton = this.add.text(
                this.Alpha_status_frame.x + this.Alpha_status_frame.displayWidth + this.padding, 
                this.Alpha_status_frame.y + this.padding/2,
                'TAKE DAMAGE',
                {fontFamily: 'GameTextFont', fontSize: 25, fontStyle: 'Bold'}
            ).setInteractive()
            .on('pointerdown', () => {
                this.Alpha_currentHp = this.Alpha_currentHp - damage;

                if(this.Alpha_currentHp <= 0){
                    this.Alpha_frame_image.tint = 0x808080;
                    this.Alpha_currentHp = 0;   
                    this.lose(this.player.gameModeData.mode, [intro_bgm.key, battle_bgm.key]);   
                }

                this.Alpha_hpBar.value = this.Alpha_currentHp/this.Alpha_maxHp;
                this.Alpha_hpText.setText(`${this.Alpha_currentHp}/${this.Alpha_maxHp}`);
            }).setOrigin(0);

        this.add.text(
                hpButton.x,
                hpButton.y + hpButton.displayHeight + this.padding/2,
                'GET XP',
                {fontFamily: 'GameTextFont', fontSize: 25, fontStyle: 'Bold'}
            ).setInteractive()
            .on('pointerdown', () => {
                this.Alpha_currentXp = this.Alpha_currentXp + xp;

                if(this.Alpha_currentXp >=  this.Alpha_levelupXp){
                    this.Alpha_maxHp = this.Alpha_maxHp + 2;
                    this.Alpha_currentHp = this.Alpha_maxHp;
                    this.Alpha_hpBar.value = this.Alpha_currentHp/this.Alpha_maxHp;
                    this.Alpha_hpText.setText(`${this.Alpha_currentHp}/${this.Alpha_maxHp}`);

                    this.Alpha_currentXp = 0;
                    this.Alpha_level++;
                    this.Alpha_levelText.setText(this.Alpha_level);
                    this.levelUp(this.Alpha_level, this.player.gameModeData.mode, [intro_bgm.key, battle_bgm.key]);
                }

                this.Alpha_xpBar.value = this.Alpha_currentXp/this.Alpha_levelupXp;
            }).setOrigin(0);

            this.enemyCount = 0;
            this.endCount = false;
    }


    update(){
        if(this.game_state == 'on'){
            if(this.Alpha_char.x <= this.game.config.width*0.6){
                this.Alpha_char.setVelocityX(600);
            }
            else{
                if(this.char_state == 'running'){
                    this.Alpha_char.setVelocityX(0);
                    this.Alpha_char.anims.timeScale = this.speedMultiplier == 2? 1.5 : this.speedMultiplier;
                    this.forest_layer_0.tilePositionX += 4 * this.speedMultiplier;
                    this.forest_layer_1.tilePositionX += 5 * this.speedMultiplier;
                    this.forest_layer_2.tilePositionX += 6 * this.speedMultiplier;
                    this.forest_layer_3.tilePositionX += 9 * this.speedMultiplier;
                    this.forest_layer_4.tilePositionX += 7 * this.speedMultiplier;
                    this.forest_layer_5.tilePositionX += 7 * this.speedMultiplier;

                    if(this.enemies.getLength() >= 1){
                        this.enemies.children.each(enemy => {
                            this[`${enemy.name}_hp`].x = enemy.x;

                            if( Math.abs(enemy.x - this.Alpha_char.x) <= 400){
                                let currentAnim = this.Alpha_char.anims.currentAnim;
                                let frame = currentAnim.getFrameAt(0);
                                this.Alpha_char.stopOnFrame(frame);

                                this.Alpha_char.on('animationstop', () => {
                                    this.Alpha_char.play('alpha_idle_state', true);
                                    this.char_state = 'fighting';
                                });
                            }
                        })
                    }
                }
                else if(this.char_state == 'fighting'){
                    
                    this.Alpha_char.body.setSize(this.Alpha_char.width*0.6, this.Alpha_char.height/2,true);

                    if(this.enemyCount <= this.enemies.getLength() && !this.endCount){
                        this.enemies.children.each(enemy => {
                            this[`${enemy.name}_isFigthing`] = true;
                            this.enemyCount++;
                            if(this.enemyCount == this.enemies.getLength()) this.endCount = true;
                        })
                    }

                    this.enemies.children.each(enemy => {
                        this[`${enemy.name}_hp`].x = enemy.x + enemy.width*0.4;

                        let enemyName = enemy.name.split("_").slice(0,1)[0];
                        let enemyData = this.charAnimation.charactersAvailable.filter(char => char.name == enemyName)[0];

                        if(enemy.x - this.Alpha_char.x <= enemyData.distance){
                            enemy.setVelocityX(0);
                            enemy.anims.timeScale = this.speedMultiplier == 2? 1.5 : this.speedMultiplier;

                            if(this[`${enemy.name}_isFigthing`]){
                                this[`${enemy.name}_isFigthing`]  = false;
                                let enemyAttackAnim = this.charAnimation.generateAnimation(enemyName, "attack", 6);
                                enemy.play(enemyAttackAnim.animation, true);
                                setTimeout(() => {
                                    enemy.body.setSize(enemy.width*2, enemy.height/2, true);
                                }, 1000)
                            }
                        }
                    })

                    if(this.enemies.getLength() <= 0){
                        this.char_state = 'running';
                        this.Alpha_char.play('alpha_run_state', true);
                        this.enemyCount = 0; 
                        this.endCount = false;   
                    } 
                }
            }
        }
        else{
            if(this.Alpha_char.x <= this.game.config.width + this.Alpha_char.displayWidth + this.padding){
                this.Alpha_char.setVelocityX(600);
            }
        }

    }
}

export default Adventure;