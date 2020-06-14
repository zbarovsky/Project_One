//console.log("test");

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update})

function preload() {
    game.load.image('floor', 'img/flooringFinal.png')

    game.load.spritesheet('hero', 'img/heroSpritesheet.png', 50, 80)
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
    
    summonHoard()

    // create keyboard management
    cursors = game.input.keyboard.createCursorKeys();

    // Create Score board and Lives Bar
    scoreBoard = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#ffffff'});
    lifeBar = game.add.text(600, 16, 'Life: 100', {fontSize: '32px', fill: '#ffffff'});

    game.camera.follow(hero);
}

function update() {

    // physics for player and walls && hoard and walls
    game.physics.arcade.collide(hero, walls);
    game.physics.arcade.collide(sword, hero);
    game.physics.arcade.collide(sword, walls);
    // game.physics.arcade.collide(hero, doors);
    

    game.physics.arcade.collide(zombieHorde, walls);

    // lets give some movement to our hero && sword
    hero.body.velocity.x = 0;
    sword.body.velocity.x = 0;

    hero.body.velocity.y = 0;
    sword.body.velocity.y = 0;

    //TODO Map WASD, Not Arrows  && Add swiping sword function //
    if (cursors.up.isDown) {
        hero.body.velocity.y = -150;
        hero.animations.play('up');
        sword.anchor.x = -0.5;
        sword.anchor.y = 0.1;
        sword.body.velocity.y = -150;
    }
    else if (cursors.right.isDown) {
        hero.body.velocity.x = 150;
        hero.animations.play('right')
        sword.anchor.x = -1.5;
        sword.anchor.y = -1;
        sword.body.velocity.x = 150
    }
    else if (cursors.down.isDown) {
        hero.body.velocity.y = 150;
        hero.animations.play('down');
        sword.anchor.x = -0.15;
        sword.anchor.y = -3.5;
        sword.body.velocity.y = 150;
    }
    else if (cursors.left.isDown) {
        hero.body.velocity.x = -150
        hero.animations.play('left')
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

    game.physics.arcade.overlap(hero, zombieHorde, slayHero, null, this);

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

function createHero() {

    //hero = player.create(400, 300, 'hero');
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
        game.physics.arcade.moveToXY(hoard, Math.floor(Math.random() * 400), Math.floor(Math.random() * 600), speed = 30);

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

    game.camera.follow(gameOverScreen);
}

function reset() {
    
    gameOverScreen.visible =! gameOverScreen.visible;
    
    score = 0;
    scoreBoard.text = 'Score: ' + score;
    lives = 100;
    lifeBar.text = 'Life left: ' + lives;
    
    createHero()
    
    summonHoard()

    game.camera.follow(hero);
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
