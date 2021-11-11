import 'regenerator-runtime/runtime';
import BaseScene from '../plugins/BaseScene';
import { doc, setDoc } from "firebase/firestore";

class DailyRoullete extends BaseScene {

    create(){
        let gameBg = this.add.image(0,0,'roulleteBg');
        gameBg.setOrigin(0,0);
        gameBg.setScale(1.1);

        this.anims.create({
            key: 'elf_pirate_talk',
            frames: [
                { key: 'elf_pirate_talk_1' },
                { key: 'elf_pirate_talk_2' },
            ],
            repeat: 5,
            frameRate: 8,
        });

        console.log('ilang minuto?', this.getDifferenceInMinutes(new Date(), this.player.playerInfo.lastSpin));
        console.log('ilang araw?', this.getDifferenceInDays(new Date(), this.player.playerInfo.lastSpin));
        this.returnHome = this.getDifferenceInMinutes(new Date(), this.player.playerInfo.lastSpin) < 5? true : false; //Check if button should spin the roullete or return to main screen

        const gameW = this.game.config.width;
        const gameH = this.game.config.height;
        const paddingX = gameW * 0.025;

        this.gameOptions = {
            slices: 10,
            slicePrizes: ["50 gold", "5 gems", "3 gold", "2 gems", "20 gold", "10 gems", "5 gold", "3 gems", "10 gold", "1 gems"],
            rotationTime: 3000
        }

        //NPC
        this.elfPirate = this.add.sprite(paddingX/2, gameH, 'elfPirate').setOrigin(0,1).setScale(0.7);
        this.elfPirate.play('elf_pirate_talk');

        let messages = [
                "Spin the wheel adventurer and I'll give you some of my treasures!",
                "You can only spin one time per day. Come back again later",
            ];
        let messageIndex = !this.player.playerInfo.lastSpin || this.getDifferenceInMinutes(new Date(), this.player.playerInfo.lastSpin) > 5 ? 0 : 1;
        this.createSpeechBubble (this.elfPirate.displayWidth*0.85, gameH- this.elfPirate.displayHeight - paddingX, 180, 120, messages[messageIndex]);

        //Gems
        let gems = this.add.container();
        const gem_icon = this.add.sprite(paddingX, gameH*0.07,'gems').setOrigin(0.5).setDepth(2);
        const gem_box = this.add.rectangle(gem_icon.x, gem_icon.y, paddingX*4, paddingX, 0x000000).setOrigin(0,0.5).setAlpha(0.6);
        this.gem_value = this.add.text(gem_box.x + gem_box.width/2, gem_box.y, this.player.playerInfo.gems || 0, {fontFamily: 'Arial'}).setOrigin(0.5);

        //Gold
        let gold = this.add.container();
        const gold_icon = this.add.sprite(gem_box.x + gem_box.width + paddingX*2, gameH*0.07,'gold').setOrigin(0.5).setDepth(2);
        const gold_box = this.add.rectangle(gold_icon.x, gem_icon.y, paddingX*4, paddingX, 0x000000).setOrigin(0,0.5).setAlpha(0.6);
        this.gold_value = this.add.text(gold_box.x + gold_box.width/2, gold_box.y, this.player.playerInfo.gold || 0, {fontFamily: 'Arial'}).setOrigin(0.5);

        let currencyUI = this.add.container(0,-200);

        //Spin Button
        this.spinButton = this.add.sprite(gameW - paddingX*3.5, gameH - paddingX*1.5, this.returnHome?'backBtn': 'startSpinButton').setOrigin(0.5).setInteractive();
        this.spinButton.setScale(1.2);

        let spinWheel = this.add.container(0, gameH);
        let stand = this.add.sprite(gameW*0.6, gameH, 'roulleteStand').setScale(0.85).setOrigin(0.5,1); 
        let board = this.add.sprite(gameW*0.6, gameH/2, 'roulleteBoard').setScale(0.85);
        this.wheel = this.add.sprite(gameW*0.6, gameH/2, 'roulleteSlices').setScale(0.85).setInteractive();
        let pin = this.add.sprite(gameW*0.6 -1, gameH/2, 'tick').setScale(0.85);

        this.canSpin = true;
        this.spinButton.on("pointerover", () => {this.spinButton.setScale(1.3); this.sound.play('hoverEffect', {loop: false});});
        this.spinButton.on("pointerout", () => this.spinButton.setScale(1.2));
        this.spinButton.on("pointerdown", () => {
            if(this.returnHome){
                this.scene.start("game");
            }
            else{
                this.spinWheel();
            }
        }
        , this);

        //UI Containers/Groups
        gems.add([gem_box, gem_icon, this.gem_value]);
        gold.add([gold_box, gold_icon, this.gold_value]);
        currencyUI.add([gold, gems]);       
        spinWheel.add([stand, board, this.wheel, pin, this.spinButton]);

        //UI Animations
        this.tweens.add({
            targets: [currencyUI, spinWheel],
            y: { value: 0, duration: 650, ease: 'Power1'},
            yoyo: false,
        });
    }

    spinWheel(){
        if(this.canSpin){
            let spinningWheelSound = this.sound.add('spinWheelSound', {volume: 0.4});
            spinningWheelSound
            spinningWheelSound.play();
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
                onComplete: async function(tween){
                    let finalPrize = this.gameOptions.slicePrizes[prize];

                    this.canSpin = true;
                    this.returnHome = true;
                    this.spinButton.setTexture('backBtn');

                    let prizeToSplit = finalPrize.split(' ');
                    let prizeValue = Number(prizeToSplit[0]);
                    let prizeUnit = prizeToSplit[1];

                    this.player.playerInfo[prizeUnit] = this.player.playerInfo[prizeUnit] + prizeValue;
                    this.player.playerInfo.lastSpin = new Date();

                    if(prizeUnit == 'gold'){
                        this.gold_value.setText(this.player.playerInfo[prizeUnit]);
                    }
                    else{
                        this.gem_value.setText(this.player.playerInfo[prizeUnit]);
                    }

                    if(this.messageBoxContainer){
                        this.messageBoxContainer.destroy();
                    }

                    this.elfPirate.play('elf_pirate_talk');
                    this.createSpeechBubble (
                        this.elfPirate.displayWidth*0.85,
                        this.game.config.height- this.elfPirate.displayHeight - this.game.config.width * 0.025,
                        180, 120,
                        `You won ${prizeValue} ${prizeValue <= 1 && prizeUnit == 'gems'? 'gem' : prizeUnit }! Come back tomorrow and I'll give you more.`
                    );
                    spinningWheelSound.stop();

                    //Save to firebase
                    await setDoc(doc(this.player.users, this.player.playerInfo.address), this.player.playerInfo);
                }
            });
        }
    }
}

export default DailyRoullete;