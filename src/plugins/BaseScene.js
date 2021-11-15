import Phaser from 'phaser';
import { tutorialDialogue } from '../js/character_dialogues/tutorial';

class BaseScene extends Phaser.Scene {
    init(data){
        this.data = data;       
        this.dialogueCounter = 0;
        this.toggleSettings = false;
    }



    popUp(title, content, titleSize){
        content.setDepth(25);
        this.popupContainer = this.add.group().setDepth(15);

        let popupBg = this.add.rectangle(0,0, this.game.config.width, this.game.config.height, 0x000000, 0.7)
            .setOrigin(0)
            .setInteractive();

        let popupBody = this.add.sprite(
            this.game.config.width/2,
            this.game.config.height/2,
            'scroll'
        ).setScale(0,1.3);

        let popupTitle = this.add.text(
            popupBody.x,
            popupBody.y - popupBody.height*0.4,
            title, {fontFamily:'Arial', color: '#613e1e', fontSize: titleSize || '20px', fontStyle: 'Bold'})
        .setOrigin(0.5).setScale(0,1.3);

        this.popupContainer.addMultiple([popupBg, popupBody, popupTitle].concat(content.getChildren()));

        this.tweens.add({
            targets: this.popupContainer.getChildren(),
            scaleX: { value: 1.3, duration: 250, ease: 'easeIn'},
            scaleY: { value: 1.3, duration: 250, ease: 'easeIn'},
            yoyo: false
        });

        popupBg.on('pointerdown', () => {
            content.destroy(true);
            this.popupContainer.destroy(true);
        });
    }

    settingsBox(x,y,width,height, bodyPaddingX, bodyPaddingY){

        this.settingsContainer = this.add.container(this.game.config.width, 0);

        let settingsBody = this.add.rectangle(x-bodyPaddingX ,y + bodyPaddingY,width,height,0x000000, 1).setOrigin(1,0).setInteractive();

        this.settingsContainer.add([settingsBody]);
           
    }

    toggleSettingsBox(){
        this.toggleSettings = !this.toggleSettings;
    
        if(this.toggleSettings){
           this.tweens.add({
                targets: this.settingsContainer,
                x: { value: 0, duration: 600, ease: 'Power1'},
                yoyo: false, 
            }); 
        }
        else {
             this.tweens.add({
                targets: this.settingsContainer,
                x: { value: this.game.config.width, duration: 600, ease: 'Power1'},
                yoyo: false, 
            });          
        }
    }


    dialogBox(dialogue, uiParams, animParams){
        this.dialogue = dialogue;

        const gameW = this.game.config.width;
        const gameH = this.game.config.height;
        const dialogPadding = 18;
        const dialogBoxH = this.game.config.height / 5;

        let box = this.add.sprite(0,gameH - dialogBoxH, 'dialogueBox').setOrigin(0);
        box.displayWidth = gameW;
        box.displayHeight = dialogBoxH;

        this.messageText = this.add.text(
            dialogPadding, 
            (gameH - dialogBoxH) + dialogPadding,
            '',
            {color: '#613e1e'}
        ).setWordWrapWidth(gameW * 0.9, true);
        this.typewriteTextWrapped(this.dialogue[this.dialogueCounter].message)

        //Next Button Function
        this.nextText = this.add.text( gameW-dialogPadding, gameH - dialogPadding, 'Next >>>', {color: '#613e1e'}).setInteractive();
        this.nextText.setOrigin(1,1);

        
        this.nextText.on('pointerdown', () => {
            this.nextText.setScale(0.9);
            this.nextText.setAlpha(0.7);
            this.sound.play('hoverEffect', {loop: false});
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
                this.scene.start(uiParams.nextPage);
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
            delay: 10,
            timeScale: 10000
        })
    }

    typewriteTextWrapped(text)
    {
        const lines = this.messageText.getWrappedText(text)
        const wrappedText = lines.join('\n')

        this.typewriteText(wrappedText)
    }

    inputBox(animParams){

        let inputName = '';
        let inputContainer = this.add.sprite(
            this.game.config.width/2,
            this.game.config.height/2,
            'scroll'
        ).setDepth(1)
        .setScale(1.4);

        let inputTitle = this.add.text(
            this.game.config.width/2,
            this.game.config.height/2 - 80,
            'Please enter your name',
            {
                fontSize: "21px",
                color: '#613e1e'
            }
        ).setOrigin(0.5)
        .setDepth(2);

        let inputText = this.add.rexInputText(
            this.game.config.width/2,
            this.game.config.height/2 - 20,
            300,
            40,
            { 
                type: "text",
                maxLength: 15,
                fontSize : "25px",
                minLength: 3,
                backgroundColor : "white",
                color: "black"
            }
        ).setOrigin(0.5)
        .setDepth(2)
        .on('textchange', inputText => {
            inputName = inputText.text;
        });

        inputText.setStyle("border-radius", "10px");
        inputText.setStyle("text-align", "center");

        let inputButton = this.add.sprite(
            this.game.config.width/2,
            this.game.config.height/2 + 50,
            'okButton',
        ).setOrigin(0.5)
        .setScale(0.07)
        .setDepth(2)
        .setInteractive();

        inputButton.on('pointerover', () => {
            inputButton.setScale(0.08);
            this.sound.play('hoverEffect', {loop: false});
        });

        inputButton.on('pointerout', () => {
            inputButton.setScale(0.07);
        });

        inputButton.on('pointerup', () => {
            inputButton.setAlpha(1);
        });

        inputButton.on('pointerdown', () => {
            inputButton.setAlpha(0.7);
            this.sound.play('clickEffect', {loop: false});
            this.player.playerInfo.name = inputName;
            this.dialogue = tutorialDialogue(this.player.playerInfo.name);

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

    createSpeechBubble (x, y, width, height, quote)
        {
            var bubbleWidth = width;
            var bubbleHeight = height;
            var bubblePadding = 10;
            var arrowHeight = bubbleHeight / 4;

            var bubble = this.add.graphics({ x: x, y: y });

            this.messageBoxContainer = this.add.container();
            //  Bubble shadow
            bubble.fillStyle(0x222222, 0.5);
            bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

            //  Bubble color
            bubble.fillStyle(0xffffff, 1);

            //  Bubble outline line style
            bubble.lineStyle(4, 0x565656, 1);

            //  Bubble shape and outline
            bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
            bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

            //  Calculate arrow coordinates
            var point1X = Math.floor(bubbleWidth / 7);
            var point1Y = bubbleHeight;
            var point2X = Math.floor((bubbleWidth / 7) * 2);
            var point2Y = bubbleHeight;
            var point3X = Math.floor(bubbleWidth / 7);
            var point3Y = Math.floor(bubbleHeight + arrowHeight);

            //  Bubble arrow shadow
            bubble.lineStyle(4, 0x222222, 0.5);
            bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

            //  Bubble arrow fill
            bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
            bubble.lineStyle(2, 0x565656, 1);
            bubble.lineBetween(point2X, point2Y, point3X, point3Y);
            bubble.lineBetween(point1X, point1Y, point3X, point3Y);

            var content = this.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });

            var b = content.getBounds();

            content.setPosition(bubble.x + (bubbleWidth / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));

            this.messageBoxContainer.add([bubble,content]);
        }

    
    animationSceneHandler(spriteImage, sceneAnimation){
        spriteImage.play(sceneAnimation)
    }

    
    getDifferenceInDays(date1, date2) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / (1000 * 60 * 60 * 24);
    }

   getDifferenceInMinutes(date1, date2) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / (1000 * 60);
    }
}

export default BaseScene;