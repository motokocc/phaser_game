import 'regenerator-runtime/runtime'
import { doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";
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

        const gameW = this.game.config.width;
        const gameH = this.game.config.height;
        const paddingX = gameW * 0.025;
        const paddingY = gameH * 0.033;
        const buttonScale = gameW * 0.00078;

        //NPC - Lilith
        let npc_lilith = this.add.sprite(gameW/2, gameH + 3, 'elf-0')
        .setOrigin(0.5,1)
        .setScale(0.000928 * gameW)
        .setInteractive();

        npc_lilith.playReverse('elf_idle_main');

        npc_lilith.on('pointerdown', () => {
            let messageOptions = [
                'Good day adventurer! I hope you have wonderful hunt today!',
                'You need to collect the 5 artifacts to open the Hidden Dungeon',
                'Higher tier djinns take human form.',
                'You should check the black market. They offer rare items not available in the shop.'
            ];

            let randomMessage = Math.floor(Math.random()* messageOptions.length);
            this.npcTalk(npc_lilith, messageOptions[randomMessage],'elf_talk_main','elf_idle_main',npc_lilith.x + npc_lilith.width/4, gameH/2 - (npc_lilith.width/2));
        });

        //Right side buttons
        let rightButtons = this.add.container(200,0);
        const shop_button = this.add.sprite(gameW - (paddingX*2.8), gameH*0.21 + paddingY, 'shop_button').setOrigin(0.5);
        const pvp_button = this.add.sprite(gameW -(paddingX*2.8), gameH*0.42 + paddingY, 'pvp_button').setOrigin(0.5);
        const mining_button = this.add.sprite(gameW - (paddingX*2.8), gameH*0.63 + paddingY, 'mining_button').setOrigin(0.5);
        const explore_button = this.add.sprite(gameW - (paddingX*2.8), gameH*0.84 + paddingY, 'explore_button').setOrigin(0.5);

        //Left side buttons
        let leftButtons = this.add.container(-250,0);
        const roullete_button = this.add.sprite(paddingX, gameH*0.23, 'roullete_button').setOrigin(0,0.5).setName('roullete');
        const black_market_button = this.add.sprite(paddingX, gameH*0.37, 'black_market_button').setOrigin(0,0.5);  
        const missions_button = this.add.sprite(paddingX, gameH*0.51, 'missions_button').setOrigin(0,0.5);
        const summon_button = this.add.sprite(paddingX, gameH*0.65, 'summon_button').setOrigin(0,0.5).setName('summoningArea');

        // Left Notifications
        this.roullete_notif = this.add.circle(roullete_button.displayWidth - paddingX/2, roullete_button.y - roullete_button.displayHeight/3, 10, 0xff0000, 1);
        this.roullete_notif.setAlpha(0);

        //Upper Right Icons
        const settings_button = this.add.sprite(gameW - (paddingX*2), gameH*0.07,'settings_button').setOrigin(0.5).setName('settings');
        const gift_button = this.add.sprite(settings_button.x - (paddingX*2.5), gameH*0.07,'gift_button').setOrigin(0.5).setName('gift');
        const mail_button = this.add.sprite(gift_button.x - (paddingX*2.5), gameH*0.07,'mail_button').setOrigin(0.5).setName('mail');

        this.gift_notif = this.add.circle(gift_button.x + paddingX*0.9, gift_button.y - paddingX*0.8, 8, 0xff0000, 1);
        this.gift_notif.setAlpha(0);
        this.mail_notif = this.add.circle(mail_button.x + paddingX*0.9, mail_button.y - paddingX*0.8, 8, 0xff0000, 1);
        this.mail_notif.setAlpha(0);

        settings_button.setScale(0.1).setAlpha(0);
        gift_button.setScale(0.1).setAlpha(0);
        mail_button.setScale(0.1).setAlpha(0);

        //Player Stat GUI
        let playerUI = this.add.container(0,-200);
        const player_gui_box = this.add.sprite(paddingX, gameH*0.07,'player_gui_box').setOrigin(0, 0.5).setScale(buttonScale).setInteractive();
        const player_name = this.add.text(
            player_gui_box.x* 3.6,
            player_gui_box.y,
            this.player.playerInfo.name || 'Adventurer',
            {fontFamily: 'Arial'}
        ).setOrigin(0, 0.5);

        //Gems
        let gems = this.add.container();
        const gem_icon = this.add.sprite(gameW/2 - paddingX*3, gameH*0.07,'gems').setOrigin(0.5).setDepth(2);
        const gem_box = this.add.rectangle(gem_icon.x, gem_icon.y, paddingX*4, paddingX, 0x000000).setOrigin(0,0.5).setAlpha(0.6);
        const gem_value = this.add.text(gem_box.x + gem_box.width/2, gem_box.y, this.player.playerInfo.gems || 0, {fontFamily: 'Arial'}).setOrigin(0.5);

        //Gold
        let gold = this.add.container();
        const gold_icon = this.add.sprite(gameW/2 + paddingX*3, gameH*0.07,'gold').setOrigin(0.5).setDepth(2);
        const gold_box = this.add.rectangle(gold_icon.x, gem_icon.y, paddingX*4, paddingX, 0x000000).setOrigin(0,0.5).setAlpha(0.6);
        const gold_value = this.add.text(gold_box.x + gold_box.width/2, gold_box.y, this.player.playerInfo.gold || 0, {fontFamily: 'Arial'}).setOrigin(0.5);

        let currencyUI = this.add.container(0,-200);
        currencyUI.setX(-paddingX * 2);

        //Settings Box
        this.settingsBox(gameW, 0, 300, gameH/2 + paddingX , paddingX*0.95, paddingX*3);

        //UI Containers/Groups
        gems.add([gem_box, gem_icon, gem_value]);
        gold.add([gold_box, gold_icon, gold_value]);
        currencyUI.add([gold, gems]);
        playerUI.add([player_gui_box, player_name]);
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

        const buttons = [
            shop_button, pvp_button, mining_button, explore_button,
            roullete_button, black_market_button, missions_button, summon_button,
            settings_button, gift_button, mail_button,
        ];
    
        buttons.forEach(button => {
            button.setScale(buttonScale).setInteractive();

            button.on('pointerover', () => {
                button.setScale(0.00088*gameW);
                this.hoverSound.stop();
                this.hoverSound.play();

                if(button.name == 'roullete'){
                    this.roullete_notif.setPosition(roullete_button.displayWidth + paddingX*0.8, roullete_button.y - roullete_button.displayHeight*0.45);
                }
            });

            button.on('pointerout', () => {
                button.setScale(buttonScale);
                if(button.name == 'roullete'){
                    this.roullete_notif.setPosition(roullete_button.displayWidth + paddingX*0.8, roullete_button.y - roullete_button.displayHeight*0.4);
                }
            });

            button.on('pointerdown', async() => {
                //Daily Reward
                if(button.name == 'gift'){
                    if(this.getDifferenceInMinutes(new Date(), this.player.playerInfo.lastReward)> 5 && this.player.playerInfo.address){                       
                        try{
                            button.disableInteractive();
                            const rewardRef = doc(this.player.db, "rewards", 'daily');
                            const rewards = await getDoc(rewardRef);
                            let goldValue = rewards.data().gold || 0;
                            let gemValue = rewards.data().gems || 0;

                            let content = this.add.group();                   
                            const goldBox = this.add.rectangle(gameW/2 - 17.5, gameH/2-paddingX/2, gold_icon.width + paddingX/2, gold_icon.width + paddingX/2, 0x9b6330).setScale(0,1.3).setOrigin(1,0.5);
                            goldBox.setStrokeStyle(5, 0x613e1e, 1);
                            const gemsBox = this.add.rectangle(gameW/2 + 17.5, gameH/2-paddingX/2, gold_icon.width + paddingX/2, gold_icon.width + paddingX/2, 0x9b6330).setScale(0,1.3).setOrigin(0,0.5);
                            gemsBox.setStrokeStyle(5, 0x613e1e, 1);
                            const goldReward = this.add.sprite(gameW/2 - 25, gameH/2-paddingX/2,'gold').setScale(0,1.3).setOrigin(1,0.5); 
                            const gemsReward = this.add.sprite(gameW/2 + 25, gameH/2-paddingX/2,'gems').setScale(0,1.3).setOrigin(0,0.5); 
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
                                await setDoc(doc(this.player.users, this.player.playerInfo.address), this.player.playerInfo);
                                button.setInteractive();
                            }
                            catch(e){
                                button.setInteractive();
                            }
                        }
                        catch(e){
                            button.setInteractive();                            
                            this.npcTalk(npc_lilith, 'Connection failed. Please try again later.','elf_talk_main','elf_idle_main',npc_lilith.x + npc_lilith.width/4, gameH/2 - (npc_lilith.width/2));
                        }
                    }

                    else {
                         this.npcTalk(npc_lilith, 'You can only claim your gift once every 24 hours. Try again later!','elf_talk_main','elf_idle_main',npc_lilith.x + npc_lilith.width/4, gameH/2 - (npc_lilith.width/2));
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
                            let contentBody = this.add.text(gameW/2, gameH/2, content, {fontFamily: 'Arial', color:'#613e1e', fontSize:12, align: 'justify' })
                            .setOrigin(0.5).setWordWrapWidth(250).setScale(0,1.3);
                            contentContainer.add(contentBody)

                            this.popUp(title, contentContainer, '15px');

                            if(this.player.playerInfo.lastRead != id){
                                this.player.playerInfo.lastRead = id;
                                await setDoc(doc(this.player.users, this.player.playerInfo.address), this.player.playerInfo);
                            }
                            button.setInteractive();
                        }
                        catch(e){
                            this.npcTalk(npc_lilith, 'Connection failed. Please try again later.','elf_talk_main','elf_idle_main',npc_lilith.x + npc_lilith.width/4, gameH/2 - (npc_lilith.width/2));
                            button.setInteractive();                          
                        }
                    }
                    else{
                        this.npcTalk(npc_lilith, 'Connection failed. Please try again later.','elf_talk_main','elf_idle_main',npc_lilith.x + npc_lilith.width/4, gameH/2 - (npc_lilith.width/2));
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
            paddingX/2,
            gameH - paddingX/2,
            gameW*0.37 - paddingX,
            gameW*0.025,
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
        const chatBody = this.add.rectangle(0,gameH, gameW*0.37, gameW*0.17, 0x000000).setOrigin(0,1).setAlpha(0.5);
        let chatMessages = this.add.rexTagText(
                chatBody.x + paddingX/2,
                 chatBody.y - chatBody.height + paddingX/2,
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
            y: gameH,
            width: gameW*0.37,
            height: gameW*0.17,
            background: chatBody,
            text: chatMessages,
            space: {
                left: paddingX/2,
                top: paddingX/2,
                right: paddingX/2,
                bottom: this.chatInput.height + paddingX/3
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
        if(this.getDifferenceInMinutes(new Date(), this.player.playerInfo.lastSpin) > 5 && this.roullete_notif.alpha == 0){
            this.roullete_notif.setAlpha(1);
        }
        else if(this.getDifferenceInMinutes(new Date(), this.player.playerInfo.lastSpin) <= 5 && this.roullete_notif.alpha == 1){
           this.roullete_notif.setAlpha(0); 
        }

        if(this.getDifferenceInMinutes(new Date(), this.player.playerInfo.lastReward) > 5 && this.gift_notif.alpha == 0){
            this.tweens.add({
                targets: [this.gift_notif],
                alpha: { value: 1, duration: 600, ease: 'Power1'},
                yoyo: false,
                delay:1000
            });
        }
        else if(this.getDifferenceInMinutes(new Date(), this.player.playerInfo.lastReward) <= 5 && this.gift_notif.alpha == 1){
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