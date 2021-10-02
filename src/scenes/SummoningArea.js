import BaseScene from '../plugins/BaseScene';

class SummoningArea extends BaseScene {

    create(){
        // this.gameBg = this.add.image(0,0,'background');
        // this.gameBg.setOrigin(0,0);
        // this.gameBg.setScale(1.1);

        this.summoningCircle = this.add.sprite(
            this.game.config.width/2,
            this.game.config.height/2,
            'summoningCircle'
        ).setScale(1.5);

        this.tweens.add({
            targets: [this.summoningCircle],
            angle: { value: 360, duration: 20000, ease: 'Linear'},
            repeat: -1
        });

        this.summoningNpc = this.add.sprite(0, this.game.config.height, 'elf-0')
        .setOrigin(0,1)
        .setScale(0.7)
        .setInteractive();

        //UI
        const paddingY = 30;
        this.summoningUiContainer = this.add.container(0,0);

        this.uibox = this.add.rectangle(this.game.config.width,0, 300, this.game.config.height, 0x000000)
            .setOrigin(1,0)
            .setAlpha(0.8);
        
        this.uiText = this.add.text(this.game.config.width - 150, paddingY, 'Select Draw Type').setOrigin(0.5);
        
        let freeButton = this.add.sprite(this.game.config.width - 150, paddingY*4, 'okButton')
            .setOrigin(0.5)
            .setScale(0.11)
            .setInteractive();

        let rareButton = this.add.sprite(this.game.config.width - 150, paddingY*8, 'okButton')
            .setOrigin(0.5)
            .setScale(0.11)
            .setInteractive();

        let premiumButton = this.add.sprite(this.game.config.width - 150, paddingY*12, 'okButton')
            .setOrigin(0.5)
            .setScale(0.11)
            .setInteractive();

        let drawButton = this.add.sprite(this.game.config.width/2, this.game.config.height - paddingY, 'startBtn')
            .setOrigin(0.5,1)
            .setScale(0.11)
            .setInteractive();

        this.summoningUiContainer.add([this.uibox, this.uiText, freeButton, premiumButton,rareButton]);
    }

    update(){
    }
}

export default SummoningArea;