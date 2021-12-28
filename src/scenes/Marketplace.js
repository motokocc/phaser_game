import 'regenerator-runtime/runtime';
import BaseScene from '../plugins/BaseScene';
import {  Tabs, ScrollablePanel, FixWidthSizer, Menu, Label, Click } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { doc, updateDoc } from "firebase/firestore";

class Marketplace extends BaseScene {

    create(){
        this.gameBg = this.add.image(-2,-7.5,'inventory_bg');
        this.gameBg.setOrigin(0,0);
        this.gameBg.setScale(1.10);

        const gameW = this.game.config.width;
        const gameH = this.game.config.height;
        const paddingX = gameW * 0.025;

        this.generateUpperUI();

        //Market UI
        this.sizer = new FixWidthSizer(this, {
            space: {
                left: 10,
                right: 10,
                bottom: 10,
                item: 10,
                line: 10
            }
        }).layout();
        this.add.existing(this.sizer);

        // let cardInventoryData = [
        //     {
        //         name: "Saya",
        //         properties: {
        //             attribute: "water",
        //             rarity: 5
        //         }
        //     },
        //     {
        //         name: "Alpha",
        //         properties: {
        //             attribute: "fire",
        //             rarity: 1
        //         }
        //     },            
        // ];

        this.loadNFTMarketplace();

        this.panelBox = new ScrollablePanel(this, {
            x: 0,
            y: 0,
            width: gameW - paddingX*2,
            height: gameH*0.745,
            scrollMode:0,
            background: this.add.rectangle(0,0, gameW - paddingX*2, gameH*0.745, 0x000000, 0.9),
            panel: {
                child: this.sizer
            },
            space:{
                left: 10,
                right: 20,
                top: 20,
                bottom: 20,
            },
            slider: {
                track: this.add.rexRoundRectangle(0, 0, 10, gameH*0.745, 4.5, 0x000000, 0.9).setStrokeStyle(0.5, 0xffffff, 0.8),
                thumb: this.add.rexRoundRectangle(0, 0, 10, paddingX*4, 4.5, 0xffffff, 0.8).setAlpha(0.5),
                input: 'drag',
                position: 'right',
            },
        }).setOrigin(0).layout();
        this.add.existing(this.panelBox);

        //Inventory Tabs
        let tabs = new Tabs(this, {
            x: paddingX,
            y: gameH * 0.22 - paddingX*2 + 10,
            width: gameW - paddingX*2,
            height: gameH*0.745,
            panel: this.panelBox,
            topButtons: [
                this.add.rectangle(0, 0, paddingX*4, paddingX*2.1, 0x000000, 0.9 ).setOrigin(0.5,1).setScale(0.8),
                this.add.rectangle(0, 0, paddingX*4, paddingX*2.1, 0x23140a, 0.9 ).setOrigin(0.5,1).setScale(0.8),
                this.add.rectangle(0, 0, paddingX*4, paddingX*2.1, 0x23140a, 0.9 ).setOrigin(0.5,1).setScale(0.8),
            ]
        }).setOrigin(0).layout();

        tabs.getElement('topButtons').forEach((tab, index) => {
            tab.setStrokeStyle(2, 0x000000, 1);
            if(index == 0){
                this.cardIcon = this.add.sprite(tab.x, tab.y - tab.displayHeight/2 ,'cards_icon').setOrigin(0.5);
            }
            else if(index == 1){
                this.backpackIcon = this.add.sprite(tab.x, tab.y - tab.displayHeight/2,'backpack_icon').setOrigin(0.5);
            }
            else{
                this.magicIcon = this.add.sprite(tab.x, tab.y - tab.displayHeight/2 ,'magic_icon').setOrigin(0.5);
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

            this.sizer.clear(true);

            if(index == 0){
                if(this.itemsOnSale){
                    this.itemsOnSale.forEach((item, index) => {
                        this.sizer.add(
                            this.add.sprite(0, 0, item.name).setScale(0.35).setOrigin(0).setDepth(10).setInteractive()
                        );
                    })
                }
                else{
                    this.sizer.add(this.add.text(0,0, 'No cards being sold at the moment', {fontFamily: 'Arial'}));
                }
            }
            else if(index == 1){
                this.sizer.add(this.add.text(0,0, 'No items being sold at the moment', {fontFamily: 'Arial'}));
            }
            else{
                this.sizer.add(this.add.text(0,0, 'No skills being sold at the moment', {fontFamily: 'Arial'}));
            }    

            this.panelBox.layout();
        });

        this.add.existing(tabs);
        

        let itemsOnTab = this.sizer.getElement('items');
        
    }

    async loadNFTMarketplace(){
        this.sizer.add(this.add.text(0,0, 'Loading NFT marketplace.. Please wait...', {fontFamily: 'Arial'})).setDepth(10);
 
        this.itemsOnSale = await this.player.getAllItemsOnSale();
        this.sizer.removeAll(true);

        if(this.itemsOnSale){
            this.itemsOnSale.forEach((item, index) => {
                this.sizer.add(
                    this.add.sprite(0, 0, item.name).setScale(0.35).setOrigin(0).setDepth(10).setInteractive()
                );
            })
        }
        else{
            this.sizer.add(this.add.text(0,0, 'No cards being sold at the moment', {fontFamily: 'Arial'})).setDepth(10);
        }

        this.panelBox.layout();
    }
}

export default Marketplace;