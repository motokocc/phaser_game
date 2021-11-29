import 'regenerator-runtime/runtime';
import BaseScene from '../plugins/BaseScene';
import { Tabs } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { ScrollablePanel } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { FixWidthSizer } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { doc, updateDoc } from "firebase/firestore";

class CharacterInventory extends BaseScene {
    create(){
        this.gameBg = this.add.image(0,0,'inventory_bg');
        this.gameBg.setOrigin(0,0);
        this.gameBg.setScale(1.11);

        const gameW = this.game.config.width;
        const gameH = this.game.config.height;
        const paddingX = gameW * 0.025;
        const buttonScale = gameW * 0.00078;

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

        //Player Stat GUI
        let playerUI = this.add.container();
        const player_gui_box = this.add.sprite(paddingX, gameH*0.07,'player_gui_box').setOrigin(0, 0.5).setScale(buttonScale).setInteractive();
        const player_name = this.add.text(
            player_gui_box.x* 3.6,
            player_gui_box.y,
            this.player.playerInfo.name || 'Adventurer',
            {fontFamily: 'Arial'}
        ).setOrigin(0, 0.5);

        let sampleData = [
            {
                "name": "Alpha",
                "description": "Alpha is a beast djinn ready to give a helping hand to any adventurer who summons him. He uses his arm-like tail to deal massive damage to his enemies. It is rummored that his eyes can locate hidden treasures and dungeons.",
                "image": "https://ipfs.infura.io/ipfs/QmXwhouX6z9DLtBmpGiGwpDu9W8NCyMhtzHW4Bqfct3Rfd",
                "image_alt": ""
            },
            {
                name: "Saya",
                description: "Saya is a dragon djinn ascended to its human form that's always been mistaken as a demon because of her wing's appearance. She once saved a child from werewolves but instead of thanking her, villagers threw mud at her calling her a demon. Saya uses ice type spells to pierce into enemies' defence.",
                image: "https://ipfs.infura.io/ipfs/QmUDQdkK6DVm6r281TMgskRDdU7WK6x2dkw2TMCiJ9mzYF",
                image_alt: ""
            }
        ]

        let sizer = new FixWidthSizer(this, {
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                item: 10,
                line: 10
            }
        }).layout();
        this.add.existing(sizer);

        sampleData.forEach((item, index) => {
            sizer.add(
                this.add.sprite(0, 0, item.name).setScale(0.35).setOrigin(0).setDepth(10).setInteractive().setData(item)
                    .on('pointerdown', () => {
                        this.detailsText.setText(item.description); 
                    })
            );
        })

        let panelBox = new ScrollablePanel(this, {
            x: 0,
            y: 0,
            width: gameW* 0.4,
            height: gameH*0.745,
            scrollMode:0,
            background: this.add.rectangle(0,0, gameW* 0.4, gameH*0.745, 0x000000, 0.9),
            panel: {
                child: sizer
            },
            space:{
                left: 10,
                right: 20,
                top: 10,
                bottom: 10,
            },
            slider: {
                track: this.add.rectangle(0,0, 10, gameH*0.745, 0x000000, 0.9).setStrokeStyle(1, 0xffffff, 0.8),
                thumb: this.add.rectangle(0,0,10,paddingX*2, 0xffffff,0.8),
                input: 'drag',
                position: 'right',
            },
        }).setOrigin(0).layout();
        this.add.existing(panelBox);

        //Inventory Tabs
        let tabs = new Tabs(this, {
            x: paddingX,
            y: gameH * 0.22 - paddingX*2 + 10,
            width: gameW* 0.4,
            height: gameH*0.745,
            panel: panelBox,
            topButtons: [
                this.add.rectangle(0, 0, paddingX*3, paddingX*2, 0x000000, 0.9 ).setOrigin(0.5,1).setScale(0.8),
                this.add.rectangle(0, 0, paddingX*3, paddingX*2, 0x000000, 0.9 ).setOrigin(0.5,1).setScale(0.8),
                this.add.rectangle(0, 0, paddingX*3, paddingX*2, 0x000000, 0.9 ).setOrigin(0.5,1).setScale(0.8),
            ]
        }).setOrigin(0).layout();
        
        tabs.on('button.click', (button, groupName, index) => {
            // let tabButtons = tabs.getElement('topButtons');

            // tabButtons.forEach((button,indexButton) => {
            //     if(indexButton == index){
            //         button.setScale(1);
            //     }
            //     else{
            //         button.setScale(1,0.8);
            //     }
            // })

            sizer.clear(true);

            if(index == 0){
                sampleData.forEach((item, index) => {
                    sizer.add(
                        this.add.sprite(0, 0, item.name).setScale(0.35).setOrigin(0).setDepth(10).setInteractive().setData(item)
                        .on('pointerdown', () => {
                            this.detailsText.setText(item.description); 
                        })
                    );
                })
            }
            else if(index == 1){
                sizer.add(this.add.text(0,0, 'No items available', {fontFamily: 'Arial'}));
            }
            else{
                sizer.add(this.add.text(0,0, 'No skills available', {fontFamily: 'Arial'}));
            }    
            
            panelBox.layout();
        });

        this.add.existing(tabs);

        let itemsOnTab = sizer.getElement('items');

        //Details Box
        const detailsBox = this.add.rectangle(gameW/2 - paddingX*2, tabs.y + paddingX*2 - 10, gameW/2 + paddingX, gameH*0.745, 0x000000, 0.9).setOrigin(0);
        const messageDetailsBox = this.add.rectangle(
            detailsBox.x  + paddingX,
            detailsBox.y + detailsBox.displayHeight - paddingX - 110 ,
            detailsBox.displayWidth - paddingX*2,
            110, 0x000000,1).setStrokeStyle(0.5, 0xffffff,1).setOrigin(0);

        this.detailsText = this.add.text(messageDetailsBox.x + 10, messageDetailsBox.y + 10, itemsOnTab[0].data.list.description, {fontFamily: 'Arial', align: 'justify'})
            .setOrigin(0)
            .setWordWrapWidth(messageDetailsBox.displayWidth-20, true);

        //UI Containers/Groups
        gems.add([gem_box, gem_icon, gem_value]);
        gold.add([gold_box, gold_icon, gold_value]);
        playerUI.add([player_gui_box, player_name]);

    }
}

export default CharacterInventory;