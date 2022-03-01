import Phaser from 'phaser';
import { getSoundSettings } from '../js/utils';

class TransitionScreen extends Phaser.Scene{
	init(data){
		this.sceneData = data;
	}

	create(){
		this.sceneData.bgMusic.forEach(bg => {        	
        	this[bg] = this.sound.get(bg);
        	this[bg].stop();
        	this[bg].destroy();
			this.sound.removeByKey(bg);
        })

        let card = this.add.sprite(
			this.game.config.width/2, 
			this.game.config.height/2,
			'cardSlot' 
        ).setOrigin(0.5);


        let cards = [ "Alpha", "Saya" ];

        let cardFlip = this.plugins.get('rexFlip').add(card, {
            face: 'back',
            front: {key: `${cards[Math.ceil(Math.random()* (cards.length)) - 1]}_slot`},
            back: {key: 'cardSlot'},
            duration: 500
        });

        this.time.addEvent({
        	duration:500,
        	repeat: -1,
        	callback: () => {
	        	cardFlip.flip();
        	}
        })

        let waitingtText = 'Loading... Please wait';
		let loadingText = this.add.text(
			card.x - card.displayWidth*0.6, 
			card.y + card.displayWidth, 
			waitingtText , 
			{ 
				fontFamily: 'GameTextFont', 
				color: 'white', 
				fontSize: '25px' 
			}
		).setOrigin(0, 0.5);

		let loadingCounter = 0;

        this.time.addEvent({
            duration: 500,
            delay: 500,
            repeat: -1,
            callback: () => {
            	loadingCounter++;

            	if(loadingCounter == 4){
					waitingtText = 'Loading... Please wait';
					loadingCounter = 0;
            	}
            	else{
            		waitingtText = waitingtText + '.';
            	}

                loadingText.setText(waitingtText);
            }
        });

        this.time.addEvent({
			duration: 500,
            delay: 5700,
            callback: () => {
            	if(this.sceneData.nextBgMusic){
            		this.sound.removeByKey(this.sceneData.nextBgMusic);
            		this.sound.play(this.sceneData.nextBgMusic, { volume: getSoundSettings('default'), loop: true});
            	}
            	this.scene.start(this.sceneData.nextPage || 'adventure');
            }
		})
	}

}

export default TransitionScreen;