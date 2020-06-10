//console.log("test");

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update})

function preload() {
    
}

function create() {

}

function update() {
    // Center game on screen
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
}