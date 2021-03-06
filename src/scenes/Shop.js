import 'regenerator-runtime/runtime';
import BaseScene from '../plugins/BaseScene';
import {  Tabs, ScrollablePanel, FixWidthSizer, OverlapSizer } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { getSoundSettings, shortenLargeNumber } from '../js/utils';
import UpperUi from '../components/upperUI';

class Shop extends BaseScene {

    create(){
        this.generateBg();

        this.itemsOnSale=[];
        this.utilitiesOnSale=[];
        this.skillsOnSale=[];
        this.currentTab = "skill";
        this.currencySelected = 'gold';
        this.toggleList = true;
        this.currentPage = 1;

        this.upper = new UpperUi(this);
        this.add.existing(this.upper);
        this.upper.generate(true);

        this.generatePaginationUI();

        //Market UI
        this.shopSizer = new FixWidthSizer(this, {
            space: {
                left: 10,
                right: 10,
                bottom: 10,
                item: 10,
                line: 10
            }
        });
        this.add.existing(this.shopSizer);

        this.shopSizer.layout();
        this.searchBox();
        this.thumbnailChanger();

        this.panelBox = new ScrollablePanel(this, {
            x: 0,
            y: 0,
            width: this.gameW - this.paddingX*4.5,
            height: this.gameH*0.78,
            scrollMode:0,
            background: this.add.rectangle(0,0, this.gameW - this.paddingX*2, this.gameH*0.745, 0x000000, 0.9),
            panel: {
                child: this.shopSizer
            },
            space:{
                left: 10,
                right: 20,
                top: 20,
                bottom: 45,
            },
            slider: {
                track: this.add.rexRoundRectangle(0, 0, 10, this.gameH*0.745, 4.5, 0x000000, 0.9).setStrokeStyle(0.5, 0xffffff, 0.8),
                thumb: this.add.rexRoundRectangle(0, 0, 10, this.paddingX*4, 4.5, 0xffffff, 0.8).setAlpha(0.5),
                input: 'drag',
                position: 'right',
            },
        }).setOrigin(0).layout();
        this.add.existing(this.panelBox);

        //Inventory Tabs
        this.tabs = new Tabs(this, {
            x: this.paddingX,
            y: this.gameH * 0.22 - this.paddingX*2 + 10,
            width: this.gameW - this.paddingX*4.5,
            height: this.gameH*0.78,
            panel: this.panelBox,
            topButtons: [
                this.add.rectangle(0, 0, this.paddingX*4, this.paddingX*2.1, 0x000000, 0.9 ).setOrigin(0.5,1).setScale(0.8),
                this.add.rectangle(0, 0, this.paddingX*4, this.paddingX*2.1, 0x23140a, 0.9 ).setOrigin(0.5,1).setScale(0.8),
            ],
            leftButtons:[
                this.add.rectangle(0, 0, this.paddingX*3, this.paddingX*3, 0x000000, 0.9 ).setOrigin(0.5,1).setScale(0.8),
                this.add.rectangle(0, 0, this.paddingX*3, this.paddingX*3, 0x23140a, 0.9 ).setOrigin(0.5,1).setScale(0.8),
                this.add.rectangle(0, 0, this.paddingX*3, this.paddingX*3, 0x23140a, 0.9 ).setOrigin(0.5,1).setScale(0.8),
                this.add.rectangle(0, 0, this.paddingX*3, this.paddingX*3, 0x23140a, 0.9 ).setOrigin(0.5,1).setScale(0.8),
            ]
        }).setOrigin(0).layout();

        this.tabs.getElement('topButtons').forEach((tab, index) => {
            tab.setStrokeStyle(2, 0x000000, 1);
            if(index == 0){
                this.magicIcon = this.add.sprite(tab.x, tab.y - tab.displayHeight/2 ,'magic_icon').setOrigin(0.5);
            }
            else {
                this.backpackIcon = this.add.sprite(tab.x, tab.y - tab.displayHeight/2,'backpack_icon').setOrigin(0.5);
            }

        });

        this.tabs.getElement('leftButtons').forEach((tab, index) => {
            tab.setStrokeStyle(2, 0x000000, 1);
            if(index == 0){
                this.goldIcon = this.add.sprite(tab.x, tab.y - tab.displayHeight/2 ,'gold').setOrigin(0.5).setScale(0.7);
            }
            else if(index == 1){
                this.gemsIcon = this.add.sprite(tab.x, tab.y - tab.displayHeight/2 ,'gems').setOrigin(0.5).setScale(0.8);
            }
            else if(index == 2){
                this.ethIcon = this.add.sprite(tab.x, tab.y - tab.displayHeight/2 ,'eth').setOrigin(0.5).setScale(1.4);
            }
            else {
                this.rewardsIcon = this.add.sprite(tab.x, tab.y - tab.displayHeight/2,'gift_button').setOrigin(0.5).setScale(0.6);
            }

        });
        
        this.tabs.on('button.click', (button, groupName, index) => {
            let tabButtonsTop = this.tabs.getElement('topButtons');
            let tabButtonsLeft = this.tabs.getElement('leftButtons');


            if(groupName == 'top'){
                tabButtonsTop.forEach((button,indexButton) => {
                    if(indexButton == index){
                        button.fillColor = 0x000000 ;
                    }
                    else{
                        button.fillColor = 0x23140a;
                    }
                })
            } 

            else{
                tabButtonsLeft.forEach((button,indexButton) => {
                    if(indexButton == index){
                        button.fillColor = 0x000000 ;
                    }
                    else{
                        button.fillColor = 0x23140a;
                    }
                })
            }

            this.shopSizer.clear(true);

            this.shopSizer.removeAll(true);
            this.currentPage = 1;

            if(index == 0 && groupName == 'top'){
                this.currentTab = 'skill';                
            }
            else if(index == 1 && groupName == 'top'){
                this.currentTab = 'item';                
            }
            else if(index == 0 && groupName == 'left'){
                this.currencySelected = 'gold';                
            }
            else if(index == 1 && groupName == 'left'){
                this.currencySelected = 'gems';                
            }
            else if(index == 2 && groupName == 'left'){
                this.currencySelected = 'eth';                
            }
            else if(index == 3 && groupName == 'left'){
                this.currencySelected = 'rewards';                
            }
            else{
                this.currentTab = 'item';
            } 

            this.loadNFTMarketplace(this.currentTab);
            this.panelBox.layout(0.2);
        });

        this.add.existing(this.tabs);

        this.loadNFTMarketplace(this.currentTab);       
    }

    async loadNFTMarketplace(category){
        this.shopSizer.add(
            this.add.text(0,0, 'Loading NFT marketplace.. Please wait...', {fontFamily: 'GameTextFont'}).setDepth(10)
        );
 
        this.itemsOnSale = this.player.getShopItems(category);

        this.itemsOnSaleFiltered = this.itemsOnSale.filter(item => item.priceCurrency == this.currencySelected);

        this.shopSizer.removeAll(true);

        if(category == 'item'){
            this.utilitiesOnSale = this.itemsOnSaleFiltered.filter(item => item.properties.type == category);
            if(this.utilitiesOnSale.length >= 1){

                this.paginate(this.utilitiesOnSale);
            }
            else{
                this.shopSizer.add(
                    this.add.text(0,0, `There is no available ${category} that can be bought using ${this.currencySelected} at the moment`, {fontFamily: 'GameTextFont'}).setDepth(10)
                );
            }
        }
        else if(category == 'skill'){
            this.skillsOnSale = this.itemsOnSaleFiltered.filter(item => item.properties.type == category);
            if(this.skillsOnSale.length >= 1){

                this.paginate(this.skillsOnSale);
            }
            else{
                this.shopSizer.add(
                    this.add.text(0,0, `There is no available ${category} that can be bought using ${this.currencySelected} at the moment`, {fontFamily: 'GameTextFont'}).setDepth(10)
                );
            }
        }
        else{
            this.paginate(this.itemsOnSale);
        }

        this.panelBox.layout();
    }

    generatePaginationUI(){
        this.paginationSizer = new OverlapSizer(
            this, this.gameW/2, this.gameH - (this.gameW * 0.025),225, 45, {space:0}
        ).setOrigin(0.5);
        this.add.existing(this.paginationSizer); 

        this.paginationPageNumber = this.add.text(0,0, '1 of 1 Page', {fontFamily: 'GameTextFont'}).setDepth(12).setOrigin(0.5).setInteractive();
        let paginationFirstPage = this.add.sprite(0,0, 'fast_forward').setDepth(12).setInteractive();
        let paginationLastPage = this.add.sprite(0,0, 'fast_forward').setDepth(12).setInteractive();
        let paginationNextPage = this.add.sprite(0,0, 'forward_icon').setDepth(12).setInteractive();
        let paginationPreviousPage = this.add.sprite(0,0, 'forward_icon').setDepth(12).setInteractive();

        paginationFirstPage.flipX = true;
        paginationPreviousPage.flipX = true;

        this.paginationSizer
            .add(this.paginationPageNumber, {expand:false, align: 'center-center'})
            .add(paginationPreviousPage, {expand:false, align: 'left-center', padding:{left: 40}})
            .add(paginationFirstPage, { expand:false, align: 'left-center'})
            .add(paginationNextPage, {expand:false, align: 'right-center', padding:{right:40}})
            .add(paginationLastPage, {expand:false, align: 'right-center'})
            .layout();

        paginationFirstPage.on('pointerdown', () => {
            this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('hoverEffect')});
            this.firstPage();
        });
        paginationLastPage.on('pointerdown', () => {
            this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('hoverEffect')});
            this.lastPage();
        });
        paginationNextPage.on('pointerdown', () => {
            this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('hoverEffect')});
            this.nextPage();
        });
        paginationPreviousPage.on('pointerdown', () => {
            this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('hoverEffect')});
            this.prevPage();
        });
    }

    generateItemUI(item){
        if(this.toggleList){
            let itemOnSaleSizer = new OverlapSizer(this,0,0,this.panelBox.width - (this.paddingX*3), 170, {space:0}).setOrigin(0,0);
            this.add.existing(itemOnSaleSizer);

            let itemName = this.add.rexTagText(0,0, `<style='fontStyle:bold'>${item.name}</style>`, {
                fontFamily: 'GameTextFont',
                lineSpacing: 9
            });

            let itemPrice = this.add.text(0,0, `${item.price}`, {
                fontFamily: 'GameTextFont',
                lineSpacing: 9
            });

            let itemCurrency  = this.add.sprite(0, 0, item.priceCurrency)
                .setScale(item.priceCurrency =='gold'? 0.5: 0.6).setOrigin(0.5);

            let itemDescription = this.add.text(0,0, `${item.description}`, {
                fontFamily: 'GameTextFont',
                lineSpacing: 9,
                align: 'justify'
            }).setWordWrapWidth(this.panelBox.width * 0.55);

            itemOnSaleSizer                               
            .add(this.add.rexRoundRectangle(0,0,this.panelBox.width - (this.paddingX*3),170, 5, 0x000000, 0).setStrokeStyle(1,0xffffff,1), {key: 'salesBox',expand: false})
            .add(this.add.sprite(0, 0, item.name), { expand:false, align: 'left-center', padding: { left: 20}})
            .add(itemName, { expand:false, align: 'left-top', padding: { left: 170, top: this.paddingX*0.95 }})
            .add(itemDescription, { expand:false, align: 'left-center', padding: { left: 170}})
            .add(itemPrice, { expand:false, align: 'left-bottom', padding: { left: 170, bottom:this.paddingX*0.95}})
            .add(this.add.sprite(0,0,'buyButton').setScale(0.8).setInteractive()
                .on('pointerdown', () => {
                this.sound.play('clickEffect', {loop: false, volume: getSoundSettings('clickEffect')});    
                this.buyItemPopUp(item)
            }), {expand:false, align: 'right-center', padding: { right: 20 }})
            .add( itemCurrency, { expand:false, align: 'left-bottom', padding: { left: (item.priceCurrency =='gold'? 173: 165) + itemPrice.displayWidth, bottom: this.paddingX*0.85 }})
            .layout();



            if(item.properties.attribute){
                let attribute  = this.add.sprite(0, 0, item.properties.attribute[0]).setScale(0.2).setOrigin(0.5);

                itemOnSaleSizer
                .add( attribute, { expand:false, align: 'left-top', padding: { left: 175 + itemName.displayWidth, top: this.paddingX*0.85 }}).layout();
            }

            this.shopSizer.add(itemOnSaleSizer);         
        }
        else{
            let itemOnSaleSizer = new OverlapSizer(this,0,0, 140, 170, {space:0}).setOrigin(0,0);
            this.add.existing(itemOnSaleSizer);


            let priceButton = this.add.rexRoundRectangle(0,0, 110, 30, 5, 0x005500, 1).setInteractive()
                .on('pointerdown', () => {
                    this.sound.play('clickEffect', {loop: false, volume: getSoundSettings('clickEffect')});    
                    this.buyItemPopUp(item)
            });

            let itemPrice = this.add.text(0,0, `${item.price}    `, {fontFamily: 'GameTextFont', fontSize: 12}).setOrigin(0.5)
            let itemCurrency  = this.add.sprite(0, 0, item.priceCurrency)
                .setScale(item.priceCurrency =='gold'? 0.3: 0.4).setOrigin(0, 0.5);

           itemOnSaleSizer
            .add(this.add.sprite(0, 0, item.name).setScale(1.1), { expand:false, align: 'center-top'})
            .add(priceButton, { expand:{ width: true }, align: 'center-bottom'})
            .add(itemPrice, { expand:false , align: 'center-bottom', padding:{bottom: 7.5}})
            .add( itemCurrency, { 
                expand:false, 
                align: 'center-bottom', 
                padding: { 
                    left: itemPrice.displayWidth*(item.priceCurrency =='gold'? 0.8: 0.6),
                    bottom: item.priceCurrency =='gold'? 6: 4
                 }
            })
            .layout();

            this.shopSizer.add(itemOnSaleSizer); 
        }

        this.paginationPageNumber.setText(`${this.currentPage} of ${this.numberOfPages} ${this.numberOfPages >1? 'Pages' : 'Page'}`);      
    }

    searchBox(){       
        this.searchInput = this.add.rexInputText(
            this.gameW - this.paddingX - 4,
            this.gameH * 0.22 - this.paddingX,
            340,
            35,
            {
                fontSize : "17px",
                fontFamily: 'GameTextFont',
                backgroundColor : "black",
                color: "white",
                placeholder: "Search for name, attribute ...",
                border: 1,
                borderColor: "white",
                paddingLeft: "15px"
            }
        ).setOrigin(1,0.5)
        .on('textchange', (inputText) => {
            let searchOutput = [];

            let filter = inputText.text.toUpperCase();
            let itemToFilter = this.itemsOnSale.filter(item => item.properties.type == this.currentTab);

            for (let i = 0; i < itemToFilter.length; i++) {
                let { name, priceCurrency, properties } = itemToFilter[i];
                let { attribute } = properties;

                if (name.toUpperCase().indexOf(filter) > -1 || 
                    attribute.includes(inputText.text) || 
                    priceCurrency.toUpperCase() == filter) 
                {
                    searchOutput.push(itemToFilter[i])
                }
            }

            this.shopSizer.removeAll(true);

            if(searchOutput.length >= 1){
                if(this.currentTab == 'item'){
                    this.utilitiesOnSale = searchOutput.filter(item => item.priceCurrency == this.currencySelected);
                    this.paginate(this.utilitiesOnSale);
                }
                else{
                    this.skillsOnSale = searchOutput.filter(item => item.priceCurrency == this.currencySelected);
                    this.paginate(this.skillsOnSale);
                }

            }
            else{
                this.shopSizer.add(
                    this.add.text(0,0, 'No match found', {fontFamily: 'GameTextFont'}).setDepth(10)
                ); 
                this.panelBox.layout();               
            }

        })

        this.searchInput.setStyle("border-radius", "5px");
 
    }

    thumbnailChanger(){
        let thumbnail_icon_filter = this.add.sprite(this.searchInput.x - this.searchInput.displayWidth - 5, this.searchInput.y + 3,'square_icon')
            .setOrigin(1,0.5).setInteractive();
        this.list_icon_filter = this.add.sprite(thumbnail_icon_filter.x - thumbnail_icon_filter.displayWidth - 5, thumbnail_icon_filter.y, 'list_icon')
            .setOrigin(1,0.5).setInteractive();

        let icons = [thumbnail_icon_filter, this.list_icon_filter];

        icons.forEach(icon => {
            icon.on('pointerover', () => icon.setAlpha(0.7));
            icon.on('pointerout', () => icon.setAlpha(1));
        })

        thumbnail_icon_filter.on('pointerdown', () => {
            this.toggleList = false;
            this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('hoverEffect')});
            this.currentPage = 1;
            this.paginateOnTabs();
        })

        this.list_icon_filter.on('pointerdown', () => {
            this.toggleList = true;
            this.currentPage = 1;
            this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('hoverEffect')});
            this.paginateOnTabs();         
        })

    }

    paginate(data, currentPageNow){
         let numberOfItems = data.length;
         let numberPerPage = this.toggleList? 5 : 14;
         this.currentPage = currentPageNow || 1;
         this.numberOfPages = Math.ceil(numberOfItems/numberPerPage);

        const trimStart = (this.currentPage - 1) * numberPerPage;
        const trimEnd = trimStart + numberPerPage;

        let itemsOnDisplay = data.slice(trimStart, trimEnd);

        this.shopSizer.removeAll(true);

        itemsOnDisplay.forEach(item => {
            this.generateItemUI(item);
            this.panelBox.layout();
        });
    }

    nextPage(){
        if(this.numberOfPages && this.currentPage != this.numberOfPages){
            this.currentPage++;
            this.paginateOnTabs();
        }
    }

    prevPage(){
        if(this.currentPage > 1){
            this.currentPage--;
            this.paginateOnTabs();
        }
    }

    lastPage(){
        if(this.numberOfPages &&  this.currentPage != this.numberOfPages){
            this.currentPage = this.numberOfPages;
            this.paginateOnTabs();
        }
    }
    
    firstPage(){
        this.currentPage = 1;
        this.paginateOnTabs();
    }

    paginateOnTabs = () => {
        if(this.currentTab == 'item'){
            this.paginate(this.utilitiesOnSale, this.currentPage);
        }
        else{
            this.paginate(this.skillsOnSale, this.currentPage);
        }        
    }

    async buyItemPopUp(item){
        this.searchInput.setBlur();
        this.searchInput.setAlpha(0.3);

        const buyItemGroup = this.add.group();

        let quantity = 1;
        let price = item.price;

        //Quantity of item to be bought
        const buyQuantity = this.add.rexInputText(
            this.gameW/2,
            this.gameH/2 - 50,
            215,
            25,
            { 
                type: "number",
                maxLength: 2,
                fontSize : "17px",
                fontFamily: 'GameTextFont',
                backgroundColor : "white",
                color: "black",
            }
        ).setOrigin(0.5).setScale(1.3)
        .on('textchange', async(inputText) => {
            let allowedKey = /^[1-9]\d*$/g;
            let wholeNumbersOnly = new RegExp(allowedKey);

            let inputValue = Number(inputText.text);

            if(wholeNumbersOnly.test(inputValue) && inputValue <= 100 ){
                quantity = inputValue;                               
                price = item.price * quantity;

                buyingPrice.setText(price);
            }
            else{
                buyQuantity.setText("");
                quantity = 1;
                price = item.price;
                buyingPrice.setText(price);
            }
        });

        buyQuantity.setText(quantity);
        buyQuantity.setStyle("border-radius", "5px");
        buyQuantity.setStyle("text-align", "center");

        //Price of item to be bought
        const buyingPrice = this.add.rexInputText(
            this.gameW/2,
            this.gameH/2 + 35,
            215,
            25,
            { 
                type: "number",
                maxLength: 2,
                fontSize : "17px",
                fontFamily: 'GameTextFont',
                backgroundColor : "white",
                color: "black",
            }
        ).setOrigin(0.5).setScale(1.3);

        buyingPrice.setText(price);
        buyingPrice.setStyle("border-radius", "5px");
        buyingPrice.setStyle("text-align", "center");

        let quantityInput = document.querySelectorAll('input')[1];
        quantityInput.disabled = item.properties.type == 'skill'? true : false;
        quantityInput.max = item.properties.type == 'skill'? 1 : 100;
        quantityInput.min = 1;

        let priceInput = document.querySelectorAll('input')[2];
        priceInput.disabled = true;

        //input title
        let quantityText = this.add.text(
            buyQuantity.x - buyQuantity.displayWidth*0.65,
            buyQuantity.y - buyQuantity.displayHeight,
            'Quantity',
            {fontFamily: 'GameTextFont', fontSize: 14}
        ).setOrigin(0,1);

        let priceText = this.add.text(
            buyingPrice.x - buyingPrice.displayWidth*0.65,
            buyingPrice.y - buyingPrice.displayHeight,
            `Total Price in ${item.priceCurrency}`,
            {fontFamily: 'GameTextFont', fontSize: 14}
        ).setOrigin(0,1);

        let buycancelButton = this.add.sprite(
            buyingPrice.x + 10,
            buyingPrice.y + buyingPrice.displayHeight + 35,
            'cancelButton'
        ).setOrigin(0).setInteractive();

        let buyOkButton = this.add.sprite(
            buyingPrice.x -10,
            buyingPrice.y + buyingPrice.displayHeight + 35,
            'confirmButton'
        ).setOrigin(1,0).setInteractive();

        buycancelButton.on('pointerdown', () => {
            this.sound.play('clickEffect', {loop: false, volume: getSoundSettings('clickEffect')});
            this.searchInput.setAlpha(1);
            this.formPopupContainer.destroy(true);
        })

        buyOkButton.on("pointerdown", async() => {
            buyOkButton.setAlpha(0.6);
            buyQuantity.setText(quantity);
            buyingPrice.setText(price);
            this.sound.play('clickEffect', {loop: false, volume: getSoundSettings('clickEffect')});
            buyOkButton.disableInteractive();
            try{
                if(this.player.playerInfo[item.priceCurrency] >= price){                    
                    await this.player.buyItemOnShop(quantity, price, item);
                    this.upper[`${item.priceCurrency}_value`].setText(shortenLargeNumber(this.player.playerInfo[item.priceCurrency],2));
                    this.searchInput.setAlpha(1);
                }
                else{
                    this.popUpAlert(
                        `Insufficient ${item.priceCurrency}`, 
                        `You don't have enough ${item.priceCurrency} to buy ${item.name}. Please try again later.`,
                        this.searchInput
                    );
                }
            }
            catch(e){
                alert(e.message);
                this.searchInput.setAlpha(1);
            }

            buyOkButton.setInteractive();
            this.formPopupContainer.destroy(true);
        });

        buyOkButton.on("pointerup", () => {
            buyOkButton.setAlpha(1);
        })
        
        buyItemGroup.addMultiple([buyQuantity, buyingPrice, quantityText, priceText, buyOkButton, buycancelButton]);

        this.formPopUp(`Buy ${item.properties.type}`,buyItemGroup, null, null, null, this.searchInput);
    }
}

export default Shop;