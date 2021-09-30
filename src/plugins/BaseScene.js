import Phaser from 'phaser';
import { tutorialDialogue } from '../js/character_dialogues/tutorial';

class BaseScene extends Phaser.Scene {
    init(data){
        this.data = data;
    }

    dialogBox(dialogue, params){
        this.dialogue = dialogue;

        const gameW = this.game.config.width;
        const gameH = this.game.config.height;
        const dialogPadding = 15;
        const dialogBoxH = this.game.config.height / 5;

        this.dialogueCounter = 0;

        this.add.rectangle(0,gameH - dialogBoxH, gameW, dialogBoxH, 0x914f1d).setOrigin(0);

        this.messageText = this.add.text(
            dialogPadding, 
            (gameH - dialogBoxH) + dialogPadding,
            ''
        ).setWordWrapWidth(gameW * 0.9, true);
        this.typewriteTextWrapped(this.dialogue[this.dialogueCounter].message)

        //Character Name Box
        this.characterName = this.add.text(dialogPadding, (gameH - dialogBoxH) - dialogPadding, this.dialogue[this.dialogueCounter].name);
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
            if(this.dialogueCounter == params.sceneNumber && params.type == 'inputBox'){
                this.inputBox(this.dialogue);
                this.nextText.disableInteractive();
            }
            else if(this.dialogueCounter < this.dialogue.length - 1){
                this.dialogueCounter++;
                this.textTimer.remove();
                this.messageText.setText('');
                this.typewriteTextWrapped(this.dialogue[this.dialogueCounter].message);
            }
            else{
                return;
            }
        });
    }

    typewriteText(text)
    {
        const length = text.length
        let i = 0;

        this.textTimer = this.time.addEvent({
            callback: () => {
                this.messageText.text += text[i];
                ++i;
            },
            repeat: length - 1,
            delay: -500,
            timeScale: 300
        })
    }

    typewriteTextWrapped(text)
    {
        const lines = this.messageText.getWrappedText(text)
        const wrappedText = lines.join('\n')

        this.typewriteText(wrappedText)
    }

    inputBox(dialogue){

        let inputName = '';
        this.inputContainer = this.add.rectangle(
            this.game.config.width/2,
            this.game.config.height/2,
            this.game.config.width / 3,
            this.game.config.width / 4,
            0x914f1d
        ).setOrigin(0.5)
        .setDepth(1);

        this.inputTitle = this.add.text(
            this.game.config.width/2,
            this.game.config.height/2 - 60,
            'Please enter your name',
            {
                fontSize: "21px"
            }
        ).setOrigin(0.5)
        .setDepth(2);

        this.inputText = this.add.rexInputText(
            this.game.config.width/2,
            this.game.config.height/2,
            300,
            40,
            { 
                type: "text",
                maxLength: 20,
                fontSize : "30px",
                minLength: 3,
                backgroundColor : "white",
                color: "black",
            }
        ).setOrigin(0.5)
        .setDepth(2)
        .on('textchange', inputText => {
            inputName = inputText.text;
        });

        this.inputButton = this.add.sprite(
            this.game.config.width/2,
            this.game.config.height/2 + 70,
            'okButton',
        ).setOrigin(0.5)
        .setScale(0.08)
        .setDepth(2)
        .setInteractive();

        this.inputButton.on('pointerover', () => {
            this.inputButton.setScale(0.09);
            this.sound.play('hoverEffect', {loop: false});
        });

        this.inputButton.on('pointerout', () => {
            this.inputButton.setScale(0.08);
        });

        this.inputButton.on('pointerup', () => {
            this.inputButton.setAlpha(1);
        });

        this.inputButton.on('pointerdown', () => {
            this.inputButton.setAlpha(0.7);
            this.sound.play('clickEffect', {loop: false});
            this.player.playerInfo.name = inputName;
            this.dialogue = tutorialDialogue(this.player.playerInfo.name);

            //Typewriter effect and proceed to next dialogue
            this.dialogueCounter++;
            this.textTimer.remove();
            this.messageText.setText('');
            this.typewriteTextWrapped(this.dialogue[this.dialogueCounter].message);
            this.nextText.setInteractive();

            //Remove the inputBox from scene
            this.inputContainer.destroy();
            this.inputText.destroy();
            this.inputTitle.destroy();
            this.inputButton.destroy();
        });

    }
}

export default BaseScene;