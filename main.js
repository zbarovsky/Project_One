//console.log("test");

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update})

function preload() {
    game.load.image('floor', 'img/flooringFinal.png')

    game.load.image('hero', 'img/x.png')
    game.load.image('zombie', 'img/zombie.png');
    game.load.image('sword', 'img/swordFinal.png');

    game.load.image('wallVert', 'img/wallVertActualFinal.png');
    game.load.image('wallHorizontal', 'img/wallHorizontalFinal.png');

    game.load.image('northDoor', 'img/northDoor.png');
    game.load.image('eastDoor', 'img/eastDoor.png');
    game.load.image('southDoor', 'img/southDoor.png');
    game.load.image('westDoor', 'img/westDoor.png');
    
    game.load.image('gameOver', 'img/gameOverScreen.png');
    game.load.image('playAgainButton', 'img/playAgainButton.png');
}

/* ----------------------- Global Variables HERE ------------------------ */

let floor;
let walls;

let doors;
let northDoor;
let southDoor;
let eastDoor;
let westDoor;

let zombieHorde; 
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

/* --------------------- CREATE and UPDATE Functions -------------------------- */

function create() {
    // startin up them physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    createFloor()

    // set up walls grouping
    walls = game.add.group();
    walls.enableBody = true;

    createRoom()

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
    
    summonHoard()

    // create keyboard management
    cursors = game.input.keyboard.createCursorKeys();

    // Create Score board and Lives Bar
    scoreBoard = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#ffffff'});
    lifeBar = game.add.text(600, 16, 'Life: 100', {fontSize: '32px', fill: '#ffffff'});
}

function update() {

    // physics for player and walls && hoard and walls
    game.physics.arcade.collide(hero, walls);
    // game.physics.arcade.collide(hero, zombieHorde);

    game.physics.arcade.collide(sword, hero);
    game.physics.arcade.collide(sword, walls);
    // game.physics.arcade.collide(sword, zombieHorde);

    game.physics.arcade.collide(zombieHorde, walls);

    // lets give some movement to our hero && sword
    hero.body.velocity.x = 0;
    sword.body.velocity.x = 0;

    hero.body.velocity.y = 0;
    sword.body.velocity.y = 0;

    //TODO Map WASD, Not Arrows  && Add swiping sword function //
    if (cursors.up.isDown) {
        hero.body.velocity.y = -150;
        sword.anchor.x = -0.5;
        sword.anchor.y = 0.1;
        sword.body.velocity.y = -150;
    }
    else if (cursors.right.isDown) {
        hero.body.velocity.x = 150;
        sword.anchor.x = -1.5;
        sword.anchor.y = -1;
        sword.body.velocity.x = 150
    }
    else if (cursors.down.isDown) {
        hero.body.velocity.y = 150;
        sword.anchor.x = -0.15;
        sword.anchor.y = -2.4;
        sword.body.velocity.y = 150;
    }
    else if (cursors.left.isDown) {
        hero.body.velocity.x = -150
        sword.anchor.x = 1;
        sword.anchor.y = -1;
        sword.body.velocity.x = -150
    } else {
        hero.animations.stop();
        sword.animations.stop();
    }

    // collision detections for sword -> zombie && zombie -> player

    game.physics.arcade.overlap(sword, zombieHorde, slayZombies, null, this);

    function slayZombies (sword, zombieHorde) {
        zombieHorde.kill();

        score +=10;
        scoreBoard.text = 'Score: ' + score;

        //write win function
        //win();
    }

    game.physics.arcade.overlap(player, zombieHorde, slayHero, null, this);

    function slayHero (player, zombieHorde) {
        lives -=1;
        //console.log(lives)
        if (lives == 0) {
            player.kill()
            sword.kill()
            gameOver()
               
        }
        lifeBar.text = "Life left: " + lives;
    }

    // Center game on screen
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
}

/* ------------------- GAME FUNCTIONS ---------------------- */

function createFloor () {
    let floor = game.add.sprite(0, 0, 'floor');
    floor.scale.setTo(1, 1);
    } 

function createRoom () {

    // North wall
    let wallVert = walls.create(0, 0, 'wallVert');
    wallVert.scale.setTo(1, 1);
    wallVert.body.immovable = true;

    // South wall
    wallVert = walls.create (0, 575, 'wallVert')
    wallVert.scale.setTo(1, 1);
    wallVert.body.immovable = true;

    // East Wall
    let wallHorizontal = walls.create (750, 0, 'wallHorizontal');
    wallHorizontal.scale.setTo(1, 1);
    wallHorizontal.body.immovable = true;

    // Weast wall
    wallHorizontal = walls.create (-50, 0, 'wallHorizontal');
    wallHorizontal.scale.setTo(1, 1);
    wallHorizontal.body.immovable = true;

}

function createDoors() {
    // North door
    let northDoor = doors.create(375, 15, 'northDoor');
    northDoor.body.immovable = true;

    // East door
    let eastDoor = doors.create(740, 275, 'eastDoor');
    eastDoor.body.immovable = true;

    // South door
    let southDoor = doors.create(375, 565, 'southDoor');
    southDoor.body.immovable = true;

    // Weast door
    let westDoor = doors.create(-30, 275, 'westDoor');
    westDoor.body.immovable = true;

} 

function createHero() {

    hero = player.create(375, 500, 'hero');
    game.physics.arcade.enable(player);
    hero.body.collideWorldBoundaires = true;

    //sword to hero
    sword = player.create(375, 475, 'sword');
    game.physics.arcade.enable(sword);
    sword.scale.setTo(.3, .3);
} 

function summonHoard() {

    for (i = 0; i < Math.floor(Math.random() * 30); i++) {
        let hoard = zombieHorde.create(game.world.randomX, game.world.randomY, 'zombie');
        hoard.body.collideWorldBoundaires = true;
        game.physics.arcade.moveToXY(hoard, Math.floor(Math.random() * 400), Math.floor(Math.random() * 600), speed = 30);

        //TODO Respawn function for different rooms
    }
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
}

function reset() {
    //console.log("games reset dawg");
    
    gameOverScreen.visible =! gameOverScreen.visible;
    
    score = 0;
    scoreBoard.text = 'Score: ' + score;
    lives = 100;
    lifeBar.text = 'Life left: ' + lives;
    
    createHero()
    
    summonHoard()
}
        
        

/* --------------------------- ARCHIVE -------------------- */

// "swing" dat sword boi
    // if (cursors.up.isDown && spacebar.isDown) {
    //     sword.body.velocity.y = -75;
    //     hero.body.velocity.y = -20;
    // } else if (cursors.right.isDown && spacebar.isDown) {
    //     sword.body.velocity.x = 75;
    //     hero.body.velocity.x = 20;
    // } else if (cursors.down.isDown && spacebar.isDown) {
    //     sword.body.velocity.y = 75;
    //     hero.body.velocity.y = 20;
    // } else if (cursors.left.isDown && spacebar.isDown) {
    //     sword.body.velocity.x = -75;
    //     hero.body.velocity.x = -20;
    // }

    // switch (e.key) {
    //     case "w":
    //     hero.body.velocity.y = -150;
    //     break;
    // }
