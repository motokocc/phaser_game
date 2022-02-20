import 'regenerator-runtime/runtime';
import BaseScene from '../plugins/BaseScene';
import { getSoundSettings } from '../js/utils';
import { ScrollablePanel, FixWidthSizer } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

class Explore extends BaseScene {

    create(){
        this.generateBg(true);

        //Left side ui
        let boxContainer = this.add.container(-this.gameW*0.3,0);
        let box = this.add.rectangle(0, 0, this.gameW*0.30, this.gameH, 0x000000, 0.95).setOrigin(0);
        let boxText = this.add.sprite(box.width/2, box.height/2, 'select_mode_text').setOrigin(0.5);
        boxContainer.add([box, boxText]);

        //Gameplay buttons
        let buttonX = box.width + (this.gameW - box.width)/2;
        let buttonXInitial = this.gameW + box.width;

        this.adventure_container = this.add.container();
        let adventureMode = this.add.sprite(buttonXInitial, this.gameH/2 - this.paddingX*0.6, 'adventure_mode_button')
            .setOrigin(0.5,1)
            .setName('adventure')
            .setState('enabled');
        this.adventure_container.add([adventureMode]);

        this.tower_container = this.add.container();
        let towerMode = this.add.sprite( buttonXInitial,this.gameH/2 + this.paddingX*0.6, 'tower_mode_button')
            .setOrigin(0.5,0)
            .setName('tower')
            .setState('disabled');
        this.tower_container.add([towerMode]);

        this.story_container = this.add.container();
        let storyMode = this.add.sprite(buttonXInitial, (adventureMode.y - adventureMode.displayHeight) - (this.paddingX*1.2), 'story_mode_button')
            .setOrigin(0.5,1)
            .setName('story')
            .setState('disabled');
        this.story_container.add([storyMode]);

        this.event_container = this.add.container();
        let eventMode = this.add.sprite(buttonXInitial, (towerMode.y +  towerMode.displayHeight) + (this.paddingX*1.2), 'event_mode_button')
            .setOrigin(0.5,0)
            .setName('event')
            .setState('disabled');
        this.event_container.add([eventMode]);

        //Team Setup cards
        this.card_1_container = this.add.container();
        let card_1 = this.add.sprite(buttonXInitial, this.gameH/2, 'cardSlot').setOrigin(0.5).setName('card_1')
           .setState(this.player.playerInfo.level >= 20? 1: 0);
        this.card_1_container.add([card_1]);

        this.card_2_container = this.add.container();
        let card_2 = this.add.sprite(buttonXInitial, this.gameH/2, 'cardSlot').setOrigin(0.5).setName('card_2')
            .setState(this.player.playerInfo.level >= 10? 1: 0);
        this.card_2_container.add([card_2]);

        let card_3 = this.add.sprite(buttonXInitial, this.gameH/2, 'cardSlot').setOrigin(0.5).setName('card_3')
            .setState(1);

        this.startGameButton = this.add.sprite(buttonX, card_2.y + card_2.displayHeight*0.7, 'start_mode_button')
            .setInteractive().setOrigin(0.5).setScale(0.7).setAlpha(0)
            .on('pointerdown', () => {
                this.sound.play('clickEffect', {loop: false, volume: getSoundSettings('high')});
                this.scene.start('transitionScreen', { nextPage: this.player.gameModeData.mode, bgMusic: ['titleBgMusic'] });
            })
            .on('pointerover', () => {
                this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('high')});
                this.startGameButton.setScale(0.75);
            })
            .on('pointerout', () => this.startGameButton.setScale(0.7));


        let buttons = [adventureMode, towerMode, storyMode, eventMode];
        let cardSlots = [card_1, card_2, card_3];

        this.add.sprite(this.gameW - this.paddingX, this.paddingX, 'exitIcon').setOrigin(1,0).setInteractive().setScale(0.6)
            .on('pointerdown', () => {
                this.player.gameModeData = {
                    mode: null,
                    team: { card_1: null, card_2: null, card_3: null }
                };

                this.scene.start('game');
            });

        buttons.forEach(button => {
            if(button.state == 'disabled'){
                let lockPositionY = button.name == 'event' || button.name == 'tower'? button.y + button.displayHeight*0.45: button.y - button.displayHeight*0.55;
                let lock = this.add.sprite(button.x + button.displayWidth/2 - this.paddingX*1.5, lockPositionY, 'lock').setOrigin(0.5);
                this[`${button.name}_container`].add([lock]);
            }
        })

        cardSlots.forEach(slot => {
            if(!slot.state){
                slot.tint = 0x808080;
                let lockBig = this.add.sprite(slot.x, slot.y, 'lock_big').setOrigin(0.5);
                let cardText = this.add.text(
                    lockBig.x, lockBig.y + lockBig.displayHeight*0.8,
                    `Unlock at Level ${slot.name == 'card_2'? 10: 20}`,
                    {fontFamily: 'GameTextFont', fontSize: 16, align: 'justify'}
                ).setOrigin(0.5).setWordWrapWidth(slot.displayWidth*0.8);
                this[`${slot.name}_container`].add([lockBig, cardText]);
            }
        })

        this.tweens.add({
            targets: boxContainer,
            x: { value: 0, duration: 250, ease: 'Power1'},
            onComplete: () => {
                this.time.addEvent({
                    duration: 1000,
                    delay: 150,
                    repeat: 3,
                    callback: () => {
                        this.sound.play('swoosh', {volume: getSoundSettings('default') });
                    }
                });

                this.tweens.add({
                    targets: this.story_container,
                    x: { value: -buttonX, duration: 250, ease: 'Back.easeOut' },
                    delay: 100,
                })

                this.tweens.add({
                    targets: this.adventure_container,
                    x: { value: -buttonX, duration: 250, ease: 'Back.easeOut' },
                    delay: 250
                }) 

                this.tweens.add({
                    targets: this.tower_container,
                    x: { value: -buttonX, duration: 250, ease: 'Back.easeOut' },
                    delay: 400
                }) 

                this.tweens.add({
                    targets: this.event_container,
                    x: { value: -buttonX, duration: 250, ease: 'Back.easeOut' },
                    delay: 550,
                    onComplete:() => {
                        buttons.forEach(button => {

                            button.setInteractive();

                            if(button.state == 'enabled'){
                                button.on('pointerup', () => {

                                    this.player.gameModeData.mode = button.name;

                                    //Let UI
                                    this.tweens.add({
                                        targets: boxContainer,
                                        x: { value: -this.gameW*0.3, duration: 250, ease: 'Power1'},
                                        onComplete:()=>{
                                            this.time.addEvent({
                                                duration: 1000,
                                                delay: 150,
                                                repeat: 3,
                                                callback: () => {
                                                    this.sound.play('swoosh', {volume: getSoundSettings('default') });
                                                }
                                            });
                                            //Retract game mode buttons
                                            this.tweens.add({
                                                targets: this.story_container,
                                                x: { value: 0 , duration: 250, ease: 'Back.easeIn' },
                                            })

                                            this.tweens.add({
                                                targets: this.adventure_container,
                                                x: { value: 0, duration: 250, ease: 'Back.easeIn' },
                                                delay: 150
                                            }) 

                                            this.tweens.add({
                                                targets: this.tower_container,
                                                x: { value: 0, duration: 250, ease: 'Back.easeIn' },
                                                delay: 300
                                            }) 

                                            this.tweens.add({
                                                targets: this.event_container,
                                                x: { value: 0, duration: 250, ease: 'Back.easeIn' },
                                                delay: 450,
                                                onComplete:() => {
                                                    boxText.setTexture('setup_team_text');
                                                    this.tweens.add({
                                                        targets: boxContainer,
                                                        x: { value: 0, duration: 250, ease: 'Power1'},
                                                        onComplete: () => {
                                                            this.time.addEvent({
                                                                duration: 1000,
                                                                delay: 250,
                                                                repeat: 2,
                                                                callback: () => {
                                                                    this.sound.play('cardPlace', {volume: getSoundSettings('default')*2 });
                                                                }
                                                            });

                                                            this.tweens.add({
                                                                targets: this.card_1_container,
                                                                x: { value: -buttonX - card_2.displayWidth - this.paddingX, duration: 250, ease: 'Power1' },
                                                                delay: 100
                                                            })

                                                            this.tweens.add({
                                                                targets: this.card_2_container,
                                                                x: { value: -buttonX, duration: 250, ease: 'Power1' },
                                                                delay: 350
                                                            })

                                                            this.tweens.add({
                                                                targets: card_3,
                                                                x: { value: buttonX + card_2.displayWidth + this.paddingX, duration: 250, ease: 'Power1' },
                                                                delay: 600,
                                                                onComplete: () => {
                                                                    cardSlots.forEach(card => {
                                                                        if(card.state){
                                                                            card.setInteractive();

                                                                            card.on('pointerdown', () => {
                                                                                this.sound.play('clickSelectEffect', {loop: false, volume: getSoundSettings('default')});
                                                                                this.selectCard(card);
                                                                            })

                                                                            card.on('pointerover', () => {
                                                                                this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('high')});
                                                                                card.setScale(1.05);
                                                                            })

                                                                            card.on('pointerout', () => {
                                                                                card.setScale(1);
                                                                            })
                                                                        }
                                                                        else{
                                                                            card.disableInteractive();
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    });                   
                                                }
                                            })
                                        }
                                    });
                                })

                                button.on('pointerdown', () => {
                                    this.sound.play('clickEffect', {loop: false, volume: getSoundSettings('high')});
                                })

                                button.on('pointerover', () => {
                                    this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('high')});
                                    button.setScale(1.05);
                                })

                                button.on('pointerout', () => {
                                    button.setScale(1);
                                })                              
                            }
                            else{
                                button.on('pointerdown', () => {
                                    button.disableInteractive();
                                    this.sound.play('denied', {loop: false, volume: getSoundSettings('default')});
                                    if(button.name == 'story'){
                                        this.popUpAlert('Game mode locked', 'This game mode is not available at the moment. Please try again later.');
                                    }
                                    else if(button.name == 'adventure'){
                                        this.popUpAlert('Game mode locked', 'You must finish Chapter 1 of Story mode first before you can play this mode.');
                                    }
                                    else if(button.name == 'tower'){
                                        this.popUpAlert('Game mode locked', 'Tower is closed at the moment. Please try again later.');
                                    }
                                    else{
                                        this.popUpAlert('Game mode locked', 'No event happening at the moment. Please try again later.')
                                    }
                                })
                            }
                        })
                    }
                })  
            }
        });
    }

    selectCard(cardSlot){
        this.player.gameModeData.team[cardSlot.name] = null;

        this[`cardFlip_${cardSlot.name}`] = this.plugins.get('rexFlip').add(cardSlot, {
            face: 'back',
            front: {key: 'Alpha_slot'},
            back: {key: 'cardSlot'},
            duration: 250
        });

        this.popUpselection(cardSlot)
    }

    popUpselection(cardSlot){
        this.formPopupContainer = this.add.group().setDepth(15);
        let popupBg = this.add.rectangle(0,0, this.gameW, this.gameH, 0x000000, 0.7).setOrigin(0).setInteractive();

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

        let panelBox = new ScrollablePanel(this, {
            x: this.gameW/2,
            y: this.gameH/2,
            width: this.gameW*0.4,
            height: this.gameH/2,
            scrollMode:0,
            background: this.add.rexRoundRectangle(this.gameW/2, this.gameH/2, this.gameW*0.4, this.gameH/2, 5, 0x000000, 1)
            .setStrokeStyle(1, 0xffffff, 1).setInteractive(),
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
                track: this.add.rexRoundRectangle(0, 0, 10, this.gameH/2, 4.5, 0x000000, 0.9).setStrokeStyle(0.5, 0xffffff, 0.8),
                thumb: this.add.rexRoundRectangle(0, 0, 10, this.paddingX*4, 4.5, 0xffffff, 0.8).setAlpha(0.5),
                input: 'drag',
                position: 'right',
            },
        }).setOrigin(0.5).layout();
        this.add.existing(panelBox);


        this.formPopupContainer.addMultiple([popupBg, panelBox, sizer]);

        popupBg.on('pointerdown', () => {
            this.formPopupContainer.destroy(true);
        });

        //Check if there are cards on players inventory
        let cards = this.player.playerInfo.inventory.card.length >= 1? this.player.playerInfo.inventory.card : [{name: 'Alpha'}];

        let filteredCard = cards.filter(
            card => card.name != this.player.gameModeData.team.card_1 && card.name != this.player.gameModeData.team.card_2 && card.name != this.player.gameModeData.team.card_3
        )

        filteredCard.forEach(card => {
            sizer.add(
                this.add.sprite(0, 0, `${card.name}_mini`).setInteractive().setScale(0.7)
                    .on('pointerdown', () => {
                        this.sound.play('clickSelectEffect', {loop: false, volume: getSoundSettings('default')});
                        this.player.gameModeData.team[cardSlot.name] = card.name;

                        this[`cardFlip_${cardSlot.name}`].setFrontFace(`${card.name}_slot`);
                        this[`cardFlip_${cardSlot.name}`].flip();
              
                        this.formPopupContainer.destroy(true);
                    })
                    .on('pointerover', () => {
                        this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('high')});
                    })
            )
        })
        panelBox.layout();
    }

    update(){
        let { mode, team } = this.player.gameModeData;

        if(mode && (team.card_1 || team.card_2 || team.card_3)){
            this.startGameButton.setAlpha(1);
        }
        else{
            this.startGameButton.setAlpha(0);
        }
    }
}


export default Explore;