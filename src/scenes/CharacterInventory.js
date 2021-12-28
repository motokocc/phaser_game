import 'regenerator-runtime/runtime';
import BaseScene from '../plugins/BaseScene';
import { Tabs, ScrollablePanel, FixWidthSizer, OverlapSizer } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
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
        ).setOrigin(0.5,1).setInteractive(); 
        
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
        ).setOrigin(1,0).setScale(0.35);

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
        let tabs = new Tabs(this, {
            x: paddingX,
            y: gameH * 0.22 - paddingX*2 + 10,
            width: gameW* 0.4,
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

            this.sizerLeft.clear(true);

            if(index == 0){
                this.player.playerInfo.cards.forEach((item, index) => {
                    this.sizerLeft.add(
                        this.add.sprite(0, 0, item.name).setScale(0.35).setOrigin(0).setDepth(10).setInteractive().setData(item)
                        .on('pointerdown', () => {
                            this.setImageData(item);   
                        })
                    );
                })
            }
            else if(index == 1){
                this.sizerLeft.add(this.add.text(0,0, 'No items acquired', {fontFamily: 'Arial'}));
            }
            else{
                this.sizerLeft.add(this.add.text(0,0, 'No available skills to learn', {fontFamily: 'Arial'}));
            }    

            this.panelBox.layout();
        });

        this.add.existing(tabs);
        

        let itemsOnTab = this.sizerLeft.getElement('items');

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

        this.tabsRight = new Tabs(this, {
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

        
        this.tabsRight.getElement('topButtons').forEach((tab, index) => {
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

            sizerRight.clear(true);
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
    
                sizerRight.add(statsTitle, { padding : { right: gameW *0.2, bottom: 10 } });
                sizerRight.add(statDetails);
            }
            else if(index == 1){
                sizerRight.add(this.add.text(0,0, 'No skills equipped', {fontFamily: 'Arial'}));
            }
            else{
                if(this.detailsImage.data.list.fromBlockchain){    
                    try{
                        let loading = this.add.text(0,0, 'Loading Data.. Please wait...', { fontFamily: 'Arial', padding:10 })
                        sizerRight.add(loading).layout();
                        this.allUiGroup.add(loading);
                        let cartItems = await this.player.getCardSaleStatus(this.detailsImage.data.list.id);
                        sizerRight.clear(true);
    
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
                            
                            sizerRight.add(this.salesSizer);  
        
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
                                    this.sellItemPopUp(itemOnHand, this.detailsImage.data.list.id);
                                }
                            })
                        }
    
                    }
                    catch(e){
                        console.log(e.message);
                    }                    
                }
                else{
                    sizerRight.add(this.add.text(0,0, 'This item cannot be sold in the marketplace', {fontFamily: 'Arial'}));
                }           
            }

            this.panelBoxRight.layout();

            let sizerChildren = this.sizerLeft.getElement('items');
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

        this.allUiGroup.add(tabs.getElement('topButtons'));
        this.allUiGroup.add([this.panelBox.getElement('background'), this.panelBox.getElement('slider.track'), this.panelBox.getElement('slider.thumb')]);
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
                this.slideEffect(-(tabs.width + paddingX));
            }
        });

        let backButton = this.add.sprite(gameW-paddingX, paddingX, 'exitIcon').setOrigin(1,0).setScale(0.6).setInteractive();
        backButton.on('pointerdown', () => this.scene.start("game"));

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

    sellItemPopUp = async(itemOnHand, itemId) => {
        const sellItemGroup = this.add.group();

        let quantity = 1;
        let price = 0.00001;

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
            }
            else{
                sellquantity.setText("");
                quantity = 1;
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

            let inputPrice = Number(inputText.text).toFixed(5);

            price = inputPrice? inputPrice: 0.00001;

            //Get ETH current price in usd
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

        });

        sellingPrice.setText(price);
        sellingPrice.setStyle("border-radius", "5px");
        sellingPrice.setStyle("text-align", "center");

        let quantityInput = document.querySelector('input');
        quantityInput.max = itemOnHand;
        quantityInput.min = 1;

        let priceInput = document.querySelectorAll('input')[1];
        priceInput.min = 0.00001;
        priceInput.step = 0.00001;
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
            'Price per item - ETH ($0.00)',
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
            try{
                 await this.player.sellItem(itemId, price, quantity);
            }
            catch(e){
                alert(e.message);
            }

            sellOkButton.setInteractive();
            this.formPopupContainer.destroy(true);
            this.tabsRight.emitButtonClick('top', 2);
        });

        sellOkButton.on("pointerup", () => {
            sellOkButton.setAlpha(1);
        })
        
        sellItemGroup.addMultiple([sellquantity, sellingPrice, quantityText, priceText, sellOkButton, sellcancelButton]);

        this.formPopUp('Sell item',sellItemGroup);

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

        this.player.playerInfo.cards.forEach((item, index) => {
            if(index == 0){
                this.setImageData(item);                 
            }
 
            this.sizerLeft.add(
                this.add.sprite(0, 0, item.name).setScale(0.35).setOrigin(0).setDepth(10).setInteractive().setData(item)
                    .on('pointerdown', () => {this.setImageData(item);})
            );
        })

        this.panelBox.layout();
    }

    setImageData = (item) => {
        this.detailsText.setText(item.description); 
        this.detailsImage.setTexture(`${item.name}_alt`).setData(item);
        this.displayName.setText(item.name);
        this.rarity.setTexture(`rarity_${item.properties.rarity}`);
        this.attribute.setTexture(item.properties.attribute);      
    }
}

export default CharacterInventory;