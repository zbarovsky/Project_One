//console.log("test");

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update})

function preload() {
    game.load.image('floor', 'img/flooring.png')
    game.load.image('hero', 'img/x.png')
    game.load.image('zombie', 'img/zombie.png');
}

// Declare Group to attach sword to hero

// Declare Group that randomly spawns X number of zombies per room
// randomX && randomY for positioning
// Math.floor && Math.random for random amount of zombies


function create() {
    // startin up them physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'floor');

    // add hero and their physics
    player = game.add.sprite(375, 500, 'hero');
    game.physics.arcade.enable(player);

    // create keyboard management
    cursors = game.input.keyboard.createCursorKeys();

    // Create Score board and Lives Bar
    scoreBoard = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#ffffff'});
    livesBar = game.add.text(600, 16, 'Lives Left: 10', {fontSize: '32px', fill: '#ffffff'});
}

function update() {

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