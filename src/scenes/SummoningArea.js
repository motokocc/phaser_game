import BaseScene from '../plugins/BaseScene';

class SummoningArea extends BaseScene {
    create(){
        console.log(this.player.playerInfo);
        let drawType = 'free';

        this.lights.enable().setAmbientColor(0x000ff);

        let summoningCircle = this.add.sprite(
            this.game.config.width/2,
            this.game.config.height/2,
            'summoningCircle'
        ).setScale(1.5);

        let lightEffect = this.lights.addPointLight(this.game.config.width/2, this.game.config.height/2, 0xb29700, 400,0.3);
        lightEffect.setAlpha(0);

        this.tweens.add({
            targets: summoningCircle,
            angle: { value: 360, duration: 20000, ease: 'Linear'},
            repeat: -1
        });

        //Right side NPC
        let rightUi = this.add.container();

        let summoningNpc = this.add.sprite(0, this.game.config.height, 'elf-0')
        .setOrigin(0,1)
        .setScale(0.7)
        .setInteractive();

        summoningNpc.play('elf_talk');

        this.createSpeechBubble (summoningNpc.width/2, summoningNpc.y/2, 220, 100, "I wonder what kind of Djinn you're going to summon...");

        rightUi.add([summoningNpc, this.messageBoxContainer]);

        //UI Buttons
        const paddingY = 30;
        let summoningUiContainer = this.add.container(0,0);

        let uibox = this.add.rectangle(this.game.config.width,0, 300, this.game.config.height, 0x000000)
            .setOrigin(1,0)
            .setAlpha(0.8);
        
        let uiText = this.add.text(this.game.config.width - 150, paddingY, 'Select Draw Type', {fontFamily: 'Arial', fontSize: 20}).setOrigin(0.5);
        
        let freeButton = this.add.sprite(this.game.config.width - 150, paddingY*3.1, 'freeBtn')
        let rareButton = this.add.sprite(this.game.config.width - 150, paddingY*6.2, 'rareBtn')
        let premiumButton = this.add.sprite(this.game.config.width - 150, paddingY*9.3, 'premiumBtn')
        let proceedButton = this.add.sprite(this.game.config.width - paddingY, this.game.config.height-paddingY,'premiumBtn')
            .setInteractive()
            .setOrigin(1)
            .setAlpha(0);

        let backButton = this.add.text(
            this.game.config.width - paddingY,
             this.game.config.height-paddingY,
              'Back >>',
        {fontFamily: 'Arial', fontSize: 20}).setOrigin(1).setInteractive();

        if(!this.player.playerInfo.isFirstTime){
            backButton.on('pointerdown', () => {
                this.sound.play('clickEffect', {loop: false});
                this.sound.stopByKey('titleBgMusic');
                this.scene.start("game");
            });
        }
        else{
            backButton.disableInteractive();
            backButton.setAlpha(0);
        }

        proceedButton.on('pointerdown', () => {
            this.sound.play('clickEffect', {loop: false});
            this.sound.stopByKey('titleBgMusic');
            this.scene.start("game");
        });

        
        //Card summon
        let cardBack = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'cardBack');
        cardBack.setAlpha(0);
        cardBack.setScale(0);

        var cardFlip = this.plugins.get('rexFlip').add(cardBack, {
            face: 'back',
            front: {key: 'cardBack'},
            back: {key: 'cardBack'},
            duration: 500
        });
        //End Card summon setup

        const buttons = [freeButton, rareButton, premiumButton];

        buttons.forEach(button => {
            button.setOrigin(0.5).setInteractive();

            button.on('pointerover', () => {
                button.setScale(1.1);
                this.sound.play('hoverEffect', {loop: false});
            });

            button.on('pointerout', () => {
                button.setScale(1);
            });

            button.on('pointerup', () => {
                button.setAlpha(1);
            });

            button.on('pointerdown', async() => {
                button.setAlpha(0.7);
                this.sound.play('clickEffect', {loop: false});
             
                //Card effect
                this.tweens.add({
                    targets: [cardBack, lightEffect],
                    alpha: { value: 1, duration: 1500, ease: 'Power1'},
                    scale: { value: 1, duration: 4000, ease: 'Power1'},
                    yoyo: false,
                    delay: 4000,
                    onComplete: () => {
                        this.player.mintCard().then(card => {
                            cardFlip.setFrontFace(card.name);

                            this.tweens.add({
                                targets: summoningCircle,
                                alpha: { value: 0.5, duration: 500, ease: 'Linear'},
                                yoyo: false,
                                onComplete: () => {
                                    cardFlip.flip();
                                    lightEffect.radius = 300
                                    lightEffect.intensity = 0.6;  ;
                                }
                            });

                            this.tweens.add({
                                targets: summoningCircle,
                                angle: { value: 360, duration: 30000, ease: 'Power1'},
                                repeat: -1
                            });

                            this.tweens.add({
                                targets: proceedButton,
                                alpha: { value: 1, duration: 1000, ease: 'Power1'},
                                delay:1000
                            });
                        });
                    }
                }); 
                //End Card Effect

                this.tweens.add({
                    targets: summoningUiContainer,
                    x: { value: 300, duration: 400, ease: 'Power1'},
                    yoyo: false
                });

                this.tweens.add({
                    targets: rightUi,
                    x: { value: -600, duration: 400, ease: 'Power1'},
                    yoyo: false

                });

                this.tweens.add({
                    targets: summoningCircle,
                    angle: { from: 0, to: 360, duration: 2000, ease: 'Linear'},
                    repeat: -1
                });

                this.tweens.add({
                    targets: summoningCircle,
                    scale: { value: 2.2, duration: 500, ease: 'Linear'},
                    yoyo: false
                });
            });

            this.cameras.main.fadeIn(500);
        });

        summoningUiContainer.add([uibox, uiText, freeButton, premiumButton,rareButton, backButton]);
    }

    update(){
    }
}

export default SummoningArea;