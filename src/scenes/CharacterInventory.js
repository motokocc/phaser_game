import 'regenerator-runtime/runtime';
import BaseScene from '../plugins/BaseScene';
import { Tabs } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { ScrollablePanel } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { FixWidthSizer } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { OverlapSizer } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { doc, updateDoc } from "firebase/firestore";
import { cardStats } from '../js/cardStats';

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
                        detailsImage.setTexture(`${item.name}_alt`).setData(item);
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

            sizer.clear(true);

            if(index == 0){
                cardInventoryData.forEach((item, index) => {
                    sizer.add(
                        this.add.sprite(0, 0, item.name).setScale(0.35).setOrigin(0).setDepth(10).setInteractive().setData(item)
                        .on('pointerdown', () => {
                            this.detailsText.setText(item.description);
                            detailsImage.setTexture(`${item.name}_alt`).setData(item);
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

        //Stats Tabs
        let sizerRight = new FixWidthSizer(this, {
            space: {
                item: 10,
                line: 10
            }
        }).layout();
        this.add.existing(sizerRight);

        this.panelBoxRight = new ScrollablePanel(this, {
            x: 0,
            y: 0,
            width: gameW* 0.4,
            height: gameH*0.745,
            scrollMode:0,
            background: this.add.rectangle(0,0, gameW* 0.4, gameH*0.745, 0x000000, 0.9),
            panel: {
                child: sizerRight
            },
            space:{
                left: paddingX,
                right: paddingX-10,
                top: paddingX,
                bottom: 10,
            },
            slider: {
                track: this.add.rexRoundRectangle(0, 0, 10, gameH*0.745, 4.5, 0x000000, 0),
                thumb: this.add.rexRoundRectangle(0, 0, 10, paddingX*4, 4.5, 0xffffff, 0),
                input: 'drag',
                position: 'right',
            },
        }).setOrigin(0).layout();
        this.add.existing(this.panelBoxRight);
        
        let statsTitle = this.add.text(0,0, 'Stats', { fontFamily:'Arial', fontSize: 20, fontStyle: 'Bold Italic'} );

        sizerRight.add(statsTitle);

        let tabsRight = new Tabs(this, {
            x: gameW,
            y: gameH * 0.22 - paddingX*2 + 10,
            width: gameW* 0.4,
            panel: this.panelBoxRight,
            space:{
                topButtonsOffset:  (gameW*0.4) - paddingX*9.6
            },
            topButtons: [
                this.add.rectangle(0, 0, paddingX*4, paddingX*2.1, 0x000000, 0.95 ).setOrigin(0,1).setScale(0.8),
                this.add.rectangle(0, 0, paddingX*4, paddingX*2.1, 0x23140a, 0.95 ).setOrigin(0,1).setScale(0.8),
                this.add.rectangle(0, 0, paddingX*4, paddingX*2.1, 0x23140a, 0.95 ).setOrigin(0,1).setScale(0.8),
            ]
        }).setOrigin(0).layout();

        
        tabsRight.getElement('topButtons').forEach((tab, index) => {
            tab.setStrokeStyle(2, 0x000000, 0.9);
            if(index == 0){
                this.statsIcon = this.add.sprite(tab.x + tab.displayWidth/2, tab.y - tab.displayHeight/2 ,'stats_icon').setOrigin(0.5);
            }
            else if(index == 1){
                this.skillIcon = this.add.sprite(tab.x + tab.displayWidth/2, tab.y - tab.displayHeight/2,'magic_icon').setOrigin(0.5);
            }
            else{
                this.cartIcon = this.add.sprite(tab.x + tab.displayWidth/2, tab.y - tab.displayHeight/2 ,'cart_icon').setOrigin(0.5);
            }

        });

        tabsRight.on('button.click', async(button, groupName, index) => {
            let tabButtonsRight = tabsRight.getElement('topButtons');

            tabButtonsRight.forEach((button,indexButton) => {
                if(indexButton == index){
                    button.fillColor = 0x000000 ;
                }
                else{
                    button.fillColor = 0x23140a;
                }
            });

            sizerRight.clear(true);
            this.panelBoxRight.layout();

            if(index == 0){
                let stat = cardStats.filter(data => data.name == detailsImage.data.list.name)[0];
                let { health, attack, defence, speed, critRate, critDamage, evasion, accuracy, cooldownReduction } = stat;

                let statBonuses = this.getStatBonuses(detailsImage.data.list);

                let statDetails = this.add.rexTagText(0,0,
                    [
                        `Health : ${health} <class="additionalStat">${statBonuses.health? '+ ' + statBonuses.health.toString(): ''}</class>`,
                        `Attack : ${attack} <class="additionalStat">${statBonuses.attack? '+ ' + statBonuses.attack.toString(): ''}</class>`,
                        `Defence : ${defence} <class="additionalStat">${statBonuses.defence? '+ ' + statBonuses.defence.toString():''}</class>`,
                        `Speed : ${speed}`,
                        `Crit Rate : ${critRate.toFixed(2)}%`,
                        `Crit Damage : ${critDamage.toFixed(2)}%`,
                        `Evasion : ${evasion.toFixed(2)}%`,
                        `Accuracy : ${accuracy.toFixed(2)}%`,
                        `Cooldown Reduction : ${cooldownReduction.toFixed(2)}%`
                    ]
                    ,{
                        fontFamily: 'Arial',
                        lineSpacing: 10, 
                        tags: {
                            additionalStat:{
                                color: "#00ff00"
                            }
                        }
                    }
                );
    
                let statsTitle = this.add.text(0,0, 'Stats', { fontFamily:'Arial', fontSize: 20, fontStyle: 'Bold Italic'} )
    
                sizerRight.add(statsTitle, { padding : { right: gameW *0.2, bottom: 10 } });
                sizerRight.add(statDetails);
            }
            else if(index == 1){
                sizerRight.add(this.add.text(0,0, 'No skills equipped', {fontFamily: 'Arial'}));
            }
            else{
                try{
                    let loading = this.add.text(0,0, 'Loading Data.. Please wait...', { fontFamily: 'Arial', padding:10 })
                    sizerRight.add(loading).layout();
                    this.allUiGroup.add(loading);
                    let cartItems = await this.player.getCardSaleStatus(detailsImage.data.list.id);
                    sizerRight.clear(true);

                    let { orderId, price, quantityOnSale, itemOnHand } = cartItems;

                    if(detailsImage.data.list.fromBlockchain){           

                        this.salesSizer = new OverlapSizer(this,0,0,this.panelBoxRight.width - (paddingX*2),100, {space:0}).setOrigin(0,0);
                        this.add.existing(this.salesSizer);

                        this.salesSizer                                
                            .add(this.add.rectangle(0,0,this.panelBoxRight.width - (paddingX*2),100, 0x000000, 0).setStrokeStyle(1,0xffffff,1), {key: 'salesBox',expand: false})
                            .add(this.add.text(0,0, [
                                `Item on hand : ${itemOnHand}`,
                                `Item on sale : ${quantityOnSale}`,
                                `Price : ${price > 0? price : 'N/A'}`,
                            ], {fontFamily: 'Arial'}), {key: 'details', expand:false, align: 'left-center', padding: { left: 10 }})
                            .add(this.add.rexRoundRectangle(0,0,60,30,5, 0x005500,1).setInteractive(), {key: 'sellButton', expand:false, align: 'right-center', padding: { right: 10 }})
                            .layout();
                        
                        sizerRight.add(this.salesSizer);

                        let { sellButton } = this.salesSizer.getElement('items');
                        sellButton.on('pointerdown',() => {
                            if(quantityOnSale >= 1){
                                const cancelSaleGroup = this.add.group();


                                this.popUp('Sell item',cancelSaleGroup);
                            }
                            else{
                                this.sellItemPopUp(itemOnHand);
                            }
                        })
 
                    }
                    else{
                        sizerRight.add(this.add.text(0,0, 'This item cannot be sold in the marketplace', {fontFamily: 'Arial'}));
                    }           
                }
                catch(e){
                    console.log(e.message);
                }
            }

            this.panelBoxRight.layout();

            let sizerChildren = sizer.getElement('items');
            let sizerChildrenRight = sizerRight.getElement('items');

            this.allUiGroup.add(sizerChildren);
            this.allUiGroup.add(sizerChildrenRight);

            if(this.salesSizer){              
                let saleItem = this.salesSizer.getElement('items');
                if(saleItem){
                    this.allUiGroup.add([saleItem.details, saleItem.salesBox, saleItem.sellButton]);
                }                              
            }

        });

        this.add.existing(tabsRight);

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
        ).setOrigin(0.5,1).setInteractive().setData(itemsOnTab[0].data.list); 
        
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

        //Slide effect
        this.allUiGroup = this.add.container();

        this.allUiGroup.add(tabs.getElement('topButtons'));
        this.allUiGroup.add([panelBox.getElement('background'), panelBox.getElement('slider.track'), panelBox.getElement('slider.thumb')]);
        this.allUiGroup.add([
            this.magicIcon, this.backpackIcon, this.cardIcon,
            detailsBox, summonCircle, displayName, rarity, attribute, detailsImage, messageDetailsBox, this.detailsText
        ]);

        this.allUiGroup.add(tabsRight.getElement('topButtons'));
        this.allUiGroup.add([this.panelBoxRight.getElement('background'), this.panelBoxRight.getElement('slider.track'), this.panelBoxRight.getElement('slider.thumb')]);
        this.allUiGroup.add([
            this.statsIcon, this.skillIcon, this.cartIcon
        ]);

        this.detailsImageToggle = false;

        detailsImage.on('pointerdown', () => {
            tabsRight.emitButtonClick('top', 0);
            
            if(detailsImage.data.list.type == "card"){
                this.slideEffect(-(tabs.width + paddingX));
            }
        });

        //UI Containers/Groups
        gems.add([gem_box, gem_icon, gem_value]);
        gold.add([gold_box, gold_icon, gold_value]);
        playerUI.add([player_gui_box, player_name]);

    }

    slideEffect(distance){
        this.detailsImageToggle = !this.detailsImageToggle;

        if(this.detailsImageToggle){
            this.tweens.add({
                targets: [this.allUiGroup],
                x: { value: distance , duration: 150, ease: 'Linear'},
                yoyo: false
            });
        }
        else{
            this.tweens.add({
                targets: [this.allUiGroup],
                x: { value: 0, duration: 150, ease: 'Linear'},
                yoyo: false,
            });
        }
    }

    getStatBonuses(data){
        let { level } = this.player.playerInfo;
        let { quantity, properties }  = data;
     
        level--;
        quantity--;

        return {
            attack: 0 + level + (quantity * properties.rarity),
            defence: 0 + level + (quantity * properties.rarity),
            health: 0 + level + (quantity * properties.rarity),
        }
    }

    sellItemPopUp(itemOnHand) {
        const sellItemGroup = this.add.group();

        let quantity = 1;
        let price = 0;

        //Quantity of item to be sold
        const sellquantity = this.add.rexInputText(
            this.game.config.width/2,
            this.game.config.height/2 - 30,
            100,
            25,
            { 
                type: "number",
                maxLength: 2,
                fontSize : "18px",
                fontFamily: 'Arial',
                backgroundColor : "white",
                color: "black",
            }
        ).setOrigin(0.5).setScale(0,1.3)
        .on('textchange', inputText => {
            quantity = inputText.text;
        });

        sellquantity.setText(quantity);
        sellquantity.setStyle("border-radius", "5px");
        sellquantity.setStyle("text-align", "center");

        //Price of item to be sold
        const sellingPrice = this.add.rexInputText(
            this.game.config.width/2,
            this.game.config.height/2 + 30,
            100,
            25,
            { 
                type: "number",
                maxLength: 2,
                fontSize : "18px",
                fontFamily: 'Arial',
                backgroundColor : "white",
                color: "black",
            }
        ).setOrigin(0.5).setScale(0,1.3)
        .on('textchange', inputText => {
            price = inputText.text;
        });

        sellingPrice.setText(price);
        sellingPrice.setStyle("border-radius", "5px");
        sellingPrice.setStyle("text-align", "center");

        let quantityInput = document.querySelector('input');
        quantityInput.max = itemOnHand;
        quantityInput.min = 1;
        quantityInput.pattern = '/^[0-9]*[1-9][0-9]*$/';

        let priceInput = document.querySelectorAll('input')[1];
        priceInput.min = 0;
        
        sellItemGroup.addMultiple([sellquantity, sellingPrice]);

        this.popUp('Sell item',sellItemGroup);
    }
}

export default CharacterInventory;