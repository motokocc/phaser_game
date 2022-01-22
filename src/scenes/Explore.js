import 'regenerator-runtime/runtime';
import Phaser from 'phaser';
import UpperUi from '../components/upperUI';

class Explore extends Phaser.Scene {

    create(){
        let test = new UpperUi(this);
        this.add.existing(test);

        test.generate(true,true);
        console.log(test.gold_value)

        this.anims.create({
            key: "bite",
            frameRate: 6,
            frames: this.anims.generateFrameNumbers("wolf", { start: 0, end: 5 }),
            repeat: -1
        });

        this.anims.create({
            key: "run",
            frameRate: 3,
            frames: this.anims.generateFrameNumbers("wolf", { start: 6, end: 8 }),
            repeat: -1
        });
        
        this.anims.create({
            key: "scratch",
            frameRate: 6,
            frames: this.anims.generateFrameNumbers("wolf", { start: 9, end: 14 }),
            repeat: -1
        });

        this.anims.create({
            key: "scratch_bite",
            frameRate: 6,
            frames: this.anims.generateFrameNumbers("wolf", { start: 0, end: 14, frames: [0,1,2,3,4,5,9,10,11,12,13,14]}),
            repeat: -1
        });

        this.anims.create({
            key: "wolf_idle",
            frameRate: 6,
            frames: this.anims.generateFrameNumbers("wolf", { start: 0, end: 1 }),
            repeat: -1
        });

        this.wolf = this.add.sprite(this.game.config.width/2, this.game.config.height/2, "wolf");
        this.wolf.play("wolf_idle");

        let actionButton = this.add.sprite(this.wolf.x,this.wolf.y + this.wolf.displayHeight/2 + 20, 'confirmButton').setOrigin(0.5,0).setInteractive();
        actionButton.on('pointerdown', () => {
            this.wolf.play("scratch_bite");
        });

        actionButton.on('pointerup', () => {
            this.wolf.play("wolf_idle");
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