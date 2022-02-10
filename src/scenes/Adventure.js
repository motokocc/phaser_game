import 'regenerator-runtime/runtime';
import Phaser from 'phaser';

class Adventure extends Phaser.Scene {

    create(){

        this.anims.create({
            key: "alpha_idle_state",
            frameRate: 20,
            frames: this.anims.generateFrameNumbers("alpha_idle", { start: 0, end: 19 }),
            repeat: -1
        });

        this.anims.create({
            key: "alpha_run_state",
            frameRate: 26,
            frames: this.anims.generateFrameNumbers("alpha_run", { start: 0, end: 21, frames:[
                14,15,16,17,18,19,20,21,0,1,2,3,4,5,6,7,8,9,10,11,12,13
            ] }),
            repeat: -1
        });

        //BG
        let forest_width = 2133;
        this.forest_layer_0 = this.add.tileSprite(0,0,forest_width, this.game.config.height,'forest_layer_0').setOrigin(0).setScrollFactor(0, 1);
        this.forest_layer_1 = this.add.tileSprite(0,0,forest_width, this.game.config.height,'forest_layer_1').setOrigin(0).setScrollFactor(0, 1);
        this.forest_layer_2 = this.add.tileSprite(0,0,forest_width, this.game.config.height,'forest_layer_2').setOrigin(0).setScrollFactor(0, 1);
        this.forest_layer_3 = this.add.tileSprite(0,0,forest_width, this.game.config.height,'forest_layer_3').setOrigin(0).setScrollFactor(0, 1);
        this.forest_layer_4 = this.add.tileSprite(0,0,forest_width, this.game.config.height,'forest_layer_4').setOrigin(0).setScrollFactor(0, 1);
        this.forest_layer_5 = this.add.tileSprite(0,0,forest_width, this.game.config.height,'forest_layer_5').setOrigin(0).setScrollFactor(0, 1);

        this.alpha_char = this.add.sprite(200, this.game.config.height*0.65, "alpha_idle").setOrigin(0.5).setDepth(10);
        this.alpha_char.play("alpha_run_state");

        // let state = "running";

        // let idleButton = this.add.text(this.alpha_char.x + 50,this.alpha_char.y + this.alpha_char.displayHeight/2 + 20, 'IDLE', {fontFamily: 'Arial'}).setOrigin(0).setInteractive();
        // idleButton.on('pointerdown', async() => {
        //     state = "idle";
        //     this.alpha_char.on('animationupdate', (currentAnim, currentFrame, sprite)=>{
        //         if(currentFrame.textureFrame == 14 && currentAnim.key == "alpha_run_state"){
        //             sprite.stop();
        //             sprite.play("alpha_idle_state");
        //         }
        //     });
        // });

        // let runButton = this.add.text(this.alpha_char.x - 25,this.alpha_char.y + this.alpha_char.displayHeight/2 + 20, 'RUN', {fontFamily: 'Arial'}).setOrigin(1,0).setInteractive();
        // runButton.on('pointerup', () => {
        //     state = "running";

        //     this.alpha_char.play("alpha_run_state");
        // })


    }


    update(){
        // setTimeout(() => {
        //     this.alpha_char.play("alpha_run_state", true);
              this.forest_layer_0.tilePositionX += 2;
              this.forest_layer_1.tilePositionX += 3;
              this.forest_layer_2.tilePositionX += 4;
              this.forest_layer_3.tilePositionX += 7;
              this.forest_layer_4.tilePositionX += 6;
              this.forest_layer_5.tilePositionX += 6;

        // }, 4500);

        // if(this.alpha_char.x >= this.game.config.width/2){
        //     this.alpha_char.x == this.game.config.width/2;
        //     this.alpha_char.x = this.alpha_char.x + 0;
        // }
        // else{
        //     setTimeout(() => {
        //         this.alpha_char.x = this.alpha_char.x + 6;
        //     }, 5000);
        // }
    }
}

export default Adventure;