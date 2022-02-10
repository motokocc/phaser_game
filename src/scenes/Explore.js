import 'regenerator-runtime/runtime';
import BaseScene from '../plugins/BaseScene';
import { getSoundSettings } from '../js/utils';

class Explore extends BaseScene {

    create(){
        let gameModeData = {
            mode: null,
            team: []
        }

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
            .setState('disabled');
        this.adventure_container.add([adventureMode]);

        this.tower_container = this.add.container();
        let towerMode = this.add.sprite( buttonXInitial,this.gameH/2 + this.paddingX*0.6, 'tower_mode_button')
            .setOrigin(0.5,0)
            .setName('tower')
            .setState('disabled');
        this.tower_container.add([towerMode]);

        let storyMode = this.add.sprite(buttonXInitial, (adventureMode.y - adventureMode.displayHeight) - (this.paddingX*1.2), 'story_mode_button')
            .setOrigin(0.5,1)
            .setName('story')
            .setState('enabled');

        this.event_container = this.add.container();
        let eventMode = this.add.sprite(buttonXInitial, (towerMode.y +  towerMode.displayHeight) + (this.paddingX*1.2), 'event_mode_button')
            .setOrigin(0.5,0)
            .setName('event')
            .setState('disabled');
        this.event_container.add([eventMode]);

        //Team Setup cards
        let card_1 = this.add.sprite(buttonXInitial, this.gameH/2, 'cardBack').setOrigin(0.5).setScale(0.7)
           .setState(this.player.playerInfo.level >= 20? 1: 0);
        let card_2 = this.add.sprite(buttonXInitial, this.gameH/2, 'cardBack').setOrigin(0.5).setScale(0.7)
            .setState(this.player.playerInfo.level >= 10? 1: 0);
        let card_3 = this.add.sprite(buttonXInitial, this.gameH/2, 'cardBack').setOrigin(0.5).setScale(0.7)
            .setState(1);


        let buttons = [adventureMode, towerMode, storyMode, eventMode];
        let cardSlots = [card_1, card_2, card_3];

        buttons.forEach(button => {
            if(button.state == 'disabled'){
                let lockPositionY = button.name == 'event' || button.name == 'tower'? button.y + button.displayHeight*0.45: button.y - button.displayHeight*0.55;
                let lock = this.add.sprite(button.x + button.displayWidth/2 - this.paddingX*1.5, lockPositionY, 'lock').setOrigin(0.5);
                this[`${button.name}_container`].add([lock]);
            }
        })

        this.tweens.add({
            targets: boxContainer,
            x: { value: 0, duration: 250, ease: 'Power1'},
            onComplete: () => {
                this.tweens.add({
                    targets: storyMode,
                    x: { value: buttonX, duration: 250, ease: 'Back.easeOut' },
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

                                    gameModeData.mode = button.name;

                                    //Let UI
                                    this.tweens.add({
                                        targets: boxContainer,
                                        x: { value: -this.gameW*0.3, duration: 250, ease: 'Power1'},
                                        onComplete:()=>{
                                            //Retract game mode buttons
                                            this.tweens.add({
                                                targets: storyMode,
                                                x: { value: buttonXInitial, duration: 250, ease: 'Back.easeIn' },
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
                                                                    this.sound.play('cardPlace');
                                                                }
                                                            });

                                                            this.tweens.add({
                                                                targets: card_1,
                                                                x: { value: buttonX - card_2.displayWidth - this.paddingX, duration: 250, ease: 'Power1' },
                                                                delay: 100
                                                            })

                                                            this.tweens.add({
                                                                targets: card_2,
                                                                x: { value: buttonX, duration: 250, ease: 'Power1' },
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
                                                                                console.log('hey');
                                                                            })

                                                                            card.on('pointerover', () => {
                                                                                this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('hoverEffect')});
                                                                                card.setScale(0.75);
                                                                            })

                                                                            card.on('pointerout', () => {
                                                                                card.setScale(0.7);
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
                                    this.sound.play('clickEffect', {loop: false, volume: getSoundSettings('clickEffect')});
                                })

                                button.on('pointerover', () => {
                                    this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('hoverEffect')});
                                    button.setScale(1.05);
                                })

                                button.on('pointerout', () => {
                                    button.setScale(1);
                                })                              
                            }
                            else{
                                button.on('pointerdown', () => {
                                    button.disableInteractive();

                                    if(button.name == 'adventure'){
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
}

export default Explore;