import 'regenerator-runtime/runtime'
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Phaser from 'phaser';
import { playerInitData } from '../js/playerInitData';
import { Slider } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { getSoundSettings, shortenLargeNumber, openExternalLink } from '../js/utils';

export default class Settings extends Phaser.Scene{
	constructor(scene){
		super(scene);
        this.scene = scene;

        this.gameW = this.scene.game.config.width;
        this.gameH = this.scene.game.config.height;
        this.paddingX = this.gameW * 0.025;
        this.toggleSettings = false;
    }

    generate(x,y,width,height, bodyPaddingX, bodyPaddingY, goldDisplay, gemDisplay){

        this.settingsContainer = this.scene.add.container(this.gameW, 0);

        let settingsBody = this.scene.add.rectangle(x-bodyPaddingX ,y + bodyPaddingY,width,height,0x000000, 1).setOrigin(1,0).setInteractive();       
        let exitIcon = this.scene.add.sprite(settingsBody.x - 25, settingsBody.y + 25, 'exitIcon').setOrigin(1,0).setScale(0.5).setInteractive();
        let settingsTitle = this.scene.add.text(settingsBody.x - settingsBody.width + 25, exitIcon.y+ exitIcon.displayWidth/2 , 'Settings').setOrigin(0, 0.5);
        settingsTitle.setFont({fontFamily : 'Arial', fontsize: '20px', fontStyle: 'Bold'});

        let line = this.scene.add.rectangle(settingsTitle.x, exitIcon.y + exitIcon.displayWidth + 5, settingsBody.displayWidth - 50, 1, 0xffffff,1).setOrigin(0);

        let icons = [ 'couponIcon', 'mailIcon', 'twitterIcon', 'youtubeIcon','creditsIcon', 'logoutIcon'];
        let iconText = ['Coupon', 'Inquiry','Twitter', 'Youtube', 'Credits', 'Logout'];
        let iconGroup = this.scene.add.group();

        let iconData = [];
        let iconTextData = [];

        this.optionSound = this.scene.sound.add('optionSound', {volume: getSoundSettings('optionSound')})

        exitIcon.on('pointerover', () => {exitIcon.setAlpha(0.7); this.optionSound.play();});
        exitIcon.on('pointerout', () => exitIcon.setAlpha(1));

        exitIcon.on('pointerdown', () => this.toggleSettingsBox());

        icons.forEach((icon, index) => {
            iconData[index] = this.scene.add.sprite(settingsBody.x, settingsBody.y, icon).setScale(0.5).setOrigin(0.5,1).setInteractive().setName(icon);

            iconData[index].on('pointerover', () => {iconData[index].setAlpha(0.7); this.optionSound.play();});
            iconData[index].on('pointerout', () => iconData[index].setAlpha(1));

            iconData[index].on('pointerdown', () => {
                if(iconData[index].name == 'twitterIcon'){
                    openExternalLink('https://twitter.com/cryptmonogatari');
                }
                else if(iconData[index].name == 'youtubeIcon'){
                    openExternalLink('https://www.youtube.com/channel/UCfokLXSHMW4pHf7yueprKYg');
                }
                else if(iconData[index].name == 'mailIcon'){
                    openExternalLink('mailto:flipflashdev@gmail.com');
                }
                else if(iconData[index].name == 'creditsIcon'){
                    this.scene.scene.start('credits');
                }
                else if(iconData[index].name == 'logoutIcon'){
                    this.scene.player.playerInfo = playerInitData;
                    this.scene.scene.start("titlescreen");
                }
                else{
                    this.toggleSettingsBox();

                    let couponCode ='';

                    const couponGroup = this.scene.add.group();
                    const couponInput = this.scene.add.rexInputText(this.gameW/2, this.gameH/2 - 30, 200, 30,
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

                    const confirmButton = this.scene.add.sprite(this.gameW/2,this.gameH/2 + 35,'confirmButton')
                        .setOrigin(0.5).setInteractive().setScale(0,1.3);

                    couponInput.setStyle("border-radius", "10px");
                    couponInput.setStyle("text-align", "center");

                    couponGroup.addMultiple([couponInput,confirmButton]);

                    confirmButton.on("pointerdown", async() => {
                        this.scene.popupContainer.destroy(true);

                        try{
                            //GET DATA FROM FIREBASE
                            const couponRef = doc(this.scene.player.db, "rewards", 'coupon');
                            const coupons = await getDoc(couponRef);

                            let codeFromFirebase = coupons.data().claim;

                            let rewardToClaim = codeFromFirebase.filter(data => data.code === couponCode);                        
                   
                            let content = this.scene.add.text( this.gameW/2, this.gameH/2, '',{fontFamily: 'Arial', color:'#613e1e', fontSize:12, align: 'justify' })
                                .setOrigin(0.5,0.75).setWordWrapWidth(250).setScale(0,1.3);

                            if(this.scene.player.playerInfo.couponCodes.includes(couponCode)){
                                let recievedAlreadyCouponGroup = this.scene.add.group();
                                content.setText('You already received the reward from this coupon code. You can only received 1 gift per coupon')
                                recievedAlreadyCouponGroup.add(content);

                                this.scene.popUp('Coupon already claimed', recievedAlreadyCouponGroup);
                            }
                            else if(rewardToClaim[0]){
                                let rewardCouponGroup = this.scene.add.group();

                                let rewardBox = this.scene.add.rectangle( this.gameW/2, this.gameH/2 - 10, 60, 60, 0x9b6330 ).setOrigin(0.5).setScale(0,1.3);

                                let rewardIcon = this.scene.add.sprite( this.gameW/2, this.gameH/2 - 10, rewardToClaim[0].reward.item).setOrigin(0.5).setScale(0,1.3);

                                let rewardText = this.scene.add.text( rewardBox.x, rewardBox.y + rewardBox.width/2 + 25, rewardToClaim[0].reward.value,
                                    {fontFamily: 'Arial', color:'#613e1e', fontStyle: 'Bold'} 
                                ).setOrigin(0.5).setScale(0,1.3);

                                //Save to firebase before setting to player locally  
                                try{
                                    rewardCouponGroup.addMultiple([rewardBox, rewardIcon, rewardText]);

                                    let updatedValue = this.scene.player.playerInfo[rewardToClaim[0].reward.item] + rewardToClaim[0].reward.value;

                                    if(rewardToClaim[0].reward.item === "gold"){
                                        await updateDoc(doc(this.scene.player.users, this.scene.player.playerInfo.address), {gold: updatedValue});
                                        goldDisplay.setText(shortenLargeNumber(updatedValue,2));
                                    }
                                    else{
                                         await updateDoc(doc(this.scene.player.users, this.scene.player.playerInfo.address), {gems: updatedValue});
                                        gemDisplay.setText(shortenLargeNumber(updatedValue,2));
                                    }

                                    this.scene.player.playerInfo[rewardToClaim[0].reward.item] = updatedValue;

                                    this.scene.player.playerInfo.couponCodes.push(rewardToClaim[0].code);
                                    await updateDoc(doc(this.scene.player.users, this.scene.player.playerInfo.address), {couponCodes: this.scene.player.playerInfo.couponCodes});

                                    this.scene.popUp('Reward Claimed', rewardCouponGroup);
                                    }
                                catch(e){
                                    console.log('Error: ', e.message);
                                }                          
                            }
                            else{
                                let wrongCouponGroup = this.scene.add.group();
                                content.setText('The coupon code that you entered does not exist. Please check your spelling then try again.');
                                wrongCouponGroup.add(content);

                                this.scene.popUp('Wrong Coupon', wrongCouponGroup);
                            }
                        }
                        catch(e){
                            console.log(e.message);
                        }
                    })

                    this.scene.popUp('Enter Coupon Code', couponGroup);
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
            iconTextData[index] = this.scene.add.text(sprite.x, sprite.y + 6, iconText[index], {fontFamily: 'Arial', fontSize: '12px'}).setOrigin(0.5);
        })

        let audioIcon = this.scene.add.sprite(settingsTitle.x, (exitIcon.y + gridTable[0].y)/2, 'volumeIcon').setOrigin(0,0.5).setScale(0.8);

        let bgSound = this.scene.sound.get('titleBgMusic');

        let slider = new Slider(this.scene, {
            x: settingsTitle.x + audioIcon.displayWidth + 115,
            y: audioIcon.y,
            width: 210,
            height: 5,
            orientation: 'x',
            track: this.scene.add.rectangle(0,0,200,5,0xffffff,1).setOrigin(0,0.5),
            indicator: this.scene.add.rectangle(0,0,200,5,0x005500,1).setOrigin(0,0.5),
            thumb: this.scene.add.circle(0, 0, 10, 0xffffff, 1),
            value: getSoundSettings('titleBgMusic'),
            valuechangeCallback: value => {
                bgSound.setVolume(value);
                this.optionSound.volume = value;

                let hoverValue = value * 5;
                this.scene.hoverSound.volume = hoverValue < 1? hoverValue : 1;

                localStorage.setItem("titleBgMusic", value);
                localStorage.setItem("optionSound", value);
                localStorage.setItem("spinWheelSound", value < 1? value * 2 : 1 );
                localStorage.setItem("hoverEffect", hoverValue < 1? hoverValue : 1);
                localStorage.setItem("clickEffect", hoverValue < 1? hoverValue : 1);

            },
            input: 'drag',
        }).layout();
        this.scene.add.existing(slider);

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
           this.scene.tweens.add({
                targets: this.settingsContainer,
                x: { value: 0, duration: 600, ease: 'Power1'},
                yoyo: false, 
            }); 
        }
        else {
             this.scene.tweens.add({
                targets: this.settingsContainer,
                x: { value: this.gameW, duration: 600, ease: 'Power1'},
                yoyo: false, 
            });          
        }
    }
}