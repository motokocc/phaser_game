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
                }

                if(this.Saya_currentHp <= 0 && this.Alpha_currentHp <= 0){
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

            //Saya
            let sayahpButton = this.add.text(
                this.Saya_status_frame.x + this.Saya_status_frame.displayWidth + this.padding, 
                this.Saya_status_frame.y + this.padding/2,
                'TAKE DAMAGE',
                {fontFamily: 'GameTextFont', fontSize: 25, fontStyle: 'Bold'}
            ).setInteractive()
            .on('pointerdown', () => {
                this.Saya_currentHp = this.Saya_currentHp - damage;

                if(this.Saya_currentHp <= 0){
                    this.Saya_frame_image.tint = 0x808080;
                    this.Saya_currentHp = 0;      
                }

                if(this.Saya_currentHp <= 0 && this.Alpha_currentHp <= 0){
                    this.lose(this.player.gameModeData.mode, [intro_bgm.key, battle_bgm.key]);
                }

                this.Saya_hpBar.value = this.Saya_currentHp/this.Saya_maxHp;
                this.Saya_hpText.setText(`${this.Saya_currentHp}/${this.Saya_maxHp}`);
            }).setOrigin(0);

        this.add.text(
                sayahpButton.x,
                sayahpButton.y + sayahpButton.displayHeight + this.padding/2,
                'GET XP',
                {fontFamily: 'GameTextFont', fontSize: 25, fontStyle: 'Bold'}
            ).setInteractive()
            .on('pointerdown', () => {
                this.Saya_currentXp = this.Saya_currentXp + xp;

                if(this.Saya_currentXp >=  this.Saya_levelupXp){
                    this.Saya_maxHp = this.Saya_maxHp + 2;
                    this.Saya_currentHp = this.Saya_maxHp;
                    this.Saya_hpBar.value = this.Saya_currentHp/this.Saya_maxHp;
                    this.Saya_hpText.setText(`${this.Saya_currentHp}/${this.Saya_maxHp}`);

                    this.Saya_currentXp = 0;
                    this.Saya_level++;
                    this.Saya_levelText.setText(this.Saya_level);
                    this.levelUp(this.Saya_level, this.player.gameModeData.mode, [intro_bgm.key, battle_bgm.key]);
                }

                this.Saya_xpBar.value = this.Saya_currentXp/this.Saya_levelupXp;
            }).setOrigin(0);

            this.add.text(this.gameW - this.padding, sayahpButton.y, 'FINISH HUNT >>', {
                fontFamily: 'GameTextFont', fontStyle: 'Bold', fontSize:25
            }).setInteractive().setOrigin(1,0.5)
            .on('pointerdown', () => {
                this.game_state = 'off';
            })
    }


    update(){
        if(this.game_state == 'on'){
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
        else{
            if(this.alpha_char.x <= this.game.config.width + this.alpha_char.displayWidth + this.padding){
                this.alpha_char.x = this.alpha_char.x + 9;
            }
        }

    }
}

export default Adventure;