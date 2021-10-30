import Phaser from 'phaser';

class Game extends Phaser.Scene {
   create(){
        this.anims.create({
            key: 'elf_happy_main',
            frames: [
                { key: 'elf_happy_1' },
                { key: 'elf_happy_2' }
            ],
            frameRate: 8,
            repeatDelay: 2500,
            repeat: -1
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
        let npc_lilith = this.add.sprite(gameW/2, gameH + 5, 'elf-0')
        .setOrigin(0.5,1)
        .setScale(0.000928 * gameW)
        .setInteractive();

        npc_lilith.play('elf_happy_main');

        //Right side buttons
        let rightButtons = this.add.container();
        const shop_button = this.add.sprite(gameW - (paddingX*2.8), gameH*0.21 + paddingY, 'shop_button').setOrigin(0.5);
        const pvp_button = this.add.sprite(gameW -(paddingX*2.8), gameH*0.42 + paddingY, 'pvp_button').setOrigin(0.5);
        const mining_button = this.add.sprite(gameW - (paddingX*2.8), gameH*0.63 + paddingY, 'mining_button').setOrigin(0.5);
        const explore_button = this.add.sprite(gameW - (paddingX*2.8), gameH*0.84 + paddingY, 'explore_button').setOrigin(0.5);

        //Left side buttons
        let leftButtons = this.add.container();
        const roullete_button = this.add.sprite(paddingX, gameH*0.21, 'roullete_button').setOrigin(0,0.5);
        const black_market_button = this.add.sprite(paddingX, gameH*0.35, 'black_market_button').setOrigin(0,0.5);  
        const missions_button = this.add.sprite(paddingX, gameH*0.49, 'missions_button').setOrigin(0,0.5);
        const summon_button = this.add.sprite(paddingX, gameH*0.63, 'summon_button').setOrigin(0,0.5);
        
        //Upper Right Icons
        const settings_button = this.add.sprite(gameW - (paddingX*2), gameH*0.07,'settings_button').setOrigin(0.5);
        const gift_button = this.add.sprite(settings_button.x - (paddingX*2.5), gameH*0.07,'gift_button').setOrigin(0.5);
        const mail_button = this.add.sprite(gift_button.x - (paddingX*2.5), gameH*0.07,'mail_button').setOrigin(0.5);

        //Player Stat GUI
        const player_gui_box = this.add.sprite(paddingX, gameH*0.07,'player_gui_box').setOrigin(0, 0.5).setScale(buttonScale).setInteractive();
        const player_name = this.add.text(player_gui_box.x* 3.6, player_gui_box.y, this.player.playerInfo.name || 'Adventurer').setOrigin(0, 0.5);

        rightButtons.add([shop_button, pvp_button, mining_button, explore_button]);
        leftButtons.add([roullete_button, black_market_button, missions_button, summon_button]);

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
        let message = ''; //message of the player
        let chatbox = this.add.container();
        const chatBody = this.add.rectangle(0,gameH, gameW*0.37, gameW*0.17, 0x000000).setOrigin(0,1).setAlpha(0.5);
        let chatInput = this.add.rexInputText(
            paddingX/2,
            gameH - paddingX/2,
            gameW*0.28,
            gameW*0.025,
            { 
                type: "text",
                maxLength: 100,
                fontSize : "12px",
                fontFamily: "Arial",
                backgroundColor : "white",
                color: "black",
                placeholder: " Type your message here..."
            }
        ).setOrigin(0,1)
        .on('textchange', inputText => {
            message = inputText.text;
        });

        const sendChatButton = this.add.rectangle(paddingX + chatInput.width, gameH - paddingX/2, gameW*0.05, gameW*0.026, 0x0000ff)
            .setOrigin(0,1).setInteractive();

        sendChatButton.on("pointerdown", () => {
            sendChatButton.setAlpha(0.7);
            this.sound.play('hoverEffect', {loop: false});
            if(message){
                console.log('MESSAGE?', message);
            }
        });

        sendChatButton.on("pointerup", () => {
            sendChatButton.setAlpha(1);
        });

        
        chatbox.add([chatBody, chatInput, sendChatButton]);
    }
}

export default Game;