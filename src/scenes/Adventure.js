import 'regenerator-runtime/runtime';
import GameScene from '../plugins/GameScene';
import { getSoundSettings } from '../js/utils';
import CharacterAnimation from '../components/characterAnimations';

class Adventure extends GameScene {

    create(){
        this.anims.create({
            key: "alpha_idle_state",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("alpha_idle", { start: 0, end: 9 }),
            repeat: -1
        });

        this.anims.create({
            key: "alpha_run_state",
            frameRate: 24,
            frames: this.anims.generateFrameNumbers("alpha_run", { start: 0, end: 21, frames:[
                15,16,17,18,19,20,21,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14
            ] }),
            repeat: -1
        });

        this.anims.create({
            key: "alpha_attack_state",
            frameRate: 20,
            frames: this.anims.generateFrameNumbers("alpha_attack", { start: 0, end: 19 }),
            repeat: -1
        });

        //Audio
        let battle_bgm = this.sound.add('battle_loop', {loop: true, volume: getSoundSettings('default')});        
        let intro_bgm = this.sound.add('battle_intro', { volume: getSoundSettings('default') });
        this.slashSfx = this.sound.add("Alpha_slash", { volume: 0.5 * getSoundSettings("default")});

        setTimeout(() => {
            intro_bgm.play();

            intro_bgm.once('complete', music => {
                battle_bgm.play();

                let { location, level } = this.player.gameModeData;
                this.gameLevelPopup(location, level);
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
        this.Alpha_char = this.physics.add.sprite(0, this.game.config.height*0.85, "alpha_idle").setOrigin(1).setDepth(10).setName('Alpha');
        this.Alpha_char.play("alpha_run_state");
        this.Alpha_char.body.setSize(this.Alpha_char.width*0.6, this.Alpha_char.height,true);

        this.charactersToPlay.forEach(character => {
            this[`${character}_vfx`] = this.add.sprite(
                this[`${character}_char`].x + this[`${character}_char`].width/2,
                this[`${character}_char`].y,
                'heal_spritesheet'
            ).setOrigin(1).setAlpha(0).setDepth(10);

            this[`${character}_levelUp`] = this.add.sprite(
                this[`${character}_char`].x,
                this[`${character}_char`].y - this[`${character}_char`].height/2,
                'levelup_spritesheet'
            ).setOrigin(0.5,1).setAlpha(0).setDepth(10);

             this[`${character}_slash`] = this.physics.add.sprite(
                this[`${character}_char`].x,
                this[`${character}_char`].y,
                'fireslash_spritesheet'
            ).setOrigin(1).setAlpha(0).setDepth(15).setName(`${character}_slash`);

             this[`${character}_slash`].body.setEnable(false);
             this[`${character}_slash`].body.setSize(this[`${character}_slash`].width*0.5, this[`${character}_slash`].height);

        })

        this.enemyCount = 0;
        this.endCount = false;
    }


    update(){
        // Colliders and VFX to follow player
        this.charactersToPlay.forEach(character => {
            this[`${character}_vfx`].x = this[`${character}_char`].x;
            this[`${character}_levelUp`].x = this[`${character}_char`].x - this[`${character}_char`].width*0.35;
            this[`${character}_slash`].x = this[`${character}_char`].x + 110;

            this[`${character}_slash`].anims.timeScale = this.speedMultiplier == 2? 1.5 : this.speedMultiplier;
            this[`${character}_char`].anims.timeScale = this.speedMultiplier == 2? 1.5 : this.speedMultiplier;
        });
        //End of Colliders and VFX

        if(this.game_state == 'on'){
            if(this.Alpha_char.x <= this.game.config.width*0.6){
                this.Alpha_char.setVelocityX(600);
            }
            else{
                if(this.char_state == 'running'){
                    this.Alpha_char.setVelocityX(0);
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
                    if(this.enemyCount <= this.enemies.getLength() && !this.endCount){
                        this.enemies.children.each(enemy => {
                            this[`${enemy.name}_isFigthing`] = true;
                            this.slashing = true;
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

                                enemy.on('animationupdate', (currentAnim, currentFrame, sprite) => {
                                    if(currentAnim.key == enemyAttackAnim.animation && currentFrame.index == 5 && sprite.name == enemy.name){
                                        this[`${enemy.name}_slash`].x = enemy.x;

                                        this[`${enemy.name}_currentHp`] > 0 && this[`${enemy.name}_slash`].body.setEnable(true);                                        
                                    }
                                })
                            }


                            if(this.slashing){
                                this.slashing = false;
                                this.physics.add.overlap(this.Alpha_slash, this.enemies,this.hitEnemy, null, this);
                                this.Alpha_char.play('alpha_attack_state', true);

                                this.Alpha_char.on('animationupdate', (currentAnim, currentFrame, sprite) => {
                                    if(currentAnim.key == "alpha_attack_state"){
                                        if(currentFrame.index == 10){
                                            this.Alpha_slash.setAlpha(1);
                                            this.Alpha_slash.play("fireslash_vfx");
                                            this.slashSfx.play();
                                        }
                                        if(currentFrame.index == 12){
                                            this.Alpha_slash.body.setEnable(true);
                                        }
                                    }
                                })  
                            }

                            //Auto mode
                            if(this.isAuto){
                                this.charactersToPlay.forEach(character => {
                                    if(this.potion && this[`${character}_currentHp`] <= this[`${character}_maxHp`]*0.25){
                                        this.potion.emit('pointerdown');
                                    }

                                    if(this.skills){
                                        this.skills.forEach(item => {
                                            let { skill } = item;

                                            if(skill.properties.subType == "active" && this[`${skill.name} skill`].input.enabled){
                                                if(this.isAuto){
                                                    this.isAuto = false;
                                                    this[`${skill.name} skill`].emit('pointerdown')
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    })

                    if(this.enemies.getLength() <= 0){
                        this.char_state = 'running';
                        this.Alpha_char.play('alpha_run_state', true);

                        this.Alpha_slash.stop();
                        this.Alpha_slash.setAlpha(0);
                        this.Alpha_slash.body.setEnable(false);

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