import 'regenerator-runtime/runtime';
import Phaser from 'phaser';

class Explore extends Phaser.Scene {

    create(){

        this.anims.create({
            key: "alpha_idle_state",
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("alpha_idle", { start: 0, end: 19 }),
            repeat: -1
        });

        // let actionButton = this.add.sprite(this.wolf.x,this.wolf.y + this.wolf.displayHeight/2 + 20, 'confirmButton').setOrigin(0.5,0).setInteractive();
        // actionButton.on('pointerdown', () => {
        //     this.wolf.play("scratch_bite");
        // });

        // actionButton.on('pointerup', () => {
        //     this.wolf.play("wolf_idle");
        // })

        this.alpha_char = this.add.sprite(this.game.config.width/2, this.game.config.height/2, "alpha_idle").setOrigin(0.5).setDepth(10);
        this.alpha_char.play("alpha_idle_state");
    }


    update(){
        // if(this.wolf.x == this.gameW + 200){
        //     this.wolf.x = 0;
        // }

        // this.wolf.x = this.wolf.x + 6;
    }
}

export default Explore;