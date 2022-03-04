import Phaser from 'phaser';
import { charInitData } from '../js/charInitData';

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
		
		this.charactersAvailable = [...charInitData];
	}

    /**
     * Generate individual character animation.
     * 
     * @param name: name of the character
     * @param action: animation to be performed(idle, run, walk, attack, dead, etc)
     * @param frameRate: how fast the animation will be played.
     * @param repeat: optional parameter(defaults to -1 which means infinite if not added)
     * @return animation object which includes the name of the generated animation
     */
	generateAnimation(name, action, frameRate, repeat){

		let characterCheck = this.charactersAvailable.filter(char => char.name === name);

		if(characterCheck.length <= 0){
			throw Error('No animation available for this character');
		}

		else {
			let characterToAnimate = characterCheck[0];
			let frameKey = `${name}_${characterToAnimate.isOneSpritesheetOnly? 'spritesheet': action}`;

			this.scene.anims.create({
	            key: `${name}_${action}`,
	            frameRate,
	            frames: this.scene.anims.generateFrameNumbers(frameKey, characterToAnimate.animation[action]),
	            repeat: repeat || -1
	        });

	        return { name, animation: `${name}_${action}`, spritesheet: frameKey }
		}
	}
} 