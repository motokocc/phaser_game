import 'regenerator-runtime/runtime';
import BaseScene from '../plugins/BaseScene';
import { Tabs, ScrollablePanel, FixWidthSizer, OverlapSizer } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { cardStats } from '../js/cardStats';
import { doc, updateDoc } from "firebase/firestore";

class CharacterInventory extends BaseScene {

    create(){
        this.gameBg = this.add.image(-2,-7.5,'inventory_bg');
        this.gameBg.setOrigin(0,0);
        this.gameBg.setScale(1.10);

        const gameW = this.game.config.width;
        const gameH = this.game.config.height;
        const paddingX = gameW * 0.025;

        this.generateUpperUI(false, true);

        //Details Box
        const detailsBox = this.add.rectangle(gameW/2 - paddingX*2, gameH * 0.22, gameW/2 + paddingX, gameH*0.745, 0x000000, 0.9).setOrigin(0);

        const summonCircle = this.add.sprite(
            detailsBox.x + detailsBox.displayWidth/2,
            detailsBox.y+ detailsBox.displayHeight/2 - paddingX,  
            'summoningCircle2'
        ).setOrigin(0.5).setScale(0.9).setAlpha(0.7);

        this.detailsImage = this.add.sprite(
            detailsBox.x + detailsBox.displayWidth/2,
            detailsBox.y+ detailsBox.displayHeight - 1,
            `Alpha_alt`
        ).setOrigin(0.5,1).setInteractive().setData({ name: 'Alpha',fromBlockchain: false, properties: {type: 'card'}}); //TEST DATA TO REMOVE LATER
        
        const messageDetailsBox = this.add.rectangle(
            detailsBox.x  + paddingX/2,
            detailsBox.y + detailsBox.displayHeight - paddingX/2 - 110 ,
            detailsBox.displayWidth - paddingX,
            110, 0x000000,1).setStrokeStyle(0.5, 0xffffff,1).setOrigin(0);

        this.detailsText = this.add.text(messageDetailsBox.x + 10, messageDetailsBox.y + 10,
            'Alpha is a beast djinn ready to give a helping hand to any adventurer who summons him. He uses his arm-like tail to deal massive damage to his enemies. It is rummored that his eyes can locate hidden treasures and dungeons.',
                {fontFamily: 'Arial', align: 'justify'})
            .setOrigin(0)
            .setWordWrapWidth(messageDetailsBox.displayWidth-20, true);

        this.displayName = this.add.text(
            detailsBox.x + paddingX, detailsBox.y + paddingX, 
            'Alpha', 
            { fontFamily:'Arial', fontSize: 20, fontStyle: 'Bold Italic'} 
        ).setOrigin(0);

        this.rarity = this.add.sprite(
            this.displayName.x,
            this.displayName.y + this.displayName.displayHeight + paddingX/4,
            'rarity_1'
        ).setOrigin(0).setScale(0.2);

        this.attribute = this.add.sprite(
            detailsBox.x + detailsBox.displayWidth - paddingX,
            this.displayName.y,
            'fire'
        ).setOrigin(1,0).setScale(0.35).setName('fire');

        //Left Tab
        this.sizerLeft = new FixWidthSizer(this, {
            space: {
                left: 10,
                right: 10,
                bottom: 10,
                item: 10,
                line: 10
            }
        }).layout();
        this.add.existing(this.sizerLeft);

        this.loadCards();

        this.panelBox = new ScrollablePanel(this, {
            x: 0,
            y: 0,
            width: gameW* 0.4,
            height: gameH*0.745,
            scrollMode:0,
            background: this.add.rectangle(0,0, gameW* 0.4, gameH*0.745, 0x000000, 0.9),
            panel: {
                child: this.sizerLeft
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
        this.add.existing(this.panelBox);

        //Inventory Tabs
        this.tabs = new Tabs(this, {
            x: paddingX,
            y: gameH * 0.22 - paddingX*2 + 10,
            width: gameW* 0.4,
            height: gameH*0.745,
            panel: this.panelBox,
            topButtons: [
                this.add.rectangle(0, 0, paddingX*4, paddingX*2.1, 0x000000, 0.9 ).setOrigin(0.5,1).setScale(0.8),
                this.add.rectangle(0, 0, paddingX*4, paddingX*2.1, 0x23140a, 0.9 ).setOrigin(0.5,1).setScale(0.8),
                this.add.rectangle(0, 0, paddingX*4, paddingX*2.1, 0x23140a, 0.9 ).setOrigin(0.5,1).setScale(0.8)
            ]
        }).setOrigin(0).layout(); 

        this.tabs.getElement('topButtons').forEach((tab, index) => {
            tab.setStrokeStyle(2, 0x000000, 1);
            if(index == 0){
                this.cardIcon = this.add.sprite(tab.x, tab.y - tab.displayHeight/2 ,'cards_icon').setOrigin(0.5).setInteractive()
                    .on('pointerdown', () => this.tabs.emitButtonClick('top', 0));
            }
            else if(index == 1){
                this.backpackIcon = this.add.sprite(tab.x, tab.y - tab.displayHeight/2,'backpack_icon').setInteractive()
                    .on('pointerdown', () => this.tabs.emitButtonClick('top', 1));
            }
            else{
                this.magicIcon = this.add.sprite(tab.x, tab.y - tab.displayHeight/2 ,'magic_icon').setInteractive()
                    .on('pointerdown', () => this.tabs.emitButtonClick('top', 2));
            }

        });
        
        this.tabs.on('button.click', (button, groupName, index) => {
            let tabButtons = this.tabs.getElement('topButtons');

            tabButtons.forEach((button,indexButton) => {
                if(indexButton == index){
                    button.fillColor = 0x000000 ;
                }
                else{
                    button.fillColor = 0x23140a;
                }
            })

            this.sizerLeft.clear(true);

            if(index == 0){
                this.loadCards();
            }
            else if(index == 1){
                if(this.player.playerInfo.inventory.item.length >= 1){
                    let itemsInInventory = this.player.getAllItems();

                    itemsInInventory.forEach(item => {
                        this.generateItemUI(item);
                    })
                }
                else{
                    this.sizerLeft.add(this.add.text(0,0, 'No items acquired', {fontFamily: 'Arial', padding:10 }));
                }
            }
            else{
                if(this.player.playerInfo.inventory.skill.length >= 1){
                    let skillsInInventory = this.player.getAllSkills();

                    skillsInInventory.forEach(skill => {
                        this.generateItemUI(skill);
                    })
                }
                else{
                    this.sizerLeft.add(this.add.text(0,0, 'No available skills to learn', {fontFamily: 'Arial', padding:10 }));
                }
            }    

            this.panelBox.layout();
        });

        this.add.existing(this.tabs);
        

        let itemsOnTab = this.sizerLeft.getElement('items');

        //Stats Tabs
        this.sizerRight = new FixWidthSizer(this, {
            space: {
                item: 10,
                line: 10
            }
        }).layout();
        this.add.existing(this.sizerRight);

        this.panelBoxRight = new ScrollablePanel(this, {
            x: 0,
            y: 0,
            width: gameW* 0.4,
            height: gameH*0.745,
            scrollMode:0,
            background: this.add.rectangle(0,0, gameW* 0.4, gameH*0.745, 0x000000, 0.9),
            panel: {
                child: this.sizerRight
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

        this.sizerRight.add(statsTitle);

        this.tabsRight = new Tabs(this, {
            x: gameW,
            y: gameH * 0.22 - paddingX*2 + 10,
            width: gameW* 0.4,
            panel: this.panelBoxRight,
            space:{
                topButtonsOffset:  (gameW*0.4) - paddingX*9.6
            },
            topButtons: [
                this.add.rectangle(0, 0, paddingX*4, paddingX*2.1, 0x000000, 0.95 ).setOrigin(0,1).setScale(0.8).setDepth(11),
                this.add.rectangle(0, 0, paddingX*4, paddingX*2.1, 0x23140a, 0.95 ).setOrigin(0,1).setScale(0.8).setDepth(11),
                this.add.rectangle(0, 0, paddingX*4, paddingX*2.1, 0x23140a, 0.95 ).setOrigin(0,1).setScale(0.8).setDepth(11),
            ]
        }).setOrigin(0).layout();

        
        this.tabsRight.getElement('topButtons').forEach((tab, index) => {
            tab.setStrokeStyle(2, 0x000000, 0.9);
            if(index == 0){
                this.statsIcon = this.add.sprite(tab.x + tab.displayWidth/2, tab.y - tab.displayHeight/2 ,'stats_icon').setOrigin(0.5).setDepth(11);
            }
            else if(index == 1){
                this.skillIcon = this.add.sprite(tab.x + tab.displayWidth/2, tab.y - tab.displayHeight/2,'magic_icon').setOrigin(0.5).setDepth(11);
            }
            else{
                this.cartIcon = this.add.sprite(tab.x + tab.displayWidth/2, tab.y - tab.displayHeight/2 ,'cart_icon').setOrigin(0.5).setDepth(11);
            }

        });

        this.tabsRight.on('button.click', async(button, groupName, index) => {
            let tabButtonsRight = this.tabsRight.getElement('topButtons');

            tabButtonsRight.forEach((button,indexButton) => {
                if(indexButton == index){
                    button.fillColor = 0x000000 ;
                }
                else{
                    button.fillColor = 0x23140a;
                }
            });

            this.sizerRight.clear(true);
            this.panelBoxRight.layout();

            if(index == 0){
                let stat = cardStats.filter(data => data.name == this.detailsImage.data.list.name)[0];
                let { health, attack, defence, speed, critRate, critDamage, evasion, accuracy, cooldownReduction } = stat;

                let statBonuses = this.getStatBonuses(this.detailsImage.data.list);

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
    
                this.sizerRight.add(statsTitle, { padding : { right: gameW *0.2, bottom: 10 } });
                this.sizerRight.add(statDetails);
            }
            else if(index == 1){
                let { skill } = this.player.playerInfo.inventory;

                if(skill.length >=1){
                    let cardSkills = skill.filter(item => item.equipped.includes(this.detailsImage.data.list.name));
                    if(cardSkills.length >= 1){
                        cardSkills.forEach(item => {
                            this[`skillSizer_${item.name}`] = new OverlapSizer(this,0,0,this.panelBox.width - (paddingX*2), 121, {space:0}).setOrigin(0,0);
                            this.add.existing(this[`skillSizer_${item.name}`]);

                            let itemName = this.add.rexTagText(0,0, `<style='fontStyle:bold'>${item.name}</style>`, {
                                fontFamily: 'Arial',
                                lineSpacing: 9
                            });

                            let itemDescription = this.add.text(0,0, `${item.description}${item.properties.type == 'item'? ` (Qty: ${item.quantity})` : ''}`, {
                                fontFamily: 'Arial',
                                align: 'justify',
                                fontSize: 14
                            }).setWordWrapWidth(this.panelBox.width * 0.52).setOrigin(0,1);

                            let itemImage = this.add.sprite(0, 0, item.name).setScale(0.7).setOrigin(0);

                            let itemContainerBox = this.add.rexRoundRectangle(0,0,this.panelBox.width - (paddingX*2),121, 5, 0x000000, 0).setStrokeStyle(1,0xffffff,1).setInteractive();
                            let attribute  = this.add.sprite(0, 0, item.properties.attribute[0]).setScale(0.15).setOrigin(0.5);
                        
                            this[`skillSizer_${item.name}`]                               
                            .add(itemContainerBox, {key: 'skillContainer', expand: false})
                            .add(itemImage, { key: 'skillImage', expand:false, align: 'left-top', padding: { left: 15, top: 15 }})
                            .add(itemName, {key: 'skillName', expand:false, align: 'left-top', padding: { left: 120, top: 15 }})
                            .add(itemDescription, { key: 'skillDescription', expand:false, align: 'left-bottom', padding: { left: 120, bottom: 15}})
                            .add( attribute, { key: 'skillAttribute',expand:false, align: 'left-top', padding: { left: 125 + itemName.displayWidth, top: 15 }})
                            .layout();

                            this.sizerRight.add(this[`skillSizer_${item.name}`])
                        });
                    }
                    else{
                        this.sizerRight.add(this.add.text(0,0, 'No skills equipped', {fontFamily: 'Arial'}));
                    }
                }
                else{
                    this.sizerRight.add(this.add.text(0,0, 'No skills equipped', {fontFamily: 'Arial'}));
                }

            }
            else{
                if(this.detailsImage.data.list.fromBlockchain){    
                    try{
                        let loading = this.add.text(0,0, 'Loading Data.. Please wait...', { fontFamily: 'Arial', padding:10 })
                        this.sizerRight.add(loading).layout();
                        this.allUiGroup.add(loading);
                        let cartItems = await this.player.getCardSaleStatus(this.detailsImage.data.list.id);
                        this.sizerRight.clear(true);
    
                        let { orderId, price, quantityOnSale, itemOnHand } = cartItems;    
                        
                        if(!itemOnHand){
                            this.scene.restart();
                        }
                        else{   
                            this.salesSizer = new OverlapSizer(this,0,0,this.panelBoxRight.width - (paddingX*2),100, {space:0}).setOrigin(0,0);
                            this.add.existing(this.salesSizer);
        
                            this.salesSizer                                
                                .add(this.add.rexRoundRectangle(0,0,this.panelBoxRight.width - (paddingX*2),100, 5, 0x000000, 0).setStrokeStyle(1,0xffffff,1), {key: 'salesBox',expand: false})
                                .add(this.add.text(0,0, [
                                    `Item on hand : ${itemOnHand}`,
                                    `Item on sale : ${quantityOnSale}`,
                                    `Price : ${price > 0? `${price.toFixed(6)} ETH` : 'N/A'}`,
                                ], {fontFamily: 'Arial', lineSpacing:5 }), {key: 'details', expand:false, align: 'left-center', padding: { left: 20 }})
                                .add(this.add.sprite(0,0,'sellButton').setScale(0.8).setInteractive(), {key: 'sellButton', expand:false, align: 'right-center', padding: { right: 20 }})
                                .layout();
                            
                            this.sizerRight.add(this.salesSizer);  
        
                            let { sellButton } = this.salesSizer.getElement('items');
        
                            sellButton.setTexture(quantityOnSale?'cancelButton': 'sellButton');
        
                            sellButton.on('pointerdown',() => {
                                this.sound.play('clickEffect', {loop: false});
                                if(quantityOnSale >= 1){
                                    const cancelSaleGroup = this.add.group();
        
                                    const cancelMessage = this.add.text(
                                        gameW/2,
                                        gameH/2 -25,
                                        "Are you sure you want to cancel this item's on-going sale?",
                                        {fontFamily: 'Arial', color:'#613e1e', align: 'center'}
                                    ).setOrigin(0.5).setWordWrapWidth(200).setScale(0,1.3);
        
                                    const cancelConfirmButton = this.add.sprite(
                                        cancelMessage.x - 10,
                                        cancelMessage.y + 50,
                                        'confirmButtonAlt'
                                    ).setOrigin(1,0).setInteractive().setScale(0,1.3);
        
                                    const cancelButton = this.add.sprite(
                                        cancelMessage.x + 10,
                                        cancelMessage.y + 50,
                                        'cancelButtonAlt'
                                    ).setOrigin(0).setInteractive().setScale(0,1.3);
        
                                    cancelButton.on("pointerdown", () => {
                                        this.sound.play('clickEffect', {loop: false});
                                        this.popupContainer.destroy(true);
                                    });
        
                                    cancelConfirmButton.on('pointerdown', async () => {
                                        cancelConfirmButton.setAlpha(0.6);
                                        this.sound.play('clickEffect', {loop: false});
                                        cancelConfirmButton.disableInteractive();
                                        try{
                                            await this.player.cancelSale(orderId);
                                            
                                        }
                                        catch(e){
                                            console.log(e.message);
                                        }
        
                                        cancelConfirmButton.setInteractive();                                   
                                        this.popupContainer.destroy(true);
                                        this.tabsRight.emitButtonClick('top', 2);
        
                                    });
        
                                    cancelConfirmButton.on("pointerup", () => {
                                        cancelConfirmButton.setAlpha(1);
                                    })
        
                                    cancelSaleGroup.addMultiple([cancelMessage, cancelConfirmButton, cancelButton]);
        
                                    this.popUp('Cancel Sale',cancelSaleGroup);
                                }
                                else{
                                    this.sellItemPopUp(itemOnHand, this.detailsImage.data.list.id, true, null, null, 'item');
                                }
                            })
                        }
    
                    }
                    catch(e){
                        console.log(e.message);
                    }                    
                }
                else{
                    this.sizerRight.add(this.add.text(0,0, 'This item cannot be sold in the marketplace', {fontFamily: 'Arial'}));
                }           
            }

            this.panelBoxRight.layout();

            let sizerChildren = this.sizerLeft.getElement('items');
            let sizerChildrenRight = this.sizerRight.getElement('items');

            this.allUiGroup.add(sizerChildren);
            this.allUiGroup.add(sizerChildrenRight);

            if(this.salesSizer){              
                let saleItem = this.salesSizer.getElement('items');
                if(saleItem){
                    this.allUiGroup.add([saleItem.details, saleItem.salesBox, saleItem.sellButton]);
                }                              
            }

            this.player.playerInfo.inventory.skill.forEach(skill => {
                if(this[`skillSizer_${skill.name}`]){              
                    let skillItem = this[`skillSizer_${skill.name}`].getElement('items');
                    if(skillItem){
                        this.allUiGroup.add([
                            skillItem.skillContainer, 
                            skillItem.skillName, 
                            skillItem.skillImage,
                            skillItem.skillAttribute,
                            skillItem.skillDescription,
                        ]);
                    }                              
                }
            })

        });

        this.add.existing(this.tabsRight);

        this.tweens.add({
            targets: this.detailsImage,
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

        this.allUiGroup.add([this.panelBox.getElement('background'), this.panelBox.getElement('slider.track'), this.panelBox.getElement('slider.thumb')]);
        this.allUiGroup.add(this.tabs.getElement('topButtons'));
        this.allUiGroup.add([
            this.magicIcon, this.backpackIcon, this.cardIcon,
            detailsBox, summonCircle, this.displayName, this.rarity, this.attribute, this.detailsImage, messageDetailsBox, this.detailsText
        ]);

        this.allUiGroup.add(this.tabsRight.getElement('topButtons'));
        this.allUiGroup.add([this.panelBoxRight.getElement('background'), this.panelBoxRight.getElement('slider.track'), this.panelBoxRight.getElement('slider.thumb')]);
        this.allUiGroup.add([
            this.statsIcon, this.skillIcon, this.cartIcon
        ]);

        this.detailsImageToggle = false;

        this.detailsImage.on('pointerdown', () => {
            this.tabsRight.emitButtonClick('top', 0);
            
            if(this.detailsImage.data.list.properties.type == "card"){
                this.slideEffect(-(this.tabs.width + paddingX));
            }
        });

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

    generateItemUI(item, isRight){
        const gameW = this.game.config.width;
        const paddingX = gameW * 0.025;

        let itemSizer = new OverlapSizer(this,0,0,this.panelBox.width - (paddingX*2.5), 121, {space:0}).setOrigin(0,0);
        this.add.existing(itemSizer);

        let itemName = this.add.rexTagText(0,0, `<style='fontStyle:bold'>${item.name}</style>`, {
            fontFamily: 'Arial',
            lineSpacing: 9
        });

        let itemDescription = this.add.text(0,0, `${item.description}${item.properties.type == 'item'? ` (Qty: ${item.quantity})` : ''}`, {
            fontFamily: 'Arial',
            align: 'justify',
            fontSize: 14
        }).setWordWrapWidth(this.panelBox.width * 0.52).setOrigin(0,1);

        let itemImage = this.add.sprite(0, 0, item.name).setScale(0.7).setOrigin(0);

        let itemContainerBox = this.add.rexRoundRectangle(0,0,this.panelBox.width - (paddingX*2.5),121, 5, 0x000000, 0).setStrokeStyle(1,0xffffff,1).setInteractive();

        let itemSellButton = this.add.sprite(0,0,'sellButton').setScale(0.65).setInteractive().setAlpha(0).setDepth(10)
            .on('pointerdown', () => {
                this.sound.play('clickEffect', {loop: false}); 
                this.sellItemPopUp(item.quantity, item.itemId, item.fromBlockchain, item.price, item.priceCurrency, item.properties.type);   
            })
            .on('pointerover', () => {
                itemImage.setAlpha(0.5);
                itemSellButton.setAlpha(1);
                itemEquipButton.setAlpha(1);    
            });

        let itemEquipped, equipped;

        if(item.properties.type == 'skill'){
            itemEquipped = this.player.playerInfo.inventory.skill.filter(skill => skill.name == item.name)[0];
            equipped = itemEquipped.equipped.some(data => data == this.detailsImage.data.list.name);
        }

        let itemEquipButton = this.add.sprite(-50,-50, equipped? 'unequipButton' : 'equipButton').setScale(0.65).setInteractive().setAlpha(0).setDepth(10)
            .on('pointerdown', async() => {
                itemEquipButton.disableInteractive();
                this.sound.play('clickEffect', {loop: false});
                if(this.attribute.name == item.properties.attribute[0]){
                    let itemToEquip = this.player.playerInfo.inventory.skill.filter(skill => skill.name == item.name)[0];
                    let remainingSkill = this.player.playerInfo.inventory.skill.filter(skill => skill.name != item.name);
                    let isEquipped = itemToEquip.equipped.some(data => data == this.detailsImage.data.list.name);

                    if(isEquipped){
                        let removeNameFromEquipped = itemToEquip.equipped.filter(name => name != this.detailsImage.data.list.name);                       
                        itemToEquip.equipped = removeNameFromEquipped;
                    }
                    else{
                        itemToEquip.equipped.push(this.detailsImage.data.list.name);
                    } 

                    remainingSkill.push(itemToEquip);
                    this.player.playerInfo.inventory.skill = remainingSkill.sort((a, b) => (a.itemId - b.itemId));
                    itemEquipButton.setTexture(isEquipped? 'equipButton' : 'unequipButton');

                    itemEquipButton.setInteractive();
                }
                else{
                    this.popUpAlert('Skill Incompatible', `Unable to equip a ${item.properties.attribute[0]}-type skill to a ${this.attribute.name} attribute djinn.` )
                }    
            })
            .on('pointerover', () => {
                itemImage.setAlpha(0.5);
                itemSellButton.setAlpha(1);
                if(item.properties.type == 'skill'){
                    itemEquipButton.setAlpha(1);
                }  
            }).on('pointerout', () => {
                itemImage.setAlpha(1);
                itemSellButton.setAlpha(0);
                if(item.properties.type == 'skill'){
                    itemEquipButton.setAlpha(0);
                } 
            });

        itemContainerBox.on('pointerover', () => {
            itemImage.setAlpha(0.5);
            itemSellButton.setAlpha(1)
            if(item.properties.type == 'skill'){
                itemEquipButton.setAlpha(1);
            } 
        })

        itemContainerBox.on('pointerout', () => {
            itemImage.setAlpha(1);
            itemSellButton.setAlpha(0);
            if(item.properties.type == 'skill'){
                itemEquipButton.setAlpha(0);
            } 
        })

        itemSizer                               
        .add(itemContainerBox, {key : `container_${item.name}`, expand: false})
        .add(itemImage, { expand:false, align: 'left-top', padding: { left: 15, top: 15 }})
        .add(itemName, { expand:false, align: 'left-top', padding: { left: 120, top: 15 }})
        .add(itemDescription, { expand:false, align: 'left-bottom', padding: { left: 120, bottom: 15}})
        .add(itemSellButton, {
            expand:false, 
            align: item.properties.type == 'skill' ? 'left-top' : 'left-center', 
            padding: { left: 18, top: item.properties.type == 'skill' ? 30 : 0 }})
        .layout();


        this.allUiGroup.add([ itemImage, itemName, itemDescription, itemSellButton]);
        this.allUiGroup.addAt(itemContainerBox, 2);

        if(item.properties.type == 'skill'){
            let attribute  = this.add.sprite(0, 0, item.properties.attribute[0]).setScale(0.15).setOrigin(0.5);

            itemSizer
            .add(itemEquipButton, {expand:false, align: 'left-bottom', padding: { left: 18, bottom:30 }})
            .add( attribute, { expand:false, align: 'left-top', padding: { left: 125 + itemName.displayWidth, top: 15 }}).layout();

            this.allUiGroup.add([itemEquipButton, attribute]);
        }

        this.sizerLeft.add(itemSizer);
    }

    sellItemPopUp = async(itemOnHand, itemId, fromBlockchain, itemPrice, itemCurrency, itemType) => {
        const sellItemGroup = this.add.group();

        let quantity = 1;
        let price = fromBlockchain? 0.00001 : (itemPrice*0.2).toFixed(0);

        //Quantity of item to be sold
        const sellquantity = this.add.rexInputText(
            this.game.config.width/2,
            this.game.config.height/2 - 50,
            215,
            25,
            { 
                type: "number",
                maxLength: 2,
                fontSize : "17px",
                fontFamily: 'Arial',
                backgroundColor : "white",
                color: "black",
            }
        ).setOrigin(0.5).setScale(1.3)
        .on('textchange', inputText => {
            let allowedKey = /^[1-9]\d*$/g;
            let wholeNumbersOnly = new RegExp(allowedKey);

            let inputValue = Number(inputText.text);

            if(wholeNumbersOnly.test(inputValue) && inputValue <= itemOnHand ){
                quantity = inputValue;
                if(!fromBlockchain){
                    price = (itemPrice*0.2) * quantity;
                    sellingPrice.setText(price);
                }
            }
            else{
                sellquantity.setText("");
                quantity = 1;
                if(!fromBlockchain){
                    price = (itemPrice*0.2);
                    sellingPrice.setText(price);
                }
            }

        });

        sellquantity.setText(quantity);
        sellquantity.setStyle("border-radius", "5px");
        sellquantity.setStyle("text-align", "center");

        //Price of item to be sold
        const sellingPrice = this.add.rexInputText(
            this.game.config.width/2,
            this.game.config.height/2 + 35,
            215,
            25,
            { 
                type: "number",
                maxLength: 2,
                fontSize : "17px",
                fontFamily: 'Arial',
                backgroundColor : "white",
                color: "black",
            }
        ).setOrigin(0.5).setScale(1.3)
        .on('textchange', async(inputText) => {

            let inputPrice = Number(inputText.text);
            inputPrice = fromBlockchain? inputPrice.toFixed(5) : inputPrice.toFixed(0);

            price = inputPrice? inputPrice: 0.00001;

            //Get ETH current price in usd
            if(fromBlockchain){
                try{
                    let response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum');
                    let ethData = await response.json();
                    let { current_price } = ethData[0];

                    let priceInUsd = price * current_price;
        
                    priceText.setText(`Price per item - ETH ($${priceInUsd.toFixed(2)})`);
                }
                catch(e){
                    console.log(e.message);
                }
            }
        });

        sellingPrice.setText(price);
        sellingPrice.setStyle("border-radius", "5px");
        sellingPrice.setStyle("text-align", "center");

        let quantityInput = document.querySelector('input');
        quantityInput.max = itemOnHand;
        quantityInput.min = 1;

        let priceInput = document.querySelectorAll('input')[1];
        priceInput.disabled = !fromBlockchain;
        priceInput.min = fromBlockchain? 0.00001 : 1;
        priceInput.step = fromBlockchain? 0.00001: 1;
        priceInput.onkeydown = function(e){
            if(e.key == '-' || e.key == 'e' ||  e.key == '+'){
                return false;
            }
        }

        //input title
        let quantityText = this.add.text(
            sellquantity.x - sellquantity.displayWidth*0.65,
            sellquantity.y - sellquantity.displayHeight,
            'Quantity',
            {fontFamily: 'Arial', fontSize: 14}
        ).setOrigin(0,1);

        let priceText = this.add.text(
            sellingPrice.x - sellingPrice.displayWidth*0.65,
            sellingPrice.y - sellingPrice.displayHeight,
            `${fromBlockchain? 'Price per item' : 'Total Price'} - ${fromBlockchain? 'ETH ($0.00)' : itemCurrency.toUpperCase()}`,
            {fontFamily: 'Arial', fontSize: 14}
        ).setOrigin(0,1);

        let sellcancelButton = this.add.sprite(
            sellingPrice.x + 10,
            sellingPrice.y + sellingPrice.displayHeight + 35,
            'cancelButton'
        ).setOrigin(0).setInteractive();

        let sellOkButton = this.add.sprite(
            sellingPrice.x -10,
            sellingPrice.y + sellingPrice.displayHeight + 35,
            'confirmButton'
        ).setOrigin(1,0).setInteractive();

        sellcancelButton.on('pointerdown', () => {
            this.sound.play('clickEffect', {loop: false});
            this.formPopupContainer.destroy(true);
        })

        sellOkButton.on("pointerdown", async() => {
            sellOkButton.setAlpha(0.6);
            sellquantity.setText(quantity);
            sellingPrice.setText(price);
            this.sound.play('clickEffect', {loop: false});
            sellOkButton.disableInteractive();

            if(fromBlockchain){
                 try{
                     await this.player.sellItem(itemId, price, quantity);
                }
                catch(e){
                    alert(e.message);
                }               
            }
            else{
                await this.player.sellInGameItems(itemId, quantity, price, itemCurrency, itemType);
                this[`${itemCurrency}_value`].setText(this.player.playerInfo[itemCurrency]);
            }

            sellOkButton.setInteractive();
            this.formPopupContainer.destroy(true);

            if(!itemCurrency){
                this.tabsRight.emitButtonClick('top', 2);
            }
            else{
                this.tabs.emitButtonClick('top', itemType == 'skill'? 2 : 1);
            }
        });

        sellOkButton.on("pointerup", () => {
            sellOkButton.setAlpha(1);
        })
        
        sellItemGroup.addMultiple([sellquantity, sellingPrice, quantityText, priceText, sellOkButton, sellcancelButton]);

        this.formPopUp(`Sell ${itemType}`,sellItemGroup);

        if(fromBlockchain){
            try{
                let data = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum');
                let ethData = await data.json();
                let { current_price } = ethData[0];
                let priceInUsd = price * current_price;
        
                priceText.setText(priceInUsd? `Price per item - ETH ($${priceInUsd.toFixed(2)})` : 'Price per item - ETH ($0.00)');
            }
            catch(e){
                console.log(e.message);
            }
        }
    }

    async loadCards(){
        let cardData = [];
        let { cards, address } = this.player.playerInfo;

        this.sizerLeft.add(
            this.add.text(0,0, 'Loading Data.. Please wait...', { fontFamily: 'Arial', padding:10 }).setDepth(10)
        );
        
        cardData = cards? cards.filter(card => card.name === "Alpha") : [];
        let cardsTotal = [...cardData];

        let blockchainCards = await this.player.getCards(address);

        this.sizerLeft.removeAll(true);

        if(blockchainCards){
            cardsTotal = [...cardData].concat(blockchainCards);           
            cardsTotal.sort((a, b) => (b.properties.rarity - a.properties.rarity));

            this.player.playerInfo.cards = cardsTotal;
        }

        if(this.player.playerInfo.cards.length >= 1){
            this.player.playerInfo.cards.forEach((item, index) => {
                if(index == 0){
                    this.setImageData(item);                 
                }
     
                this.sizerLeft.add(
                    this.add.sprite(0, 0, item.name).setScale(0.35).setOrigin(0).setDepth(10).setInteractive().setData(item)
                        .on('pointerdown', () => {this.setImageData(item);})
                );
            })
        }
        else{
            this.sizerLeft.add(
                this.add.text(0,0, 'No cards available in your inventory', { fontFamily: 'Arial', padding:10 }).setDepth(10)
            );            
        }


        this.panelBox.layout();
    }

    setImageData = (item) => {
        this.detailsText.setText(item.description); 
        this.detailsImage.setTexture(`${item.name}_alt`).setData(item);
        this.displayName.setText(item.name).setName(item.name);
        this.rarity.setTexture(`rarity_${item.properties.rarity}`);
        this.attribute.setTexture(item.properties.attribute).setName(item.properties.attribute);      
    }
}

export default CharacterInventory;