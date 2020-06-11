//console.log("test");

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update})

function preload() {
    game.load.image('floor', 'img/flooringFinal.png')
    game.load.image('hero', 'img/x.png')
    game.load.image('zombie', 'img/zombie.png');
    game.load.image('wallVert', 'img/wallVertActualFinal.png');
    game.load.image('wallHorizontal', 'img/wallHorizontalFinal.png');
}

/* ----------------------- GROUPS HERE ------------------------ */

let walls;
let zombieHorde; 
let hero;



function create() {
    // startin up them physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    let floor = game.add.sprite(0, 0, 'floor');
    floor.scale.setTo(1, 1);

    // set up walls grouping
    walls = game.add.group();
    walls.enableBody = true;

    // top wall
    let wallVert = walls.create(0, 0, 'wallVert');
    wallVert.scale.setTo(1, 1);
    wallVert.body.immovable = true;

    // bottom wall
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

    // add hero and their physics
    player = game.add.sprite(375, 500, 'hero');
    game.physics.arcade.enable(player);
    player.body.collideWorldBoundaires = true;

    // Zombie Horde
    zombieHorde = game.add.group();
    zombieHorde.enableBody = true;
    game.physics.arcade.enable(zombieHorde);

    for (i = 0; i < Math.floor(Math.random() * 11); i++) {
        let hoard = zombieHorde.create(game.world.randomX, game.world.randomY, 'zombie');
        hoard.body.collideWorldBoundaires = true;
        hoard.body.velocity.x = Math.floor(Math.random() * 100);
        hoard.body.velocity.y = Math.floor(Math.random() * 100);
    }

    // create keyboard management
    cursors = game.input.keyboard.createCursorKeys();

    // Create Score board and Lives Bar
    scoreBoard = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#ffffff'});
    livesBar = game.add.text(600, 16, 'Lives Left: 10', {fontSize: '32px', fill: '#ffffff'});
}

function update() {

    // physics for player and walls && hoard and walls
    game.physics.arcade.collide(player, walls);
    game.physics.arcade.collide(zombieHorde, walls);

    // lets give some movement to our hero
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    //TODO Map WASD, Not Arrows  && Add swiping sword function //
    if (cursors.up.isDown) {
        player.body.velocity.y = -150
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = 150
    }
    else if (cursors.down.isDown) {
        player.body.velocity.y = 150
    }
    else if (cursors.left.isDown) {
        player.body.velocity.x = -150
    } else {
        player.animations.stop();
    }

    // Center game on screen
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
}