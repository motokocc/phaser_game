import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {
    init(data){
        this.data = data;
    }

    dialogBox(dialogue){
        const gameW = this.game.config.width;
        const gameH = this.game.config.height;
        const dialogPadding = 15;
        const dialogBoxH = this.game.config.height / 5;

        let dialogueCounter = 0;

        this.add.rectangle(0,gameH - dialogBoxH, gameW, dialogBoxH, 0x914f1d).setOrigin(0);

        this.messageText = this.add.text(
            dialogPadding, 
            (gameH - dialogBoxH) + dialogPadding,
            dialogue[dialogueCounter].message
        ).setWordWrapWidth(gameW * 0.9, true);

        //Character Name Box
        this.characterName = this.add.text(dialogPadding, (gameH - dialogBoxH) - dialogPadding, dialogue[dialogueCounter].name);
        this.characterName.setOrigin(0,1);
        this.characterName.setDepth(1);
        this.add.rectangle(
            0,
            (gameH - dialogBoxH),
            this.characterName.width + (dialogPadding*2),
            this.characterName.height + (dialogPadding*2),
            0x914f1d
        ).setOrigin(0,1);

        //Next Button Function
        this.nextText = this.add.text( gameW-dialogPadding, gameH - dialogPadding, 'Next >>>').setInteractive();
        this.nextText.setOrigin(1,1);

        
        this.nextText.on('pointerdown', () => {
            this.nextText.setScale(0.9);
            this.nextText.setAlpha(0.7);
            this.sound.play('hoverEffect', {loop: false});
        })

        this.nextText.on('pointerup', () => {
            this.nextText.setScale(1);
            this.nextText.setAlpha(1);
            if(dialogueCounter < dialogue.length - 1){
                dialogueCounter++;
                this.messageText.setText(dialogue[dialogueCounter].message);
            }
            else{
                return;
            }
        });
    }
}

export default BaseScene;