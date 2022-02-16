import Phaser from 'phaser';

class Credits extends Phaser.Scene {

    create(){
        let gameW = this.game.config.width;
        let gameH = this.game.config.height;
        let paddingVertical = gameH*0.1
        let paddingName = gameH*0.03

        let credit1 = this.add.text(gameW/2, paddingVertical,'Game Developed by:').setOrigin(0.5).setFont({fontFamily: 'GameTextFont', fontStyle: 'Bold'});
        let credit1_name = this.add.text(gameW/2, credit1.y + paddingName, 'Justin Trajano').setOrigin(0.5).setFont({fontFamily: 'GameTextFont'}).setInteractive();
        credit1_name.on('pointerdown', () => this.openExternalLink('https://www.linkedin.com/in/justin-rodrigo-trajano-708b165a/'));

        let credit2 = this.add.text(gameW/2, paddingVertical*2.3,'Character Illustration:').setOrigin(0.5).setFont({fontFamily: 'GameTextFont', fontStyle: 'Bold'});
        let credit2_name = this.add.text(gameW/2, credit2.y + paddingName, 'Justin Trajano').setOrigin(0.5).setFont({fontFamily: 'GameTextFont'}).setInteractive();
        credit2_name.on('pointerdown', () => this.openExternalLink('https://www.linkedin.com/in/justin-rodrigo-trajano-708b165a/'));

        let credit3 = this.add.text(gameW/2, paddingVertical*3.6,'Background Music:').setOrigin(0.5).setFont({fontFamily: 'GameTextFont', fontStyle: 'Bold'});
        let credit3_name = this.add.text(gameW/2, credit3.y + paddingName, 'Triumphant by Zakhar Valaha').setOrigin(0.5).setFont({fontFamily: 'GameTextFont'}).setInteractive();
        credit3_name.on('pointerdown', () => this.openExternalLink('https://pixabay.com/users/zakharvalaha-22836301/'));
 
        let credit4 = this.add.text(gameW/2, paddingVertical*4.9,'Background Image:').setOrigin(0.5).setFont({fontFamily: 'GameTextFont', fontStyle: 'Bold'});
        let credit4_name = this.add.text(gameW/2, credit4.y + paddingName, 'Treasure Cave by upklyak').setOrigin(0.5).setFont({fontFamily: 'GameTextFont'}).setInteractive();
        credit4_name.on('pointerdown', () => this.openExternalLink('https://www.freepik.com/vectors/money'));

        let credit5 = this.add.text(gameW/2, paddingVertical*6.2,'UI and Character Design:').setOrigin(0.5).setFont({fontFamily: 'GameTextFont', fontStyle: 'Bold'});
        let credit5_name = this.add.text(gameW/2, credit5.y + paddingName, 'Justin Trajano').setOrigin(0.5).setFont({fontFamily: 'GameTextFont'}).setInteractive();
        credit5_name.on('pointerdown', () => this.openExternalLink('https://www.linkedin.com/in/justin-rodrigo-trajano-708b165a/'));

        let exitToMainMenu = this.add.text(gameW/2, gameH - gameH*0.05, 'Click here to return to Main Screen' )
         .setOrigin(0.5, 1)
         .setInteractive()
         .setFont({fontFamily: 'GameTextFont'});
        exitToMainMenu.on('pointerdown', () => this.scene.start('game'));
    }


    openExternalLink (url) {
        var s = window.open(url, '_blank');

        if (s && s.focus)
        {
            s.focus();
        }
        else if (!s)
        {
            window.location.href = url;
        }
    }
}

export default Credits;