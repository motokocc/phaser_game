import 'regenerator-runtime/runtime'
import { lilithDialogue } from '../js/character_dialogues/lilith_mainscreen_dialogue';
import { doc, setDoc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import BaseScene from '../plugins/BaseScene';
import { TextArea } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

class Game extends BaseScene {
    preload(){
        this.firebaseMessages = {messages: []};
    }

   create(){
        this.anims.create({
            key: 'elf_idle_main',
            frames: [
                { key: 'elf_idle_2' },
                { key: 'elf_idle_1' }
            ],
            frameRate: 8,
            repeatDelay: 2500,
            repeat: -1
        });

        this.anims.create({
            key: 'elf_talk_main',
            frames: [
                { key: 'elf_idle_2' },
                { key: 'elf_happy_2' },
            ],
            repeat: 7,
            frameRate: 8,
        });

        this.gameBg = this.add.image(0,0,'background');
        this.gameBg.setOrigin(0,0);
        this.gameBg.setScale(1.1);
        const paddingY = this.gameH * 0.033;
        const buttonScale = this.gameW * 0.00078;

        //NPC - Lilith
        let npc_lilith = this.add.sprite(this.gameW/2, this.gameH + 3, 'elf-0')
        .setOrigin(0.5,1)
        .setScale(0.000928 * this.gameW)
        .setInteractive();

        npc_lilith.playReverse('elf_idle_main');

        npc_lilith.on('pointerdown', () => {
            let randomMessage = Math.floor(Math.random()* lilithDialogue.length);
            this.npcTalk(npc_lilith, lilithDialogue[randomMessage],'elf_talk_main','elf_idle_main',npc_lilith.x + npc_lilith.width/4, this.gameH/2 - (npc_lilith.width/2));
        });

        //Right side buttons
        let rightButtons = this.add.container(200,0);
        const shop_button = this.add.sprite(this.gameW - (this.paddingX*2.8), this.gameH*0.21 + paddingY, 'shop_button').setOrigin(0.5).setName('shop');
        const pvp_button = this.add.sprite(this.gameW -(this.paddingX*2.8), this.gameH*0.42 + paddingY, 'pvp_button').setOrigin(0.5).setName('pvp');
        const mining_button = this.add.sprite(this.gameW - (this.paddingX*2.8), this.gameH*0.63 + paddingY, 'mining_button').setOrigin(0.5).setName('mining');
        const explore_button = this.add.sprite(this.gameW - (this.paddingX*2.8), this.gameH*0.84 + paddingY, 'explore_button').setOrigin(0.5).setName('explore');

        //Left side buttons
        let leftButtons = this.add.container(-250,0);
        const roullete_button = this.add.sprite(this.paddingX, this.gameH*0.23, 'roullete_button').setOrigin(0,0.5).setName('roullete');
        const black_market_button = this.add.sprite(this.paddingX, this.gameH*0.37, 'black_market_button').setOrigin(0,0.5).setName('marketplace');  
        const missions_button = this.add.sprite(this.paddingX, this.gameH*0.51, 'missions_button').setOrigin(0,0.5).setName('missions');
        const summon_button = this.add.sprite(this.paddingX, this.gameH*0.65, 'summon_button').setOrigin(0,0.5).setName('summoningArea');

        // Left Notifications
        this.roullete_notif = this.add.circle(roullete_button.displayWidth - this.paddingX/2, roullete_button.y - roullete_button.displayHeight/3, 10, 0xff0000, 1);
        this.roullete_notif.setAlpha(0);

        //Upper Right Icons
        const settings_button = this.add.sprite(this.gameW - (this.paddingX*2), this.gameH*0.07,'settings_button').setOrigin(0.5).setName('settings');
        const gift_button = this.add.sprite(settings_button.x - (this.paddingX*2.5), this.gameH*0.07,'gift_button').setOrigin(0.5).setName('gift');
        const mail_button = this.add.sprite(gift_button.x - (this.paddingX*2.5), this.gameH*0.07,'mail_button').setOrigin(0.5).setName('mail');

        this.gift_notif = this.add.circle(gift_button.x + this.paddingX*0.9, gift_button.y - this.paddingX*0.8, 8, 0xff0000, 1);
        this.gift_notif.setAlpha(0);
        this.mail_notif = this.add.circle(mail_button.x + this.paddingX*0.9, mail_button.y - this.paddingX*0.8, 8, 0xff0000, 1);
        this.mail_notif.setAlpha(0);

        settings_button.setScale(0.1).setAlpha(0);
        gift_button.setScale(0.1).setAlpha(0);
        mail_button.setScale(0.1).setAlpha(0);

        //Player Stat GUI
        let playerUI = this.add.container(0,-200);
        const player_gui_box = this.add.sprite(this.paddingX, this.gameH*0.07,'player_gui_box').setOrigin(0, 0.5).setScale(buttonScale).setInteractive();
        const player_name = this.add.text(
            player_gui_box.x* 3.6,
            player_gui_box.y - this.paddingX*0.33,
            this.player.playerInfo.name || 'Player',
            {fontFamily: 'Arial', fontSize:14}
        ).setOrigin(0, 0.5);

        const player_role = this.add.text(
            player_gui_box.x* 3.6,
            player_gui_box.y + this.paddingX*0.33,
            this.player.playerInfo.role || 'Adventurer',
            {fontFamily: 'Arial', fontSize:13, color: '#00ff00'}
        ).setOrigin(0, 0.5);

        const player_level = this.add.text(
            player_gui_box.x* 2.2,
            player_gui_box.y + this.paddingX*0.1,
            ['Lvl', this.player.playerInfo.level] || ['Lvl', 1],
            {fontFamily: 'Arial', fontSize:13, align: 'center'}
        ).setOrigin(0.5);

        //Gems
        let gems = this.add.container();
        const gem_icon = this.add.sprite(this.gameW/2 - this.paddingX*3, this.gameH*0.07,'gems').setOrigin(0.5).setDepth(2);
        const gem_box = this.add.rexRoundRectangle(gem_icon.x, gem_icon.y, this.paddingX*4, this.paddingX, this.paddingX/5, 0x000000).setOrigin(0,0.5).setAlpha(0.6);
        const gem_value = this.add.text(gem_box.x + gem_box.width/2, gem_box.y, this.player.playerInfo.gems || 0, {fontFamily: 'Arial'}).setOrigin(0.5);

        //Gold
        let gold = this.add.container();
        const gold_icon = this.add.sprite(this.gameW/2 + this.paddingX*3, this.gameH*0.07,'gold').setOrigin(0.5).setDepth(2);
        const gold_box = this.add.rexRoundRectangle(gold_icon.x, gem_icon.y, this.paddingX*4, this.paddingX, this.paddingX/5, 0x000000).setOrigin(0,0.5).setAlpha(0.6);
        const gold_value = this.add.text(gold_box.x + gold_box.width/2, gold_box.y, this.player.playerInfo.gold || 0, {fontFamily: 'Arial'}).setOrigin(0.5);

        let currencyUI = this.add.container(0,-200);

        //Settings Box
        this.settingsBox(this.gameW, 0, 300, this.gameH/2 + this.paddingX , this.paddingX*0.95, this.paddingX*3, gold_value, gem_value);

        //UI Containers/Groups
        gems.add([gem_box, gem_icon, gem_value]);
        gold.add([gold_box, gold_icon, gold_value]);
        currencyUI.add([gold, gems]);
        playerUI.add([player_gui_box, player_name, player_role, player_level]);
        rightButtons.add([shop_button, pvp_button, mining_button, explore_button]);
        leftButtons.add([roullete_button, black_market_button, missions_button, summon_button, this.roullete_notif]);

        //UI Animations
        this.tweens.add({
            targets: [leftButtons, rightButtons, playerUI, currencyUI],
            x: { value: 0, duration: 600, ease: 'Power1'},
            y: { value: 0, duration: 600, ease: 'Power1'},
            yoyo: false,
        });

        this.tweens.add({
            targets: settings_button,
            scale: { value: buttonScale, duration: 600, ease: 'Power1'},
            alpha: { value: 1, duration: 600, ease: 'Power1'},
            yoyo: false,
            delay: 800
        });

        this.tweens.add({
            targets: [gift_button],
            scale: { value: buttonScale, duration: 600, ease: 'Power1'},
            alpha: { value: 1, duration: 600, ease: 'Power1'},
            yoyo: false,
            delay:1000,
        });

        this.tweens.add({
            targets: [mail_button],
            scale: { value: buttonScale, duration: 600, ease: 'Power1'},
            alpha: { value: 1, duration: 600, ease: 'Power1'},
            yoyo: false,
            delay:1200
        });

        player_gui_box.on('pointerdown', () => {this.sound.play('clickEffect', {loop: false}); this.scene.start("inventory")});

        const buttons = [
            shop_button, pvp_button, mining_button, explore_button,
            roullete_button, black_market_button, missions_button, summon_button,
            settings_button, gift_button, mail_button,
        ];
    
        buttons.forEach(button => {
            button.setScale(buttonScale).setInteractive();

            button.on('pointerover', () => {
                button.setScale(0.00088*this.gameW);
                this.hoverSound.stop();
                this.hoverSound.play();

                if(button.name == 'roullete'){
                    this.roullete_notif.setPosition(roullete_button.displayWidth + this.paddingX*0.8, roullete_button.y - roullete_button.displayHeight*0.45);
                }
            });

            button.on('pointerout', () => {
                button.setScale(buttonScale);
                if(button.name == 'roullete'){
                    this.roullete_notif.setPosition(roullete_button.displayWidth + this.paddingX*0.8, roullete_button.y - roullete_button.displayHeight*0.4);
                }
            });

            button.on('pointerdown', async() => {
                //Daily Reward
                this.sound.play('clickEffect', {loop: false});
                if(button.name == 'gift'){
                    if(this.getDifferenceInDays(new Date(), this.player.playerInfo.lastReward)> 1 && this.player.playerInfo.address){                       
                        try{
                            button.disableInteractive();
                            const rewardRef = doc(this.player.db, "rewards", 'daily');
                            const rewards = await getDoc(rewardRef);
                            let goldValue = rewards.data().gold || 0;
                            let gemValue = rewards.data().gems || 0;

                            let content = this.add.group();                   
                            const goldBox = this.add.rectangle(this.gameW/2 - 17.5, this.gameH/2-this.paddingX/2, gold_icon.width + this.paddingX/2, gold_icon.width + this.paddingX/2, 0x9b6330).setScale(0,1.3).setOrigin(1,0.5);
                            goldBox.setStrokeStyle(5, 0x613e1e, 1);
                            const gemsBox = this.add.rectangle(this.gameW/2 + 17.5, this.gameH/2-this.paddingX/2, gold_icon.width + this.paddingX/2, gold_icon.width + this.paddingX/2, 0x9b6330).setScale(0,1.3).setOrigin(0,0.5);
                            gemsBox.setStrokeStyle(5, 0x613e1e, 1);
                            const goldReward = this.add.sprite(this.gameW/2 - 25, this.gameH/2-this.paddingX/2,'gold').setScale(0,1.3).setOrigin(1,0.5); 
                            const gemsReward = this.add.sprite(this.gameW/2 + 25, this.gameH/2-this.paddingX/2,'gems').setScale(0,1.3).setOrigin(0,0.5); 
                            const goldCoins = this.add.text(goldBox.x - goldBox.width*0.7 , goldBox.y + goldBox.width, goldValue, {fontFamily: 'Arial', color:'#613e1e', fontStyle: 'Bold'}).setOrigin(0.5);
                            const gemCoins = this.add.text(gemsBox.x + gemsBox.width*0.7 , gemsBox.y + gemsBox.width, gemValue, {fontFamily: 'Arial', color:'#613e1e', fontStyle: 'Bold'}).setOrigin(0.5);

                            content.addMultiple([goldBox, gemsBox, goldReward, gemsReward, goldCoins, gemCoins]);

                            try{
                                this.player.playerInfo.gold = this.player.playerInfo.gold + goldValue;
                                this.player.playerInfo.gems = this.player.playerInfo.gems+ gemValue;
                                gold_value.setText(this.player.playerInfo.gold);
                                gem_value.setText(this.player.playerInfo.gems);

                                this.popUp('Reward Claimed', content);
                                this.player.playerInfo.lastReward = new Date();
                                await updateDoc(doc(this.player.users, this.player.playerInfo.address), {
                                    gold: this.player.playerInfo.gold,
                                    gems: this.player.playerInfo.gems,
                                    lastReward: this.player.playerInfo.lastReward
                                });
                                button.setInteractive();
                            }
                            catch(e){
                                button.setInteractive();
                            }
                        }
                        catch(e){
                            button.setInteractive();                            
                            this.npcTalk(npc_lilith, 'Connection failed. Please try again later.','elf_talk_main','elf_idle_main',npc_lilith.x + npc_lilith.width/4, this.gameH/2 - (npc_lilith.width/2));
                        }
                    }

                    else {
                         this.npcTalk(npc_lilith, 'You can only claim your gift once every 24 hours. Try again later!','elf_talk_main','elf_idle_main',npc_lilith.x + npc_lilith.width/4, this.gameH/2 - (npc_lilith.width/2));
                    }
                }
                //Settings
                else if(button.name == 'settings'){
                    this.toggleSettingsBox();
                }
                //Announcements
                else if(button.name == 'mail'){
                    if(this.player.announcements.id){
                        try{
                            button.disableInteractive();

                            let { title, content, id} = this.player.announcements;

                            let contentContainer = this.add.group();
                            let contentBody = this.add.text(this.gameW/2, this.gameH/2, content, {fontFamily: 'Arial', color:'#613e1e', fontSize:12, align: 'justify' })
                            .setOrigin(0.5).setWordWrapWidth(250).setScale(0,1.3);
                            contentContainer.add(contentBody)

                            this.popUp(title, contentContainer, '15px');

                            if(this.player.playerInfo.lastRead != id){
                                this.player.playerInfo.lastRead = id;
                                await updateDoc(doc(this.player.users, this.player.playerInfo.address),{ lastRead : id });
                            }
                            button.setInteractive();
                        }
                        catch(e){
                            this.npcTalk(npc_lilith, 'Connection failed. Please try again later.','elf_talk_main','elf_idle_main',npc_lilith.x + npc_lilith.width/4, this.gameH/2 - (npc_lilith.width/2));
                            button.setInteractive();                          
                        }
                    }
                    else{
                        this.npcTalk(npc_lilith, 'Connection failed. Please try again later.','elf_talk_main','elf_idle_main',npc_lilith.x + npc_lilith.width/4, this.gameH/2 - (npc_lilith.width/2));
                        button.setInteractive();
                    }
                }
                else if(button.name){
                    this.scene.start(button.name);
                }
            })
        });

        //Chat Box
        this.message = ''; //message of the player
        let chatbox = this.add.container();
        this.chatInput = this.add.rexInputText(
            this.paddingX/2,
            this.gameH - this.paddingX/2,
            this.gameW*0.37 - this.paddingX,
            this.gameW*0.025,
            { 
                type: "text",
                maxLength: 60,
                fontSize : "12px",
                fontFamily: "Arial",
                backgroundColor : "white",
                color: "black",
                placeholder: " Type your message here...",
            }
        ).setOrigin(0,1)
        .on('textchange', inputText => {
            this.message = inputText.text;
        });
        const chatBody = this.add.rectangle(0,this.gameH, this.gameW*0.37, this.gameW*0.17, 0x000000).setOrigin(0,1).setAlpha(0.5);
        let chatMessages = this.add.rexTagText(
                chatBody.x + this.paddingX/2,
                 chatBody.y - chatBody.height + this.paddingX/2,
                '',
                 {
                    fontFamily: 'Arial',
                    fontSize: 12,
                    tags: {
                        playerName: {
                            color: '#00ff00',
                        },
                        admin:{
                            color: "yellow"
                        }
                    }
                }
        ).setWrapMode('char').setWrapWidth(chatBody.width * 0.95);  

        //Text Area
        let textArea = new TextArea(this,{
            x: 0,
            y: this.gameH,
            width: this.gameW*0.37,
            height: this.gameW*0.17,
            background: chatBody,
            text: chatMessages,
            space: {
                left: this.paddingX/2,
                top: this.paddingX/2,
                right: this.paddingX/2,
                bottom: this.chatInput.height + this.paddingX/3
            },
            content: '',
        }).setOrigin(0,1).setDepth(2).layout();
        this.add.existing(textArea);
        //End of Text Area

        const unsub = onSnapshot(doc(this.player.db, "chat", "general"), (doc) => {
                let chatCompilation = '';
                this.firebaseMessages = doc.data().messages? doc.data() : this.firebaseMessages;
                let chatCopy = doc.data().messages?{...this.firebaseMessages}: {};
                
                if(doc.data().messages){
                    let screenMessages = chatCopy.messages.filter(data => this.player.playerInfo.lastLogin.getTime() <= data.date.seconds*1000);
                    if(textArea.linesCount < 9){
                        chatCompilation = `<class='admin'>[admin]</class> : Welcome to Elven Forest <class='playerName'>${this.player.playerInfo.name || 'Adventurer'}</class>!` + '\n';
                    }
                    if(screenMessages.length >= 1){
                        screenMessages.map((chat, index) => {
                            chatCompilation = chatCompilation  + `<class='playerName'>${chat.username}</class> : ${chat.message}` + '\n';
                        })
                    }
                    textArea.setText(chatCompilation);
                    textArea.scrollToBottom();
                }
        });

        let enterKeyboardButton = this.input.keyboard.addKey('Enter');
        enterKeyboardButton.on('down', () => this.sendChat());

        chatbox.add([chatBody, this.chatInput]);
    }

    sendChat(){
        this.hoverSound.play();
        if(this.message){
            const data = {
                username: this.player.playerInfo.name || 'adventurer',
                date: new Date(),
                message : this.message
            }

            if(this.firebaseMessages.messages && this.firebaseMessages.messages.length > 7){                  
                let firebaseMessageCopy = [...this.firebaseMessages.messages];
                const updatedData =  firebaseMessageCopy.filter((data, index) => index >=  this.firebaseMessages.messages.length - 7);
                this.firebaseMessages.messages = updatedData;
            }

            setDoc(doc(this.player.firebaseChatMessages, 'general'),{ messages: [...this.firebaseMessages.messages, data] });
            this.chatInput.text = '';
            this.message = '';
        }
    }

    npcTalk(npc, message, beginAnim, endAnim, x, y){
        if(this.messageBoxContainer){
            this.messageBoxContainer.destroy();
        }
        npc.stop();
        npc.play(beginAnim);
        this.createSpeechBubble (x, y, 220, 100, message);
        npc.on('animationcomplete', () => {
            npc.playReverse(endAnim);
            this.messageBoxContainer.destroy();
        });       
    }

    update(){
        if(this.getDifferenceInDays(new Date(), this.player.playerInfo.lastSpin) > 1 && this.roullete_notif.alpha == 0){
            this.roullete_notif.setAlpha(1);
        }
        else if(this.getDifferenceInDays(new Date(), this.player.playerInfo.lastSpin) <= 1 && this.roullete_notif.alpha == 1){
           this.roullete_notif.setAlpha(0); 
        }

        if(this.getDifferenceInDays(new Date(), this.player.playerInfo.lastReward) > 1 && this.gift_notif.alpha == 0){
            this.tweens.add({
                targets: [this.gift_notif],
                alpha: { value: 1, duration: 600, ease: 'Power1'},
                yoyo: false,
                delay:1000
            });
        }
        else if(this.getDifferenceInDays(new Date(), this.player.playerInfo.lastReward) <= 1 && this.gift_notif.alpha == 1){
            this.gift_notif.setAlpha(0);
        }

        if(this.player.playerInfo.lastRead !== this.player.announcements.id && this.mail_notif.alpha == 0){
            this.tweens.add({
                targets: this.mail_notif,
                alpha: { value: 1, duration: 600, ease: 'Power1'},
                yoyo: false,
                delay:1200
            });
        }
        else if(this.player.playerInfo.lastRead == this.player.announcements.id && this.mail_notif.alpha == 1){
            this.mail_notif.setAlpha(0);
        }
    }
}

export default Game;