import 'regenerator-runtime/runtime';
import GameScene from '../plugins/GameScene';
import { getSoundSettings } from '../js/utils';

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

        this.Alpha_char = this.physics.add.sprite(0, this.game.config.height*0.65, "alpha_idle").setOrigin(1,0.5).setDepth(10).setName('Alpha');
        this.Alpha_char.play("alpha_run_state");
        this.Alpha_char.body.setSize(this.Alpha_char.width, this.Alpha_char.height,true);

         this.char_state = "running";
         this.game_state = "on";

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

                            if( Math.abs(enemy.x - this.Alpha_char.x) <= 700){
                                let currentAnim = this.Alpha_char.anims.currentAnim;
                                let frame = currentAnim.getFrameAt(0);
                                this.Alpha_char.stopOnFrame(frame);

                                this.Alpha_char.on('animationstop', (currentAnim, currentFrame, sprite) => {
                                    this.Alpha_char.play('alpha_idle_state', true);
                                    this.char_state = 'fighting';
                                });
                            }
                        })
                    }
                }
                else if(this.char_state == 'fighting'){
                    
                    this.Alpha_char.body.setSize(this.Alpha_char.width, this.Alpha_char.height,true);

                    this.enemies.children.each(enemy => {
                        this[`${enemy.name}_hp`].x = enemy.x;
                        if(enemy.x - this.Alpha_char.x <= 220){
                            enemy.setVelocityX(0);
                            enemy.play('alpha_idle_state', true);
                            enemy.anims.timeScale = this.speedMultiplier == 2? 1.5 : this.speedMultiplier;

                            //testing
                            setTimeout(() => {
                                let xp = 10;
                                this[`${enemy.name}_addXP`] = true;   

                                enemy.destroy();
                                this[`${enemy.name}_hp`].destroy();

                                if(this.enemies.getLength() <= 0){
                                    this.char_state = 'running';
                                    this.Alpha_char.play('alpha_run_state', true);    
                                }                          


                            }, 3000);
                        }
                    })
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