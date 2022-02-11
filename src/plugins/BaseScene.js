import 'regenerator-runtime/runtime'
import Phaser from 'phaser';
import { getSoundSettings } from '../js/utils';

class BaseScene extends Phaser.Scene {
    init(){     
        this.gameW = this.game.config.width;
        this.gameH = this.game.config.height;
        this.paddingX = this.gameW * 0.025;
        this.hoverSound = this.sound.add('hoverEffect', {loop: false, volume: getSoundSettings('hoverEffect')});
    }

    generateBg(withBushes){
        this.add.tileSprite(-100,0,2133, this.game.config.height,'forest_layer_0').setOrigin(0).setScrollFactor(0, 1).setFlipX(true).setScale(1.1);
        this.add.tileSprite(-100,0,2133, this.game.config.height,'forest_layer_1').setOrigin(0).setScrollFactor(0, 1).setFlipX(true).setScale(1.1);
        this.add.tileSprite(-100,0,2133, this.game.config.height,'forest_layer_2').setOrigin(0).setScrollFactor(0, 1).setFlipX(true).setScale(1.1);
        this.add.tileSprite(-50,0,2133, this.game.config.height,'forest_layer_3').setOrigin(0).setScrollFactor(0, 1).setFlipX(true).setScale(1.1);
        this.add.tileSprite(-100,0,2133, this.game.config.height,'forest_layer_4').setOrigin(0).setScrollFactor(0, 1).setFlipX(true);
            
        if(withBushes){
            this.add.tileSprite(-100,0,2133, this.game.config.height,'forest_layer_5').setOrigin(0).setScrollFactor(0, 1).setFlipX(true);
        }
    }

    formPopUp(title, content, titleSize, width, height, inputParams){
        content.setDepth(25);
        this.formPopupContainer = this.add.group().setDepth(15);

        let popupBg = this.add.rectangle(0,0, this.gameW, this.gameH, 0x000000, 0.7).setOrigin(0).setDepth(12).setInteractive();

        let popupBody = this.add.rexRoundRectangle(this.gameW/2, this.gameH/2, width || 260, height || 250, 5, 0x000000, 1)
            .setDepth(12).setScale(1.3).setStrokeStyle(1, 0xffffff, 1).setInteractive();

        let popupTitle = this.add.text(popupBody.x, popupBody.y - popupBody.displayHeight*0.4, title,
            {fontFamily:'Arial', color: 'white', fontSize: titleSize || '20px', fontStyle: 'Bold'}
        ).setDepth(12).setOrigin(0.5).setScale(1.3);

        this.formPopupContainer.addMultiple([popupBg, popupBody, popupTitle].concat(content.getChildren()));

        popupBg.on('pointerdown', () => {
            if(inputParams){
                inputParams.setAlpha(1);
            }
            this.formPopupContainer.destroy(true);
        });
    }

    popUp(title, content, titleSize, inputParams, notDestroyable){
        content.setDepth(25);
        this.popupContainer = this.add.group().setDepth(15);

        let popupBg = this.add.rectangle(0,0, this.gameW, this.gameH, 0x000000, 0.7).setOrigin(0).setInteractive();

        let popupBody = this.add.sprite(this.gameW/2, this.gameH/2,'scroll').setScale(0,1.3);

        let popupTitle = this.add.text(popupBody.x, popupBody.y - popupBody.height*0.4, title,
            {fontFamily:'GameTextFont', color: '#613e1e', fontSize: titleSize || '20px'} 
         ).setOrigin(0.5).setScale(0,1.3);

        this.popupContainer.addMultiple([popupBg, popupBody, popupTitle].concat(content.getChildren()));

        this.tweens.add({
            targets: this.popupContainer.getChildren(),
            scaleX: { value: 1.3, duration: 250, ease: 'easeIn'},
            scaleY: { value: 1.3, duration: 250, ease: 'easeIn'},
            yoyo: false
        });

        popupBg.on('pointerdown', () => {
            if(inputParams){
                inputParams.setAlpha(1);
            }

            if(!notDestroyable){
                this.popupContainer.destroy(true);
            }
        });
    }

    popUpAlert(title, description, inputParams){
        //Pop up for error messages and alerts
        let alertGroup = this.add.group();

        let descriptionText = this.add.text( this.gameW/2,  this.gameH/2 - 50, description,
            {fontFamily: 'Arial', color: '#613e1e', align: 'justify'}
        ).setOrigin(0.5,0).setWordWrapWidth(230).setScale(0,1.3);

        let okButton = this.add.sprite( descriptionText.x, descriptionText.y + 100, 'confirmButtonAlt').setOrigin(0.5).setInteractive().setScale(0,1.3);

        okButton.on("pointerdown", () => {
            if(inputParams){
                inputParams.setAlpha(1);
            }
            this.sound.play('clickEffect', {loop: false, volume: getSoundSettings('clickEffect')});
            this.popupContainer.destroy(true);
        });

        alertGroup.addMultiple([descriptionText, okButton]);
        this.popUp(title, alertGroup, null, inputParams);
    }

    proceedToMainPage(button){
        button.on('pointerup', () => {
            this.scene.start("game");
        });
    }

    typewriteText(text){
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

    typewriteTextWrapped(text){
        const lines = this.messageText? this.messageText.getWrappedText(text): '';
        const wrappedText = lines.join('\n')

        this.typewriteText(wrappedText)
    }

    createSpeechBubble (x, y, width, height, quote){
        let bubbleWidth = width;
        let bubbleHeight = height;
        let bubblePadding = 10;
        let arrowHeight = bubbleHeight / 4;

        let bubble = this.add.graphics({ x: x, y: y });

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
        let point1X = Math.floor(bubbleWidth / 7);
        let point1Y = bubbleHeight;
        let point2X = Math.floor((bubbleWidth / 7) * 2);
        let point2Y = bubbleHeight;
        let point3X = Math.floor(bubbleWidth / 7);
        let point3Y = Math.floor(bubbleHeight + arrowHeight);

        //  Bubble arrow shadow
        bubble.lineStyle(4, 0x222222, 0.5);
        bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

        //  Bubble arrow fill
        bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
        bubble.lineStyle(2, 0x565656, 1);
        bubble.lineBetween(point2X, point2Y, point3X, point3Y);
        bubble.lineBetween(point1X, point1Y, point3X, point3Y);

        let content = this.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });

        let b = content.getBounds();

        content.setPosition(bubble.x + (bubbleWidth / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));

        this.messageBoxContainer.add([bubble,content]);
    }
}

export default BaseScene;