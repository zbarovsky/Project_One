//console.log("test");

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update})

function preload() {
    game.load.image('hero', 'img/X.png')
}

function create() {
    // startin up them physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    player = game.add.sprite(0,0, 'hero')
    //physics to player
    game.physics.arcade.enable(player)

    // create keyboard management
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {

    // lets give some movement to our hero
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    //TODO Set WASD, Not Arrows //
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