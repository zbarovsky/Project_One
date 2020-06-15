var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update})

function preload() {
    game.load.image('floor', 'img/FlooringFinal.png');

    game.load.spritesheet('hero', 'img/heroSpritesheet.png', 50, 80);
    game.load.spritesheet('zombie', 'img/zombieSpritesheet.png', 38, 45);
    game.load.image('sword', 'img/swordFinal.png');

    game.load.image('wallVert', 'img/wallVertActualFinal.png');
    game.load.image('wallHorizontal', 'img/wallHorizontalFinal.png');

    game.load.image('northDoor', 'img/northDoor.png');
    game.load.image('eastDoor', 'img/eastDoor.png');
    game.load.image('southDoor', 'img/southDoor.png');
    game.load.image('westDoor', 'img/westDoor.png');
    
    game.load.image('gameOver', 'img/gameOverScreen.png');
    game.load.image('playAgainButton', 'img/playAgainButton.png');

    game.load.image('winImg', 'img/pixelHouse.png');
    game.load.image('winButton', 'img/winButton.png');

    // game.load.audio('music', 'img/KILL_EVERYTHING.wav');
}

/* ----------------------- Global Variables HERE ------------------------ */

let floor;
let walls;

let doors;
let northDoor;
let southDoor;
let eastDoor;
let westDoor;

let hoard;
let zombieHorde = 0;

let boss;
let finalBoss;

let bossHealth = 50;
let bossHealthBar;

let player;
let hero;
let sword;

let score = 0;
let scoreBoard;

let lives = 100;
let lifeBar;

let gameOverScreen;
let playAgain;
let playAgainButton;
let finalScore;

let winScreen;
let congrats;

// let music;

/* --------------------- CREATE and UPDATE Functions, DECLARE GROUPS -------------------------- */

function create() {

    // startin up them physics
    game.world.setBounds (0,0, 1600, 1200);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    createFloor()

    // set up walls grouping
    walls = game.add.group();
    walls.enableBody = true;

    createWalls()

    // Create doors and set up room change function
    doors = game.add.group()
    doors.enableBody = true;

    createDoors()

    // player group -- create hero and their physics
    player = game.add.group();

    createHero()

    // Zombie Horde
    zombieHorde = game.add.group();
    zombieHorde.enableBody = true;
    game.physics.arcade.enable(zombieHorde);

    // Big bad boss Spawn
    boss = game.add.group();
    boss.enableBody = true;
    game.physics.arcade.enable(boss);
    
    
    summonHoard()

    // create keyboard management
    cursors = game.input.keyboard.createCursorKeys();

    // Display Score and Life Remaining
    scoreBoard = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#ffffff'});
    bossHealthBar = game.add.text(300, 16, 'Boss health: 50', {fontSize: '32px', fill: '#ffffff'});
    lifeBar = game.add.text(600, 16, 'Life: 100', {fontSize: '32px', fill: '#ffffff'});

    game.camera.follow(hero);

    // music = game.add.audio('music');
    // music.play();
}

function update() {

    // physics for objects
    game.physics.arcade.collide(hero, walls);
    game.physics.arcade.collide(sword, hero);
    game.physics.arcade.collide(sword, walls);
    // game.physics.arcade.collide(hero, boss);
    // game.physics.arcade.collide(sword, boss);
    game.physics.arcade.collide(boss, walls);
    game.physics.arcade.collide(finalBoss, walls);
    game.physics.arcade.collide(zombieHorde, walls);

    // lets give some movement to our hero && sword
    hero.body.velocity.x = 0;
    sword.body.velocity.x = 0;

    hero.body.velocity.y = 0;
    sword.body.velocity.y = 0;

    let w = game.input.keyboard.addKey(Phaser.Keyboard.W);
    let a = game.input.keyboard.addKey(Phaser.Keyboard.A);
    let s = game.input.keyboard.addKey(Phaser.Keyboard.S);
    let d = game.input.keyboard.addKey(Phaser.Keyboard.D);

    if (w.isDown || a.isDown || s.isDown || d.isDown) {

        if (w.isDown) {
            hero.body.velocity.y = -150;
            hero.animations.play('up');
            sword.anchor.x = -0.5;
            sword.anchor.y = 0.1;
            sword.body.velocity.y = -150;
        }
        if (a.isDown) {
            hero.body.velocity.x = -150
            hero.animations.play('left')
            sword.anchor.x = 1;
            sword.anchor.y = -1.5;
            sword.body.velocity.x = -150
        }
        if (s.isDown) {
            hero.body.velocity.y = 150;
            hero.animations.play('down');
            sword.anchor.x = -0.15;
            sword.anchor.y = -3.5;
            sword.body.velocity.y = 150;
        }
        if (d.isDown) {
            hero.body.velocity.x = 150;
            hero.animations.play('right')
            sword.anchor.x = -1.5;
            sword.anchor.y = -1.6;
            sword.body.velocity.x = 150
        }
        else {
            hero.animations.stop();
            sword.animations.stop();
        }
    }

    // Dealing Damage
    game.physics.arcade.overlap(sword, zombieHorde, slayZombies, null, this);
    game.physics.arcade.overlap(hero, zombieHorde, slayHero, null, this);
    game.physics.arcade.overlap(sword, boss, bossBattle, null, this);
    game.physics.arcade.overlap(hero, boss, takeDamange, null, this);

    // Center game on screen
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
}

/* ------------------- GAME FUNCTIONS ---------------------- */


/* -------------------- COMBAT FUNCTIONS ------------------- */

function slayZombies (sword, zombieHorde) {
    zombieHorde.kill();

    score +=10;
    scoreBoard.text = 'Score: ' + score;

}

function slayHero (player, zombieHorde) {
    lives -=1;
    if (lives == 0) {
        player.kill()
        sword.kill()
        gameOver()
           
    }
    lifeBar.text = "Life left: " + lives;
}

function bossBattle (sword, boss) {
    bossHealth -=1;
    if (bossHealth == 0) {
        boss.kill()
        win()
    }
    bossHealthBar.text = "Boss health: " + bossHealth;
}

function takeDamange(hero, boss) {
    lives -=1;
    if (lives == 0) {
        hero.kill()
        sword.kill()
        gameOver()
    }
    lifeBar.text = "Life left: " + lives;
}

/* -------------------- WORLD BUILDING FUNCTIONS ---------- */

function createFloor () {

    let floor = game.add.sprite(0, 0, 'floor');
    floor = game.add.sprite(800, 600, 'floor');
    floor = game.add.sprite(800, 0, 'floor');
    floor = game.add.sprite(0,600, 'floor');
    floor.scale.setTo(1, 1);
} 

function createWalls () {

    // North wall
    let wallVert = walls.create(0, 0, 'wallVert');
    wallVert.scale.setTo(1, 1);
    wallVert.body.immovable = true;
    // NorthWall part 2
    wallVert = walls.create(750,0, 'wallVert');
    wallVert.scale.setTo(1, 1);
    wallVert.body.immovable = true;

    // South wall
    wallVert = walls.create (0, 1150, 'wallVert')
    wallVert.scale.setTo(1, 1);
    wallVert.body.immovable = true;
    //south wall part 2
    wallVert = walls.create (800, 1150, 'wallVert')
    wallVert.scale.setTo(1, 1);
    wallVert.body.immovable = true;

    // Middle Horizontal wall
    let wallMid = walls.create(0, 600, 'wallVert')
    wallMid.scale.setTo(0.47, 1);
    wallMid.body.immovable = true;
    //Mid Horiz 2
    wallMid = walls.create(450, 600, 'wallVert')
    wallMid.scale.setTo(0.47, 1);
    wallMid.body.immovable = true;
    //Mid Horiz 3
    wallMid = walls.create(800, 600, 'wallVert')
    wallMid.scale.setTo(0.47, 1);
    wallMid.body.immovable = true;
    //mid Horiz 4
    wallMid = walls.create(1240, 600, 'wallVert')
    wallMid.scale.setTo(0.47, 1);
    wallMid.body.immovable = true;

    // Middle Vert Wall
    let wallHorizontal = walls.create (750, 0, 'wallHorizontal');
    wallHorizontal.scale.setTo(1, 0.62);
    wallHorizontal.body.immovable = true;
    //Mid Vert 2
    wallHorizontal = walls.create (750, 600, 'wallHorizontal');
    wallHorizontal.scale.setTo(1, 0.45);
    wallHorizontal.body.immovable = true;
    //mid vert 3
    wallHorizontal = walls.create (750, 1050, 'wallHorizontal');
    wallHorizontal.scale.setTo(1, 0.45);
    wallHorizontal.body.immovable = true;

    // East Wall
    wallMid = walls.create(1550,0, 'wallHorizontal');
    wallMid.scale.setTo(1, 1.32);
    wallMid.body.immovable = true;

    // Weast wall
    wallHorizontal = walls.create (-50, 0, 'wallHorizontal');
    wallHorizontal.scale.setTo(1, 2);
    wallHorizontal.body.immovable = true;

}

function createDoors() {

    //Top Left
    function roomOne () {

    // East door
    let eastDoor = doors.create(750, 500, 'eastDoor');
    eastDoor.scale.setTo(1,2);
    eastDoor.enableBody = true;
    eastDoor.body.immovable = true;

    // South door
    let southDoor = doors.create(380, 600, 'southDoor');
    southDoor.scale.setTo(1.55,1);
    southDoor.enableBody = true;
    southDoor.body.immovable = true;

    } roomOne()

    // top right
    function roomTwo() {
        let southDoor = doors.create(1175, 600, 'southDoor');
        southDoor.scale.setTo(1.5,1)
        southDoor.enableBody = true;
        southDoor.body.immovable = true; 
    } roomTwo()

    // bottom left
    function roomThree() {
        let eastDoor = doors.create(750, 950, 'eastDoor');
        eastDoor.scale.setTo(1,2)
        eastDoor.enableBody = true;
        eastDoor.body.immovable = true;
    } roomThree()

    // bottom right
    function roomFour() {
        let eastDoor = doors.create(1550, 1050, 'eastDoor');
        eastDoor.scale.setTo(1,2);
        eastDoor.enableBody = true;
        eastDoor.body.immovable = true;
    }roomFour()
} 

/* ------------------ SPAWN FUNCTIONS --------------------- */

function createHero() {

    hero = game.add.sprite(400,300, 'hero')
    player.add(hero);
    game.physics.arcade.enable(hero);
    hero.body.collideWorldBoundaires = true;

    hero.animations.add('left', [0], 10, true);
    hero.animations.add ('right', [2], 10, true);
    hero.animations.add('up', [3], 10, true);
    hero.animations.add('down', [1], 10, true);

    //sword to hero
    sword = player.create(400, 275, 'sword');
    game.physics.arcade.enable(sword);
    sword.scale.setTo(.3, .3);
} 

function summonHoard() {

    for (i = 0; i < Math.floor(Math.random() * 100); i++) {

        let hoard = game.add.sprite(game.world.randomX, game.world.randomY, 'zombie');
        hoard.scale.setTo(1.5,2);
        zombieHorde.add(hoard);
        hoard.body.collideWorldBoundaires = true;
        // TODO change to follow player around if able
        //game.physics.arcade.moveToXY(zombieHorde, Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000), speed = 30);
        game.physics.arcade.moveToObject(hoard, hero, speed = 30);
        //console.log(zombieHorde[i])
    } 
    bossEmerge()
   
    
} 

function bossEmerge() {
    let finalBoss = game.add.sprite(1000, 800, 'zombie')
    finalBoss.scale.setTo(3,4);
    boss.add(finalBoss);
    finalBoss.body.collideWorldBoundaires = true;
    finalBoss.body.immovable = true;
    //game.physics.arcade.enable(finalBoss);
    game.physics.arcade.moveToXY(finalBoss, Math.floor(Math.random() * 1600), Math.floor(Math.random() * 1200), speed = 30);
    //finalBoss.events.onOutOfBounds.add(frameReset, this);
}

/* -------------------------- END GAME FUNCTIONS -------------------------- */

function win() {

    gameOverScreen = game.add.group();

    background = gameOverScreen.create(0,0, 'winImg');
    congrats = game.add.text(200, 350, `Congrats! You're safe... for now`, {fontSize: '48px', fill: '#800020' });
    finalScore = game.add.text(325, 400, 'Final Score: ' + score, {fontSize: '48px', fill: '#800020' });
    playAgain = game.add.text(325, 450, 'Play Again', {fontSize: '48px', fill: '#800020'});
    winButton = game.add.button(325, 450, 'winButton', reset, this);

    gameOverScreen.add(congrats);
    gameOverScreen.add(winButton);
    gameOverScreen.add(playAgain);
    gameOverScreen.add(finalScore);

    game.camera.follow(gameOverScreen);
    
}

function gameOver() {

    gameOverScreen = game.add.group();

    background = gameOverScreen.create(0, 0, 'gameOver');
    finalScore = game.add.text(300, 400, 'Final score: ' + score, {fontSize: '48px', fill: '#800020'});
    playAgain = game.add.text(300, 450, 'Play Again?', {fontSize: '48px', fill: '#800020'});
    playAgainButton = game.add.button(300, 450, 'playAgainButton', reset, this);

    gameOverScreen.add(playAgainButton);
    gameOverScreen.add(playAgain);
    gameOverScreen.add(finalScore);

    game.camera.follow(gameOverScreen);
}

function reset() {
    
    gameOverScreen.visible =! gameOverScreen.visible;
    
    score = 0;
    scoreBoard.text = 'Score: ' + score;
    lives = 100;
    lifeBar.text = 'Life left: ' + lives;
    bossHealth = 50;
    bossHealthBar.text = "Boss health: " + bossHealth;

    //boss.kill();
    hero.kill();
    sword.kill();

    // TODO Make boss go away if you lose 

    createHero()

    summonHoard()

    game.camera.follow(hero);
}


