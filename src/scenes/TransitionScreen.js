import Phaser from 'phaser';

class TransitionScreen extends Phaser.Scene{
	init(data){
		this.data = data;
	}

	create(){
		let bgSound = this.sound.get('titleBgMusic');
		bgSound.stop();

        let card = this.add.sprite(
			this.game.config.width/2, 
			this.game.config.height/2,
			'cardSlot' 
        ).setOrigin(0.5);


        let cards = [ "Alpha", "Saya" ];

        let cardFlip = this.plugins.get('rexFlip').add(card, {
            face: 'back',
            front: {key: `${cards[Math.floor(Math.random()* (cards.length - 1))]}_slot`},
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
			card.x - card.displayWidth*0.65, 
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
            	this.scene.start(this.data.nextPage || 'adventure');
            }
		})
	}

}

export default TransitionScreen;