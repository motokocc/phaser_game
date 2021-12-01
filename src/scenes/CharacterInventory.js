import 'regenerator-runtime/runtime';
import BaseScene from '../plugins/BaseScene';
import { Tabs } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { ScrollablePanel } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { FixWidthSizer } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { doc, updateDoc } from "firebase/firestore";

class CharacterInventory extends BaseScene {
    create(){
        this.gameBg = this.add.image(-2,-7.5,'inventory_bg');
        this.gameBg.setOrigin(0,0);
        this.gameBg.setScale(1.10);

        const gameW = this.game.config.width;
        const gameH = this.game.config.height;
        const paddingX = gameW * 0.025;
        const buttonScale = gameW * 0.00078;

        //Gems
        let gems = this.add.container();
        const gem_icon = this.add.sprite(gameW/2 - paddingX*3, gameH*0.07,'gems').setOrigin(0.5).setDepth(2);
        const gem_box = this.add.rexRoundRectangle(gem_icon.x, gem_icon.y, paddingX*4, paddingX, paddingX/5, 0x000000).setOrigin(0,0.5).setAlpha(0.6);
        const gem_value = this.add.text(gem_box.x + gem_box.width/2, gem_box.y, this.player.playerInfo.gems || 0, {fontFamily: 'Arial'}).setOrigin(0.5);

        //Gold
        let gold = this.add.container();
        const gold_icon = this.add.sprite(gameW/2 + paddingX*3, gameH*0.07,'gold').setOrigin(0.5).setDepth(2);
        const gold_box = this.add.rexRoundRectangle(gold_icon.x, gem_icon.y, paddingX*4, paddingX, paddingX/5, 0x000000).setOrigin(0,0.5).setAlpha(0.6);
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

        let backButton = this.add.sprite(gameW-paddingX, paddingX, 'exitIcon').setOrigin(1,0).setScale(0.6).setInteractive();
        backButton.on('pointerdown', () => this.scene.start("game"));

        let cardInventoryData = this.player.playerInfo.cards.sort((a, b) => (b.properties.rarity - a.properties.rarity));

        let sizer = new FixWidthSizer(this, {
            space: {
                left: 10,
                right: 10,
                bottom: 10,
                item: 10,
                line: 10
            }
        }).layout();
        this.add.existing(sizer);

        cardInventoryData.forEach((item, index) => {
            sizer.add(
                this.add.sprite(0, 0, item.name).setScale(0.35).setOrigin(0).setDepth(10).setInteractive().setData(item)
                    .on('pointerdown', () => {
                        this.detailsText.setText(item.description); 
                        detailsImage.setTexture(`${item.name}_alt`);
                        displayName.setText(item.name);
                        rarity.setTexture(`rarity_${item.properties.rarity}`);
                        attribute.setTexture(item.properties.attribute);
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
                track: this.add.rexRoundRectangle(0, 0, 10, gameH*0.745, 4.5, 0x000000, 0.9).setStrokeStyle(0.5, 0xffffff, 0.8),
                thumb: this.add.rexRoundRectangle(0, 0, 10, paddingX*4, 4.5, 0xffffff, 0.8).setAlpha(0.5),
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
                this.add.rectangle(0, 0, paddingX*4, paddingX*2.1, 0x000000, 0.9 ).setOrigin(0.5,1).setScale(0.8),
                this.add.rectangle(0, 0, paddingX*4, paddingX*2.1, 0x23140a, 0.9 ).setOrigin(0.5,1).setScale(0.8),
                this.add.rectangle(0, 0, paddingX*4, paddingX*2.1, 0x23140a, 0.9 ).setOrigin(0.5,1).setScale(0.8),
            ]
        }).setOrigin(0).layout();

        tabs.getElement('topButtons').forEach((tab, index) => {
            tab.setStrokeStyle(2, 0x000000, 1);
            if(index == 0){
                this.add.sprite(tab.x, tab.y - tab.displayHeight/2 ,'cards_icon').setOrigin(0.5);
            }
            else if(index == 1){
                this.add.sprite(tab.x, tab.y - tab.displayHeight/2,'backpack_icon').setOrigin(0.5);
            }
            else{
                this.add.sprite(tab.x, tab.y - tab.displayHeight/2 ,'magic_icon').setOrigin(0.5);
            }

        });
        
        tabs.on('button.click', (button, groupName, index) => {
            let tabButtons = tabs.getElement('topButtons');

            tabButtons.forEach((button,indexButton) => {
                if(indexButton == index){
                    button.fillColor = 0x000000 ;
                }
                else{
                    button.fillColor = 0x23140a;
                }
            })

            sizer.clear(true);

            if(index == 0){
                cardInventoryData.forEach((item, index) => {
                    sizer.add(
                        this.add.sprite(0, 0, item.name).setScale(0.35).setOrigin(0).setDepth(10).setInteractive().setData(item)
                        .on('pointerdown', () => {
                            this.detailsText.setText(item.description);
                            detailsImage.setTexture(`${item.name}_alt`);
                            displayName.setText(item.name);
                            rarity.setTexture(`rarity_${item.properties.rarity}`);
                            attribute.setTexture(item.properties.attribute);
                        })
                    );
                })
            }
            else if(index == 1){
                sizer.add(this.add.text(0,0, 'No items acquired', {fontFamily: 'Arial'}));
            }
            else{
                sizer.add(this.add.text(0,0, 'No available skills to learn', {fontFamily: 'Arial'}));
            }    
            
            panelBox.layout();
        });

        this.add.existing(tabs);

        let itemsOnTab = sizer.getElement('items');

        //Details Box
        const detailsBox = this.add.rectangle(gameW/2 - paddingX*2, tabs.y + paddingX*2.1 - 10, gameW/2 + paddingX, gameH*0.745, 0x000000, 0.9).setOrigin(0);

        const summonCircle = this.add.sprite(
            detailsBox.x + detailsBox.displayWidth/2,
            detailsBox.y+ detailsBox.displayHeight/2 - paddingX,  
            'summoningCircle2'
        ).setOrigin(0.5).setScale(0.9).setAlpha(0.7);

        const detailsImage = this.add.sprite(
            detailsBox.x + detailsBox.displayWidth/2,
            detailsBox.y+ detailsBox.displayHeight - 1,
            `${itemsOnTab[0].data.list.name}_alt`
        ).setOrigin(0.5,1); 
        
        const messageDetailsBox = this.add.rectangle(
            detailsBox.x  + paddingX/2,
            detailsBox.y + detailsBox.displayHeight - paddingX/2 - 110 ,
            detailsBox.displayWidth - paddingX,
            110, 0x000000,1).setStrokeStyle(0.5, 0xffffff,1).setOrigin(0);

        this.detailsText = this.add.text(messageDetailsBox.x + 10, messageDetailsBox.y + 10, itemsOnTab[0].data.list.description, {fontFamily: 'Arial', align: 'justify'})
            .setOrigin(0)
            .setWordWrapWidth(messageDetailsBox.displayWidth-20, true);

        const displayName = this.add.text(
            detailsBox.x + paddingX, detailsBox.y + paddingX, 
            itemsOnTab[0].data.list.name, 
            { fontFamily:'Arial', fontSize: 20, fontStyle: 'Bold Italic'} 
        ).setOrigin(0);

        const rarity = this.add.sprite(
            displayName.x,
            displayName.y + displayName.displayHeight + paddingX/4,
            `rarity_${itemsOnTab[0].data.list.properties.rarity}`
        ).setOrigin(0).setScale(0.2);

        const attribute = this.add.sprite(
            detailsBox.x + detailsBox.displayWidth - paddingX,
            displayName.y,
            itemsOnTab[0].data.list.properties.attribute
        ).setOrigin(1,0).setScale(0.35);

        this.tweens.add({
            targets: detailsImage,
            scale: { value: 1.01, duration: 800, ease: 'easeIn'},
            yoyo: true,
            repeat: -1
        });

        this.tweens.add({
            targets: summonCircle,
            angle: { value: 360, duration: 60000, ease: 'Linear'},
            repeat: -1
        });

        //UI Containers/Groups
        gems.add([gem_box, gem_icon, gem_value]);
        gold.add([gold_box, gold_icon, gold_value]);
        playerUI.add([player_gui_box, player_name]);

    }
}

export default CharacterInventory;