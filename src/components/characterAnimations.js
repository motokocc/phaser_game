import Phaser from 'phaser';

/**
 * Class for generating animations.
 * 
 * @param charactersAvailable: list of characters available to be animated
 * @param generateAnimation: generates animation for a specific character and returns the name of the animation to be played
 */
export default class CharacterAnimation extends Phaser.Scene{
	constructor(scene){
		super(scene);
		this.scene = scene;
		
		this.charactersAvailable = [ 
			{ name: "slime", isOneSpritesheetOnly: true, location: "elven_forest", role: "enemy" }
		];
	}

    /**
     * Generate Animation for the scene.
     * 
     * @param name: name of the character
     * @param action: animation to be performed(idle, run, walk, attack, dead, etc)
     * @param frameRate: how fast the animation will be played. The higher the value the faster the animation
     * @param startFrame: starting frame of the animation
     * @param endFrame: last frame of the animation
     * @param repeat: optional parameter(defaults to -1 which means infinite if not added)
     * @returns animation object which includes the name of the generated animation
     */
	generateAnimation(name,action, frameRate, startFrame, endFrame, repeat){

		let characterCheck = this.charactersAvailable.filter(char => char.name === name);

		if(characterCheck.length <= 0){
			throw Error('No animation available for this character');
		}

		else {
			let characterToAnimate = characterCheck[0];

			this.scene.anims.create({
	            key: `${name}_${action}`,
	            frameRate,
	            frames: this.scene.anims.generateFrameNumbers(
	            	`${name}_${characterToAnimate.isOneSpritesheetOnly? 'spritesheet': action}`, { start: startFrame, end: endFrame }
	            	),
	            repeat: -1
	        });

	        return {
	        	name,
	        	animation: `${name}_${action}`,
	        	spritesheet: `${name}_${characterToAnimate.isOneSpritesheetOnly? 'spritesheet': action}` 
	        }
		}
	}
} 