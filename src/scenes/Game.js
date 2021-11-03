import 'regenerator-runtime/runtime'
import { getFirestore, collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import BaseScene from '../plugins/BaseScene';

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

            if(this.messageBoxContainer){
                this.messageBoxContainer.destroy();
            }
            npc_lilith.stop();
            npc_lilith.play('elf_talk_main')
            this.createSpeechBubble (npc_lilith.x + npc_lilith.width/4, gameH/2 - (npc_lilith.width/2), 220, 100, messageOptions[randomMessage]);
            npc_lilith.on('animationcomplete', () => {
                npc_lilith.playReverse('elf_idle_main');
                this.messageBoxContainer.destroy();
            });
            
        });

        //Right side buttons
        let rightButtons = this.add.container(200,0);
        const shop_button = this.add.sprite(gameW - (paddingX*2.8), gameH*0.21 + paddingY, 'shop_button').setOrigin(0.5);
        const pvp_button = this.add.sprite(gameW -(paddingX*2.8), gameH*0.42 + paddingY, 'pvp_button').setOrigin(0.5);
        const mining_button = this.add.sprite(gameW - (paddingX*2.8), gameH*0.63 + paddingY, 'mining_button').setOrigin(0.5);
        const explore_button = this.add.sprite(gameW - (paddingX*2.8), gameH*0.84 + paddingY, 'explore_button').setOrigin(0.5);

        //Left side buttons
        let leftButtons = this.add.container(-250,0);
        const roullete_button = this.add.sprite(paddingX, gameH*0.23, 'roullete_button').setOrigin(0,0.5);
        const black_market_button = this.add.sprite(paddingX, gameH*0.37, 'black_market_button').setOrigin(0,0.5);  
        const missions_button = this.add.sprite(paddingX, gameH*0.51, 'missions_button').setOrigin(0,0.5);
        const summon_button = this.add.sprite(paddingX, gameH*0.65, 'summon_button').setOrigin(0,0.5);
        
        //Upper Right Icons
        const settings_button = this.add.sprite(gameW - (paddingX*2), gameH*0.07,'settings_button').setOrigin(0.5);
        const gift_button = this.add.sprite(settings_button.x - (paddingX*2.5), gameH*0.07,'gift_button').setOrigin(0.5);
        const mail_button = this.add.sprite(gift_button.x - (paddingX*2.5), gameH*0.07,'mail_button').setOrigin(0.5);

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

        //UI Containers/Groups
        gems.add([gem_box, gem_icon, gem_value]);
        gold.add([gold_box, gold_icon, gold_value]);
        currencyUI.add([gold, gems]);
        playerUI.add([player_gui_box, player_name]);
        rightButtons.add([shop_button, pvp_button, mining_button, explore_button]);
        leftButtons.add([roullete_button, black_market_button, missions_button, summon_button]);

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
            targets: gift_button,
            scale: { value: buttonScale, duration: 600, ease: 'Power1'},
            alpha: { value: 1, duration: 600, ease: 'Power1'},
            yoyo: false,
            delay:1000
        });

        this.tweens.add({
            targets: mail_button,
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
                this.sound.play('hoverEffect', {loop: false});
            });

            button.on('pointerout', () => {
                button.setScale(buttonScale);
            });
        });

        //Chat Box
        this.message = ''; //message of the player
        let chatbox = this.add.container();
        let chatCount = 0;
        const chatBody = this.add.rectangle(0,gameH, gameW*0.37, gameW*0.17, 0x000000).setOrigin(0,1).setAlpha(0.5);
        this.chatInput = this.add.rexInputText(
            paddingX/2,
            gameH - paddingX/2,
            gameW*0.28,
            gameW*0.025,
            { 
                type: "text",
                maxLength: 30,
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

        const sendChatButton = this.add.rectangle(paddingX + this.chatInput.width, gameH - paddingX/2, gameW*0.05, gameW*0.026, 0x009900)
            .setOrigin(0,1).setInteractive();
        
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
                    }
                }
        ).setWrapMode('word').setWrapWidth(chatBody.width * 0.95);  

        const unsub = onSnapshot(doc(this.player.db, "chat", "general"), (doc) => {

                let uiMessages =[];
                this.firebaseMessages = doc.data().messages? doc.data() : this.firebaseMessages;
                chatCount++;               

                if(doc.data().messages /*&& chatCount - 1 >= 1*/){
                    doc.data().messages.map((chat, index) => {
                        //if(index >= doc.data().messages.length - chatCount - 1){console.log(chat)}
                        uiMessages.push(`<class='playerName'>${chat.username}</class> : ${chat.message}`);
                    })
                    chatMessages.setText(uiMessages);
                }
        });
  
        let enterKeyboardButton = this.input.keyboard.addKey('Enter');
        enterKeyboardButton.on('down', () => this.sendChat());

        sendChatButton.on("pointerdown", () => {
            sendChatButton.setAlpha(0.7);
            this.sendChat();
        });

        sendChatButton.on("pointerup", () => {
            sendChatButton.setAlpha(1);
        });

        
        chatbox.add([chatBody, this.chatInput, sendChatButton]);
    }

    sendChat(){
        this.sound.play('hoverEffect', {loop: false});
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
}

export default Game;