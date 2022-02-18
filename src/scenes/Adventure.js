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
        
        //BG
        let forest_width = 2133;
        this.forest_layer_0 = this.add.tileSprite(0,0,forest_width, this.game.config.height,'forest_layer_0').setOrigin(0).setScrollFactor(0, 1);
        this.forest_layer_1 = this.add.tileSprite(0,0,forest_width, this.game.config.height,'forest_layer_1').setOrigin(0).setScrollFactor(0, 1);
        this.forest_layer_2 = this.add.tileSprite(0,0,forest_width, this.game.config.height,'forest_layer_2').setOrigin(0).setScrollFactor(0, 1);
        this.forest_layer_3 = this.add.tileSprite(0,0,forest_width, this.game.config.height,'forest_layer_3').setOrigin(0).setScrollFactor(0, 1);
        this.forest_layer_4 = this.add.tileSprite(0,0,forest_width, this.game.config.height,'forest_layer_4').setOrigin(0).setScrollFactor(0, 1);
        this.forest_layer_5 = this.add.tileSprite(0,0,forest_width, this.game.config.height,'forest_layer_5').setOrigin(0).setScrollFactor(0, 1);

        this.alpha_char = this.add.sprite(0, this.game.config.height*0.65, "alpha_idle").setOrigin(1,0.5).setDepth(10);
        this.alpha_char.play("alpha_run_state");

         this.char_state = "running";
    }


    update(){
        if(this.alpha_char.x <= this.game.config.width*0.6){
            this.alpha_char.x = this.alpha_char.x + 9;
        }
        else{
            if(this.char_state == 'running'){
                this.alpha_char.anims.timeScale = this.speedMultiplier == 2? 1.5 : this.speedMultiplier;
                this.forest_layer_0.tilePositionX += 4 * this.speedMultiplier;
                this.forest_layer_1.tilePositionX += 5 * this.speedMultiplier;
                this.forest_layer_2.tilePositionX += 6 * this.speedMultiplier;
                this.forest_layer_3.tilePositionX += 9 * this.speedMultiplier;
                this.forest_layer_4.tilePositionX += 7 * this.speedMultiplier;
                this.forest_layer_5.tilePositionX += 7 * this.speedMultiplier;
            }
        }
    }
}

export default Adventure;