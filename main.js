//console.log("test");

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update})

function preload() {
    game.load.image('floor', 'img/flooringFinal.png')
    game.load.image('hero', 'img/x.png')
    game.load.image('zombie', 'img/zombie.png');
    game.load.image('wallVert', 'img/wallVertActualFinal.png');
    game.load.image('wallHorizontal', 'img/wallHorizontalFinal.png');
    game.load.image('sword', 'img/sword.png');
}

/* ----------------------- GROUPS HERE ------------------------ */

let walls;
let zombieHorde; 
let player;



function create() {
    // startin up them physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    let floor = game.add.sprite(0, 0, 'floor');
    floor.scale.setTo(1, 1);

    // set up walls grouping
    walls = game.add.group();
    walls.enableBody = true;

    // Top wall
    let wallVert = walls.create(0, 0, 'wallVert');
    wallVert.scale.setTo(1, 1);
    wallVert.body.immovable = true;

    // Bottom wall
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

    // player group -- create hero and their physics
    player = game.add.group();

    // hero
    hero = player.create(375, 500, 'hero');
    game.physics.arcade.enable(player);
    hero.body.collideWorldBoundaires = true;

    //sword to hero
    sword = player.create(375, 475, 'sword');
    game.physics.arcade.enable(sword);
    sword.scale.setTo(.3, .3);


    // Zombie Horde
    zombieHorde = game.add.group();
    zombieHorde.enableBody = true;
    game.physics.arcade.enable(zombieHorde);


    //TODO split up function to update for movement in different function
    for (i = 0; i < Math.floor(Math.random() * 11); i++) {
        let hoard = zombieHorde.create(game.world.randomX, game.world.randomY, 'zombie');
        hoard.body.collideWorldBoundaires = true;
        hoard.body.velocity.x = Math.floor(Math.random() * 100);
        hoard.body.velocity.y = Math.floor(Math.random() * 100);
    }

    // create keyboard management
    cursors = game.input.keyboard.createCursorKeys();
    spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // Create Score board and Lives Bar
    scoreBoard = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#ffffff'});
    livesBar = game.add.text(600, 16, 'Lives Left: 10', {fontSize: '32px', fill: '#ffffff'});
}

function update() {

    // physics for player and walls && hoard and walls
    game.physics.arcade.collide(hero, walls);
    game.physics.arcade.collide(sword, walls);
    game.physics.arcade.collide(sword, hero);
    game.physics.arcade.collide(zombieHorde, walls);

    // lets give some movement to our hero && sword
    hero.body.velocity.x = 0;
    sword.body.velocity.x = 0;

    hero.body.velocity.y = 0;
    sword.body.velocity.y = 0;

    //TODO Map WASD, Not Arrows  && Add swiping sword function //
    if (cursors.up.isDown) {
        hero.body.velocity.y = -150;
        sword.body.velocity.y = -150;
    }
    else if (cursors.right.isDown) {
        hero.body.velocity.x = 150;
        sword.body.velocity.x = 150
    }
    else if (cursors.down.isDown) {
        hero.body.velocity.y = 150;
        sword.body.velocity.y = 150;
    }
    else if (cursors.left.isDown) {
        hero.body.velocity.x = -150
        sword.body.velocity.x = -150
    } else {
        hero.animations.stop();
        sword.animations.stop();
    }

    // swing dat sword boi
    if (cursors.up.isDown && spacebar.isDown) {
        sword.body.velocity.y = -75;
        hero.body.velocity.y = -20;
    } else if (cursors.right.isDown && spacebar.isDown) {
        sword.body.velocity.x = 75;
        hero.body.velocity.x = 20;
    } else if (cursors.down.isDown && spacebar.isDown) {
        sword.body.velocity.y = 75;
        hero.body.velocity.y = 20;
    } else if (cursors.left.isDown && spacebar.isDown) {
        sword.body.velocity.x = -75;
        hero.body.velocity.x = -20;
    }

    // Center game on screen
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
}