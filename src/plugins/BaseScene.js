import 'regenerator-runtime/runtime'
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import Phaser from 'phaser';
import { tutorialDialogue } from '../js/character_dialogues/tutorial';
import { Slider } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

class BaseScene extends Phaser.Scene {
    init(data){
        this.data = data;       
        this.dialogueCounter = 0;
        this.toggleSettings = false;
        this.hoverSound = this.sound.add('hoverEffect', {loop: false});
    }

    formPopUp(title, content, titleSize){
        content.setDepth(25);
        this.formPopupContainer = this.add.group().setDepth(15);

        let popupBg = this.add.rectangle(0,0, this.game.config.width, this.game.config.height, 0x000000, 0.7)
            .setOrigin(0)
            .setInteractive();

        let popupBody = this.add.rexRoundRectangle(
            this.game.config.width/2,
            this.game.config.height/2,
            260,
            250,
            5,
            0x000000,1
        ).setScale(1.3).setStrokeStyle(1, 0xffffff, 1).setInteractive();

        let popupTitle = this.add.text(
            popupBody.x,
            popupBody.y - popupBody.displayHeight*0.4,
            title, {fontFamily:'Arial', color: 'white', fontSize: titleSize || '20px', fontStyle: 'Bold'})
        .setOrigin(0.5).setScale(1.3);

        this.formPopupContainer.addMultiple([popupBg, popupBody, popupTitle].concat(content.getChildren()));


        popupBg.on('pointerdown', () => {
            this.formPopupContainer.destroy(true);
        });
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
            this.popupContainer.destroy(true);
        });
    }

    settingsBox(x,y,width,height, bodyPaddingX, bodyPaddingY, goldDisplay, gemDisplay){

        this.settingsContainer = this.add.container(this.game.config.width, 0);

        let settingsBody = this.add.rectangle(x-bodyPaddingX ,y + bodyPaddingY,width,height,0x000000, 1).setOrigin(1,0).setInteractive();       
        let exitIcon = this.add.sprite(settingsBody.x - 25, settingsBody.y + 25, 'exitIcon').setOrigin(1,0).setScale(0.5).setInteractive();
        let settingsTitle = this.add.text(settingsBody.x - settingsBody.width + 25, exitIcon.y+ exitIcon.displayWidth/2 , 'Settings').setOrigin(0, 0.5);
        settingsTitle.setFont({fontFamily : 'Arial', fontsize: '20px', fontStyle: 'Bold'});

        let line = this.add.rectangle(settingsTitle.x, exitIcon.y + exitIcon.displayWidth + 5, settingsBody.displayWidth - 50, 1, 0xffffff,1).setOrigin(0);

        let icons = [ 'couponIcon', 'mailIcon', 'twitterIcon', 'youtubeIcon','creditsIcon', 'logoutIcon'];
        let iconText = ['Coupon', 'Inquiry','Twitter', 'Youtube', 'Credits', 'Logout'];
        let iconGroup = this.add.group();

        let iconData = [];
        let iconTextData = [];

        this.optionSound = this.sound.add('optionSound', {volume:0.2})

        exitIcon.on('pointerover', () => {exitIcon.setAlpha(0.7); this.optionSound.play();});
        exitIcon.on('pointerout', () => exitIcon.setAlpha(1));

        exitIcon.on('pointerdown', () => this.toggleSettingsBox());

        icons.forEach((icon, index) => {
            iconData[index] = this.add.sprite(settingsBody.x, settingsBody.y, icon).setScale(0.5).setOrigin(0.5,1).setInteractive().setName(icon);

            iconData[index].on('pointerover', () => {iconData[index].setAlpha(0.7); this.optionSound.play();});
            iconData[index].on('pointerout', () => iconData[index].setAlpha(1));

            iconData[index].on('pointerdown', () => {
                if(iconData[index].name == 'twitterIcon'){
                    this.openExternalLink('https://twitter.com/cryptmonogatari');
                }
                else if(iconData[index].name == 'youtubeIcon'){
                    this.openExternalLink('https://www.youtube.com/channel/UCfokLXSHMW4pHf7yueprKYg');
                }
                else if(iconData[index].name == 'mailIcon'){
                    this.openExternalLink('mailto:flipflashdev@gmail.com');
                }
                else if(iconData[index].name == 'creditsIcon'){
                    this.scene.start('credits');
                }
                else if(iconData[index].name == 'logoutIcon'){
                    this.sound.stopByKey('titleBgMusic');
                    this.sound.play('titleBgMusic', {loop: true, volume:0.2});
                    this.player.playerInfo = {
                        name: '',
                        address: null,
                        drawCount: 0,
                        gold: 0,
                        gems: 0,
                        level: 1,
                        role: "Adventurer",
                        dateJoined: null,
                        lastLogin: new Date(),
                        lastSpin: null,
                        lastReward: null,
                        isFirstTime: true,
                        lastRead: 0,
                        cards:[],
                        couponCodes:[]
                    }
                    this.scene.start("titlescreen");
                }
                else{
                    this.toggleSettingsBox();

                    let couponCode ='';

                    const couponGroup = this.add.group();
                    const couponInput = this.add.rexInputText(
                        this.game.config.width/2,
                        this.game.config.height/2 - 30,
                        200,
                        30,
                        { 
                            type: "text",
                            maxLength: 15,
                            fontSize : "18px",
                            fontFamily: 'Arial',
                            minLength: 3,
                            backgroundColor : "white",
                            color: "black"
                        }
                    ).setOrigin(0.5).setScale(0,1.3)
                    .on('textchange', inputText => {
                        couponCode = inputText.text;
                    });

                    const confirmButton = this.add.sprite(this.game.config.width/2,this.game.config.height/2 + 35,'confirmButton')
                        .setOrigin(0.5).setInteractive().setScale(0,1.3);


                    couponInput.setStyle("border-radius", "10px");
                    couponInput.setStyle("text-align", "center");

                    couponGroup.addMultiple([couponInput,confirmButton]);

                    confirmButton.on("pointerdown", async() => {
                        this.popupContainer.destroy(true);

                        try{
                            //GET DATA FROM FIREBASE
                            const couponRef = doc(this.player.db, "rewards", 'coupon');
                            const coupons = await getDoc(couponRef);

                            let codeFromFirebase = coupons.data().claim;

                            let rewardToClaim = codeFromFirebase.filter(data => data.code === couponCode);                        
                   
                            let content = this.add.text( this.game.config.width/2, this.game.config.height/2, '',{fontFamily: 'Arial', color:'#613e1e', fontSize:12, align: 'justify' })
                                .setOrigin(0.5,0.75).setWordWrapWidth(250).setScale(0,1.3);

                            if(this.player.playerInfo.couponCodes.includes(couponCode)){
                                let recievedAlreadyCouponGroup = this.add.group();
                                content.setText('You already received the reward from this coupon code. You can only received 1 gift per coupon')
                                recievedAlreadyCouponGroup.add(content);

                                this.popUp('Coupon already claimed', recievedAlreadyCouponGroup);
                            }
                            else if(rewardToClaim[0]){
                                let rewardCouponGroup = this.add.group();

                                let rewardBox = this.add.rectangle(
                                    this.game.config.width/2,
                                    this.game.config.height/2 - 10,
                                    60,
                                    60,
                                    0x9b6330
                                ).setOrigin(0.5).setScale(0,1.3);

                                let rewardIcon = this.add.sprite(
                                    this.game.config.width/2,
                                    this.game.config.height/2 - 10,
                                    rewardToClaim[0].reward.item
                                ).setOrigin(0.5).setScale(0,1.3);

                                let rewardText = this.add.text(
                                    rewardBox.x,
                                    rewardBox.y + rewardBox.width/2 + 25, 
                                    rewardToClaim[0].reward.value,
                                    {fontFamily: 'Arial', color:'#613e1e', fontStyle: 'Bold'} 
                                ).setOrigin(0.5).setScale(0,1.3);


                                //Save to firebase before setting to player locally  
                                try{
                                    rewardCouponGroup.addMultiple([rewardBox, rewardIcon, rewardText]);

                                    let updatedValue = this.player.playerInfo[rewardToClaim[0].reward.item] + rewardToClaim[0].reward.value;

                                    if(rewardToClaim[0].reward.item === "gold"){
                                        await updateDoc(doc(this.player.users, this.player.playerInfo.address), {gold: updatedValue});
                                        goldDisplay.setText(updatedValue);
                                    }
                                    else{
                                         await updateDoc(doc(this.player.users, this.player.playerInfo.address), {gems: updatedValue});
                                        gemDisplay.setText(updatedValue);
                                    }

                                    this.player.playerInfo[rewardToClaim[0].reward.item] = updatedValue;

                                    this.player.playerInfo.couponCodes.push(rewardToClaim[0].code);
                                    await updateDoc(doc(this.player.users, this.player.playerInfo.address), {couponCodes: this.player.playerInfo.couponCodes});


                                    this.popUp('Reward Claimed', rewardCouponGroup);
                                    }
                                catch(e){
                                    console.log('Error: ', e.message);
                                }                          
                            }
                            else{
                                let wrongCouponGroup = this.add.group();
                                content.setText('The coupon code that you entered does not exist. Please check your spelling then try again.');
                                wrongCouponGroup.add(content);

                                this.popUp('Wrong Coupon', wrongCouponGroup);
                            }
                        }
                        catch(e){
                            console.log(e.message);
                        }
                    })

                    this.popUp('Enter Coupon Code', couponGroup);
                }
            });
        })

        iconGroup.addMultiple(iconData);
        
        let gridTable = Phaser.Actions.GridAlign(iconGroup.getChildren(), {
            width: 4,
            height: 2,
            cellWidth: iconData[0].width/2 + 25,
            cellHeight: iconData[0].height/2 + 40,
            x: settingsBody.x - settingsBody.displayWidth + 37,
            y: settingsBody.y + settingsBody.displayHeight/2
        });

        gridTable.forEach((sprite,index) => {
            iconTextData[index] = this.add.text(sprite.x, sprite.y + 6, iconText[index], {fontFamily: 'Arial', fontSize: '12px'}).setOrigin(0.5);
        })


        let audioIcon = this.add.sprite(settingsTitle.x, (exitIcon.y + gridTable[0].y)/2, 'volumeIcon').setOrigin(0,0.5).setScale(0.8);

        let bgSound = this.sound.get('titleBgMusic');

        let slider = new Slider(this, {
            x: settingsTitle.x + audioIcon.displayWidth + 115,
            y: audioIcon.y,
            width: 210,
            height: 5,
            orientation: 'x',

            track: this.add.rectangle(0,0,200,5,0xffffff,1).setOrigin(0,0.5),
            indicator: this.add.rectangle(0,0,200,5,0x005500,1).setOrigin(0,0.5),
            thumb: this.add.circle(0, 0, 10, 0xffffff, 1),
            value: bgSound.volume,
            valuechangeCallback: value => {
                bgSound.setVolume(value);
                this.optionSound.volume = value;

                let hoverValue = value * 5;
                this.hoverSound.volume = hoverValue < 1? hoverValue : 1;
            },
            input: 'drag',
        }).layout();
        this.add.existing(slider);

        let track = slider.getElement('track');
        let indicator = slider.getElement('indicator');
        let action = slider.getElement('thumb');

        this.settingsContainer.add([settingsBody, settingsTitle, exitIcon, line, audioIcon, track, indicator, action]);
        this.settingsContainer.add(iconGroup.getChildren());
        this.settingsContainer.add(iconTextData);
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

    openExternalLink (url) {
        var s = window.open(url, '_blank');

        if (s && s.focus)
        {
            s.focus();
        }
        else if (!s)
        {
            window.location.href = url;
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
            this.hoverSound.play();
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