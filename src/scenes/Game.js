import Phaser from 'phaser';

class Game extends Phaser.Scene {

    preload(){
    }

    create(){
        this.sound.play('sceneBgMusic', {loop: true, volume:0.2});
        //create basic gameobject
        this.ball = this.add.circle(400,250,10,0xffffff,1);
        this.paddleLeft = this.add.rectangle(50, 250, 20, 100, 0xffffff, 1);
        this.paddleRight = this.add.rectangle(750, 250, 20, 100, 0xffffff, 1);

        //Add physics to the game objects
        this.physics.add.existing(this.ball);
        this.physics.add.existing(this.paddleLeft, true);
        this.physics.add.existing(this.paddleRight, true);

        //Make the game object bounce
        this.ball.body.setBounce(1,1);

        //Let the this.ball bounce within the canvas
        this.ball.body.setCollideWorldBounds(true, 1,1);

        //Set the direction/velocity of the this.ball
        const angle = Phaser.Math.Between(0,360);
        const ballSpeed = 400;

        const vec = this.physics.velocityFromAngle(angle, ballSpeed);

        this.ball.body.setVelocity(vec.x, vec.y);

        //Add colliders
        this.physics.add.collider(this.paddleLeft, this.ball);
        this.physics.add.collider(this.paddleRight, this.ball);

        //Add input to the gameobject to make it move
        this.cursors = this.input.keyboard.createCursorKeys();
        
    }
    //Need to declare gameobject with "this" in create() to interact with update()
    update(){
        if(this.cursors.up.isDown){
            this.paddleLeft.y -= 10;
            //Para malipat yung collider ng object dun sa pwesto na pinindot mo
            this.paddleLeft.body.updateFromGameObject();
        }
        else if(this.cursors.down.isDown){
            this.paddleLeft.y += 10;
            this.paddleLeft.body.updateFromGameObject();
        }

        //Enemy AI
        this.paddleRight.setY(this.ball.y);
        this.paddleRight.body.updateFromGameObject();
    }
}

export default Game;