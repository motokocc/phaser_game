import 'regenerator-runtime/runtime';
import Phaser from 'phaser';

class Explore extends Phaser.Scene {

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

        this.alpha_char = this.add.sprite(this.game.config.width/2, this.game.config.height/2, "alpha_idle").setOrigin(0.5).setDepth(10);
        this.alpha_char.play("alpha_idle_state");

        let actionButton = this.add.text(this.alpha_char.x + 50,this.alpha_char.y + this.alpha_char.displayHeight/2 + 20, 'IDLE', {fontFamily: 'Arial'}).setOrigin(0).setInteractive();
        actionButton.on('pointerdown', () => {
            this.alpha_char.play("alpha_idle_state");
        });

        let idleButton = this.add.text(this.alpha_char.x - 25,this.alpha_char.y + this.alpha_char.displayHeight/2 + 20, 'RUN', {fontFamily: 'Arial'}).setOrigin(1,0).setInteractive();
        idleButton.on('pointerup', () => {
            this.alpha_char.play("alpha_run_state");
        })
    }


    update(){
        // if(this.wolf.x == this.gameW + 200){
        //     this.wolf.x = 0;
        // }

        // this.wolf.x = this.wolf.x + 6;
    }
}

export default Explore;