import BaseScene from '../plugins/BaseScene';

class SummoningArea extends BaseScene {

    create(){
        let drawType = 'free';

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
        
        let freeButton = this.add.sprite(this.game.config.width - 150, paddingY*3.1, 'freeBtn')
        let rareButton = this.add.sprite(this.game.config.width - 150, paddingY*6.2, 'rareBtn')
        let premiumButton = this.add.sprite(this.game.config.width - 150, paddingY*9.3, 'premiumBtn')        

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

            button.on('pointerdown', () => {
                button.setAlpha(0.7);
                this.sound.play('clickEffect', {loop: false});

                this.tweens.add({
                    targets: this.summoningUiContainer,
                    x: { value: 300, duration: 400, ease: 'Power1'},
                    yoyo: false
                });

                this.tweens.add({
                    targets: this.summoningNpc,
                    x: { value: -300, duration: 400, ease: 'Power1'},
                    yoyo: false

                });

                this.tweens.add({
                    targets: [this.summoningCircle],
                    angle: { from: 0, to: 360, duration: 2000, ease: 'Linear'},
                    repeat: -1
                });

                this.tweens.add({
                    targets: [this.summoningCircle],
                    scale: { value: 2.2, duration: 500, ease: 'Linear'},
                    yoyo: false
                });
            });

            this.cameras.main.fadeIn(500);
        });

        this.summoningUiContainer.add([this.uibox, this.uiText, freeButton, premiumButton,rareButton]);
    }

    update(){
    }
}

export default SummoningArea;