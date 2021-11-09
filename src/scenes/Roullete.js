import BaseScene from '../plugins/BaseScene';

class DailyRoullete extends BaseScene {

    create(){
        let gameBg = this.add.image(0,0,'roulleteBg');
        gameBg.setOrigin(0,0);
        gameBg.setScale(1.1);

        const gameW = this.game.config.width;
        const gameH = this.game.config.height;
        this.gameOptions = {
            slices: 10,
            slicePrizes: ["50 gold", "5 gems", "3 gold", "2 gems", "20 gold", "10 gems", "5 gold", "3 gems", "10 gold", "1 gem"],
            rotationTime: 3000
        }

        let board = this.add.sprite(gameW / 2, gameH / 2, 'roulleteBoard');
        this.wheel = this.add.sprite(gameW / 2, gameH / 2, 'roulleteSlices').setInteractive();
        this.pin = this.add.sprite(gameW/2 -1, gameH / 2, 'tick');
        this.prizeText = this.add.text(gameW / 2, gameH - 20, "Spin the wheel", {
            font: "bold 32px Arial",
            align: "center",
            color: "white"
        }).setOrigin(0.5);

        this.canSpin = true;
        this.wheel.on("pointerdown", this.spinWheel, this);
    }

    spinWheel(){
        if(this.canSpin){
            this.prizeText.setText("");
            let rounds = Phaser.Math.Between(3, 5);
            let degrees = Phaser.Math.Between(0, 360);
 
            // before the wheel ends spinning, we already know the prize according to "degrees" rotation and the number of slices
            let prize = this.gameOptions.slices - 1 - Math.floor(degrees / (360 / this.gameOptions.slices)); 
            // now the wheel cannot spin because it's already spinning
            this.canSpin = false;

            this.tweens.add({
                targets: [this.wheel],
                angle: 360 * rounds + degrees,
                duration: this.gameOptions.rotationTime,
                ease: "Cubic.easeOut",
                callbackScope: this,
                onComplete: function(tween){
                    this.prizeText.setText(this.gameOptions.slicePrizes[prize]);
                    this.canSpin = true;
                }
            });
        }
    }
}

export default DailyRoullete;