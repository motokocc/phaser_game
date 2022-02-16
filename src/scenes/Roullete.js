import 'regenerator-runtime/runtime';
import BaseScene from '../plugins/BaseScene';
import { doc, updateDoc } from "firebase/firestore";
import { getSoundSettings, shortenLargeNumber, getDifferenceInDays } from '../js/utils';

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
        
        this.returnHome = getDifferenceInDays(new Date(), this.player.playerInfo.lastSpin) < 1? true : false; //Check if button should spin the roullete or return to main screen

        this.gameOptions = {
            slices: 10,
            slicePrizes: ["50 gold", "5 gems", "3 gold", "2 gems", "20 gold", "10 gems", "5 gold", "3 gems", "10 gold", "1 gems"],
            rotationTime: 3000
        }

        //NPC
        this.elfPirate = this.add.sprite(this.paddingX/2, this.gameH, 'elfPirate').setOrigin(0,1).setScale(0.7);

        let messages = [
                "Spin the wheel adventurer and I'll give you some of my treasures!",
                "You can only spin one time per day. Come back again later",
            ];
        let messageIndex = !this.player.playerInfo.lastSpin || getDifferenceInDays(new Date(), this.player.playerInfo.lastSpin) > 1 ? 0 : 1;
        this.pirateTalk('elf_pirate_talk', messages[messageIndex]);

        //Gems
        let gems = this.add.container();
        const gem_icon = this.add.sprite(this.paddingX, this.gameH*0.07,'gems').setOrigin(0.5).setDepth(2);
        const gem_box = this.add.rexRoundRectangle(gem_icon.x, gem_icon.y, this.paddingX*4, this.paddingX,this.paddingX/5, 0x000000).setOrigin(0,0.5).setAlpha(0.6);
        this.gems_value = this.add.text(gem_box.x + gem_box.width/2, gem_box.y, shortenLargeNumber(this.player.playerInfo.gems,2) || 0, {fontFamily: 'GameTextFont'}).setOrigin(0.5);

        //Gold
        let gold = this.add.container();
        const gold_icon = this.add.sprite(gem_box.x + gem_box.width + this.paddingX*2, this.gameH*0.07,'gold').setOrigin(0.5).setDepth(2);
        const gold_box = this.add.rexRoundRectangle(gold_icon.x, gem_icon.y, this.paddingX*4, this.paddingX, this.paddingX/5, 0x000000).setOrigin(0,0.5).setAlpha(0.6);
        this.gold_value = this.add.text(gold_box.x + gold_box.width/2, gold_box.y, shortenLargeNumber(this.player.playerInfo.gold,2) || 0, {fontFamily: 'GameTextFont'}).setOrigin(0.5);

        let currencyUI = this.add.container(0,-200);

        //Spin Button
        this.spinButton = this.add.sprite(this.gameW - this.paddingX*3.5, this.gameH - this.paddingX*1.5, this.returnHome?'backBtn': 'startSpinButton').setOrigin(0.5).setInteractive();
        this.spinButton.setScale(1.2);

        let spinWheel = this.add.container(0, this.gameH);
        let stand = this.add.sprite(this.gameW*0.6, this.gameH, 'roulleteStand').setScale(0.85).setOrigin(0.5,1); 
        let board = this.add.sprite(this.gameW*0.6, this.gameH/2, 'roulleteBoard').setScale(0.85);
        this.wheel = this.add.sprite(this.gameW*0.6, this.gameH/2, 'roulleteSlices').setScale(0.85).setInteractive();
        let pin = this.add.sprite(this.gameW*0.6 -1, this.gameH/2, 'tick').setScale(0.85);

        this.canSpin = true;
        this.spinButton.on("pointerover", () => {this.spinButton.setScale(1.3); this.hoverSound.play();});
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
        gems.add([gem_box, gem_icon, this.gems_value]);
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
            let spinningWheelSound = this.sound.add('spinWheelSound', {volume: getSoundSettings('spinWheelSound')});
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

                    if(this.messageBoxContainer){
                        this.messageBoxContainer.destroy();
                    }

                    spinningWheelSound.stop();

                    try{
                        let priceToGet = this.player.playerInfo[prizeUnit] + prizeValue;
                        let latestSpin = new Date();
                        let dataToFirebase = {};

                        dataToFirebase[prizeUnit] = priceToGet;
                        dataToFirebase.lastSpin = latestSpin;

                        //Save to firebase
                        let { users, playerInfo } = this.player;
                        let { address } = playerInfo;
                        await updateDoc(doc(users, address), dataToFirebase);

                        this.player.playerInfo[prizeUnit] = priceToGet;
                        this.player.playerInfo.lastSpin = latestSpin;
                        this[`${prizeUnit}_value`].setText(shortenLargeNumber(this.player.playerInfo[prizeUnit],2));
                        this.pirateTalk(
                            'elf_pirate_talk',
                            `You won ${prizeValue} ${prizeValue <= 1 && prizeUnit == 'gems'? 'gem' : prizeUnit }! Come back tomorrow and I'll give you more.`
                        )
                    }
                    catch(e){
                        this.pirateTalk(
                            'elf_pirate_talk',
                            'An error occured, Please check your connection.'
                        )
                    }

                }
            });
        }
    }

    pirateTalk(npcAnimation, message){
        this.elfPirate.play(npcAnimation);
        this.createSpeechBubble (
            this.elfPirate.displayWidth*0.85,
            this.game.config.height- this.elfPirate.displayHeight - this.game.config.width * 0.025,
            180, 120,
            message
        );
    }
}

export default DailyRoullete;