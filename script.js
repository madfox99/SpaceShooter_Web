window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;

    class InputHandler {
        constructor(game){
            this.game = game;
            // KeyDown
            window.addEventListener('keydown', e => {
                if(((e.key === 'ArrowUp') || (e.key === 'ArrowDown')) && this.game.keys.indexOf(e.key) === -1){
                    this.game.keys.push(e.key);
                }else if(e.key === ' '){
                    this.game.player.shootMiddle();
                }else if(e.key === 'd'){
                    this.game.debug = !this.game.debug;
                }
            });
            // KeyUp
            window.addEventListener('keyup', e => {
                if(this.game.keys.indexOf(e.key) > -1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
            });
        }
        update(){}
        draw(){}
    }
    class Projectile {
        constructor(game, x, y){
            this.game = game;
            this.width = 10;
            this.height = 2;  
            this.x = x;
            this.y = y - this.height * 0.5 ;                      
            this.speed = 3;
            this.markedForDeletion = false;
        }
        update(){
            this.x += this.speed;
            if(this.x > this.game.width * 0.8){
                this.markedForDeletion = true;
            }
        }
        draw(context){
            context.fillStyle = 'yellow'; //  Laser color
            context.fillRect(this.x, this.y, this.width, this.height);
        }

    }
    class Particle {

    }
    class Player {
        constructor(game){
            this.game = game;
            this.width = 75;
            this.height = 99;
            this.x = 20;
            this.y = (canvas.height - this.height) * 0.5;
            this.speedY = 0;
            this.maxSpeed = 2; // player move speed
            this.projectiles = [];
            this.image1 = document.getElementById('playerShip1');
            this.image2 = document.getElementById('playerShip2');
            this.image3 = document.getElementById('playerShip3');
            this.image4 = document.getElementById('playerShip4');
        }
        update(){
            if(this.game.keys.includes('ArrowUp')){
                this.speedY = -this.maxSpeed;
            }else if(this.game.keys.includes('ArrowDown')){
                this.speedY = this.maxSpeed;
            }else{
                this.speedY = 0;
            }
            this.y += this.speedY;

            // Handle projectiles
            this.projectiles.forEach(projectile => {
                projectile.update();
            });
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);

        }
        draw(context){
            if(this.game.debug){
                context.strokeRect(this.x, this.y, this.width, this.height);
            }            
            context.drawImage(this.image1, this.x, this.y);
            this.projectiles.forEach(Projectile => {
                Projectile.draw(context);
            });
        }
        shootMiddle(){
            if(this.game.ammo > 0){
                this.projectiles.push(new Projectile(this.game, this.x + this.width, this.y + this.height * 0.5));
                this.game.ammo--;
            }
        }
    }
    class Enemy {
        constructor(game){
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random() * -1.5 - 0.5;
            this.markedForDeletion = false;
                        
        }
        update(){
            this.x += this.speedX - this.game.speed;
            if(this.x + this.width < 0){
                this.markedForDeletion = true;
            }
        }
        draw(context){
            if(this.game.debug){
                context.strokeRect(this.x, this.y, this.width, this.height);
                context.fillStyle = 'black';
                context.font = '20px Helvetica';
                context.fillText(this.lives, this.x, this.y);
            }            
            context.drawImage(this.image, this.x, this.y, this.width, this.height);            
        }

    }

    class EnemyType1 extends Enemy { // Gray ship enemy
        constructor(game){
            super(game);
            this.width = 84;
            this.height = 103;
            this.lives = 3;
            this.score = this.lives;
            this.image = document.getElementById('enemy1');
            this.y = Math.random() * (this.game.height - this.height);                        
        }
    }
    
    class EnemyType2 extends Enemy { // Blue ship enemy
        constructor(game){
            super(game);
            this.width = 84;
            this.height = 97;
            this.lives = 5;
            this.score = this.lives;
            this.image = document.getElementById('enemy2');
            this.y = Math.random() * (this.game.height - this.height);           
        }
    }
    
    class EnemyType3 extends Enemy { // Green ship enemy
        constructor(game){
            super(game);
            this.width = 84;
            this.height = 93;
            this.lives = 6;
            this.score = this.lives;
            this.image = document.getElementById('enemy3');
            this.y = Math.random() * (this.game.height - this.height);           
        }
    }
    
    class EnemyType4 extends Enemy { // Green ship enemy
        constructor(game){
            super(game);
            this.width = 84;
            this.height = 82;
            this.lives = 8;
            this.score = this.lives;
            this.image = document.getElementById('enemy4');
            this.y = Math.random() * (this.game.height - this.height);           
        }
    }

    class Layer {
        constructor(game, image, speedModifier){
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = 1768;
            this.height = 500;
            this.x = 0;
            this.y = 0;
        }
        update(){
            if(this.x <= -this.width){
                this.x = 0;
            }
            this.x -= this.game.speed * this.speedModifier;
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x + this.width, this.y);
        }

    }
    class Background {
        constructor(game){
            this.game = game;
            this.image1 = document.getElementById('background1');
            this.image2 = document.getElementById('background2');
            this.image3 = document.getElementById('background3');
            this.image4 = document.getElementById('background4');
            this.layer1 = new Layer(this.game, this.image1, 1);
            this.layer2 = new Layer(this.game, this.image2, 1);
            this.layer3 = new Layer(this.game, this.image3, 1);
            this.layer4 = new Layer(this.game, this.image4, 1);
            this.layers = [this.layer1];
        }
        update(){
            this.layers.forEach(layer => layer.update());
        }
        draw(context){
            this.layers.forEach(layer => layer.draw(context));
        }

    }
    class UI {
        constructor(game){
            this.game = game;
            this.fontSize = 20;
            this.fontFamily = 'Helvetica';
            this.color = 'white';
        }
        draw(context){
            context.save();
            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';
            context.font = this.fontSize + 'px ' + this.fontFamily;
            // Display score
            context.fillText('Score: ' + this.game.score, 20, 40);
            // Display ammo           
            for(let i = 0; i< this.game.ammo; i++){
                context.fillRect(20 + 5 * i, 50, 3, 20)
            }
            // Display game timer
            context.fillText('Timer: ' + (this.game.gameTime * 0.001).toFixed(1), 20, 100);
            // Game Win/Over
            if(this.game.gameOver){
                context.textAlign = 'center';
                let message1;
                let message2;
                if(this.game.score > this.game.winningScore){
                    message1 = 'You Win!';
                    message2 = 'Well done!';
                }else{
                    message1 = 'You lose!';
                    message2 = 'Try agin next time!';
                }
                context.font = '50px '+ this.fontFamily;
                context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = '25px '+ this.fontFamily;
                context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 20);
            }

            context.restore();
        }
    }
    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.keys = [];
            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000; // 1 Sec
            this.ammo = 20;
            this.maxAmmo = 50;
            this.ammoTimer = 0;
            this.ammoInterval = 350; // 0.35 Sec
            this.gameOver = false;
            this.score = 0;
            this.winningScore = 20; // Winning score
            this.gameTime = 0;
            this.timeLimit = 30000; // Game time limit => 10 Sec
            this.speed = 1; // Game speed
            this.debug = false; // Debug mode
        }
        update(deltaTime){
            if(!this.gameOver){
                this.gameTime += deltaTime;
            }
            if(this.gameTime > this.timeLimit){
                this.gameOver = true;
            }
            this.background.update();
            this.player.update();
            if(this.ammoTimer > this.ammoInterval){
                if(this.ammo < this.maxAmmo){
                    this.ammo++;
                }
                this.ammoTimer = 0;
            }else{
                this.ammoTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {                
                enemy.update();
                // Check collition with the player
                if(this.checkCollision(this.player, enemy)){
                    enemy.markedForDeletion = true;
                }
                // Check collition with projectiles
                this.player.projectiles.forEach(projectile =>{
                    if(this.checkCollision(projectile, enemy)){
                        enemy.lives--;
                        projectile.markedForDeletion = true;
                        if(enemy.lives <= 0){
                            enemy.markedForDeletion = true;
                            if(!this.gameOver){
                                this.score += enemy.score;
                            }                            
                            if(this.score > this.winningScore){
                                this.gameOver = true;
                            }
                        }
                    }
                });
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            if(this.enemyTimer > this.enemyInterval && !this.gameOver){
                this.addEnemy();
                this.enemyTimer = 0;
            }else{
                this.enemyTimer += deltaTime;
            }
        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);            
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.ui.draw(context);
        }
        addEnemy(){
            const randomize = Math.random();
            if(randomize < 0.3){
                this.enemies.push(new EnemyType4(this)); 
            }else if(randomize < 0.5){
                this.enemies.push(new EnemyType3(this)); 
            }else if(randomize < 0.7){
                this.enemies.push(new EnemyType2(this)); 
            }else if(randomize < 0.8){
                this.enemies.push(new EnemyType1(this)); 
            }                   
        }
        checkCollision(rect1, rect2){
            return(rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y);
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    // Loop animation
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for looping
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }

    animate(0);

});