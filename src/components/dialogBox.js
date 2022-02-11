import 'regenerator-runtime/runtime'
import Phaser from 'phaser';
import { tutorialDialogue } from '../js/character_dialogues/tutorial';
import { getSoundSettings } from '../js/utils';

export default class DialogBox extends Phaser.Scene{
	constructor(scene){
		super(scene);
        this.scene = scene;

		this.dialogueCounter = 0;
        this.gameW = this.scene.game.config.width;
        this.gameH = this.scene.game.config.height;
        this.paddingX = this.gameW * 0.025;
    }

    generate(dialogue, uiParams, animParams){
        this.dialogue = dialogue;
        const dialogPadding = 18;
        const dialogBoxH = this.gameH / 5;

        let box = this.scene.add.sprite(0,this.gameH - dialogBoxH, 'dialogueBox').setOrigin(0);
        box.displayWidth = this.gameW;
        box.displayHeight = dialogBoxH;

        this.messageText = this.scene.add.text(
            dialogPadding, 
            (this.gameH - dialogBoxH) + dialogPadding,
            '',
            {color: '#613e1e', fontFamily: 'Arial'}
        ).setWordWrapWidth(this.gameW * 0.9, true);
        this.typewriteTextWrapped(this.dialogue[this.dialogueCounter].message)

        //Next Button Function
        this.nextText = this.scene.add.text( this.gameW-dialogPadding, this.gameH - dialogPadding, 'Next >>>', {color: '#613e1e', fontFamily:'Arial'}).setInteractive();
        this.nextText.setOrigin(1,1);
      
        this.nextText.on('pointerdown', () => {
            this.nextText.setScale(0.9);
            this.nextText.setAlpha(0.7);
            this.scene.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('hoverEffect')});
        })

        this.nextText.on('pointerup', () => {
            this.nextText.setScale(1);
            this.nextText.setAlpha(1);

            if(this.dialogueCounter == uiParams.sceneNumber && uiParams.type == 'inputBox'){
                this.inputBox(animParams[this.dialogueCounter]);
                this.nextText.disableInteractive();
            }
            else if(this.dialogueCounter < this.dialogue.length - 1){
                this.dialogueCounter++;
                this.textTimer.remove();
                this.messageText.setText('');
                this.typewriteTextWrapped(this.dialogue[this.dialogueCounter].message);

                //for the animation
                animParams.map( anim => {
                    if(this.dialogueCounter == anim.sceneNumber){
                        this.animationSceneHandler(anim.spriteImage, anim.animationType);
                    }
                })
            }
            else{
                this.scene.scene.start(uiParams.nextPage);
            }
        });
    }

    inputBox(animParams){
        let inputName = '';
        let inputContainer = this.scene.add.sprite( this.gameW/2, this.gameH/2, 'scroll').setDepth(1).setScale(1.4);

        let inputTitle = this.scene.add.text( this.gameW/2, this.gameH/2 - 80, 'Please enter your name',
            { fontSize: "25px", color: '#613e1e', fontFamily: 'GameTextFont'}
        ).setOrigin(0.5).setDepth(2);

        let inputText = this.scene.add.rexInputText( this.gameW/2, this.gameH/2 - 20, 300, 40,
            { 
                type: "text",
                maxLength: 15,
                fontSize : "25px",
                minLength: 3,
                backgroundColor : "white",
                color: "black"
            }).setOrigin(0.5).setDepth(2)
        .on('textchange', inputText => {
            inputName = inputText.text.trim();
        });

        let nameInput = document.querySelectorAll('input')[0];
        nameInput.onkeydown = function(e){
            let allowedKey = /[^a-z0-9]/gi;
            let onlyAlphanumeric = new RegExp(allowedKey);

            if(e.key == 'Backspace' || e.key == '_' || e.key == '-'){
                return true;
            }
            else if(onlyAlphanumeric.test(e.key))
            {
                return false;
            }
        }

        inputText.setStyle("border-radius", "10px");
        inputText.setStyle("text-align", "center");

        let inputButton = this.scene.add.sprite( this.gameW/2, this.gameH/2 + 50,'confirmButton').setOrigin(0.5).setScale(1.1).setDepth(2).setInteractive();

        inputButton.on('pointerover', () => {
            inputButton.setScale(1.2);
            this.scene.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('hoverEffect')});
        });

        inputButton.on('pointerout', () => {
            inputButton.setScale(1.1);
        });

        inputButton.on('pointerup', () => {
            inputButton.setAlpha(1.1);
        });

        inputButton.on('pointerdown', () => {
            inputButton.setAlpha(1);
            this.scene.sound.play('clickEffect', {loop: false, volume: getSoundSettings('clickEffect')});
            this.scene.player.playerInfo.name = inputName? inputName : 'Player';
            this.dialogue = tutorialDialogue(this.scene.player.playerInfo.name);

            //Typewriter effect and proceed to next dialogue
            this.dialogueCounter++;
            if(this.dialogueCounter == animParams.sceneNumber){
                this.animationSceneHandler(animParams.spriteImage, animParams.animationType);
            }
            this.textTimer.remove();
            this.messageText.setText('');
            this.typewriteTextWrapped(this.dialogue[this.dialogueCounter].message);
            this.nextText.setInteractive();

            //Remove the inputBox from scene
            inputContainer.destroy();
            inputText.destroy();
            inputTitle.destroy();
            inputButton.destroy();
        });

    }

    typewriteText(text){
        const length = text.length
        let i = 0;

        this.textTimer = this.scene.time.addEvent({
            callback: () => {
                this.messageText.text += text[i];
                ++i;
            },
            repeat: length - 1,
            delay: 10,
            timeScale: 10000
        })
    }

    typewriteTextWrapped(text){
        const lines = this.messageText.getWrappedText(text)
        const wrappedText = lines.join('\n')

        this.typewriteText(wrappedText)
    }

    animationSceneHandler(spriteImage, sceneAnimation){ 
        spriteImage.play(sceneAnimation)
    }

}