# Project_One

# 2021 - A Zombie Survival Game

## Game idea

2D Dungeon crawler where you're in a house full of zombies trying to clear out the house to survive for the night.
Each room will spawn a random amount of zombies to fight off. Health will be low and once dead, the game will give a game over and you have to restart.

No one quite knows how it started, WW3, Corona, tear gas, the "deep fake". But whatever it was, it ended with zombies. Those who survived are now stuck scavenging for food and shelter. Enter you, it's late and your group has tasked you with clearing out and finding shelter before it gets too late.

## Wireframe

![](img/wireframe.png)

## Tech Stack

- HTML/CSS
- Javascript
- Phaser.io 2.6.2

## MVP Goals

- sprite enters room - DONE
- zombies spawn - DONE
- sprite defeats zombies (thows knife or swings sword) - DONE
- move to next room, repeat - DONE
- score increase with each kill - DONE

## Stretch Goals

- LOTS OF ROOMS!!! - DONE
- different weapons
- zombie boss in specific room - DONE
- health regen abilities (i.e. find a heart = gain more life)
- cool sound effects
- Add your own name
- time attack mode - race against the clock.

## Roadblocks

- Don't know how to use phaser yet
- Update: Learned phaser with using online tutorials from their website. This is what I used primarily when building this game. All of my functions and game manipulation come from phaser and not using the DOM elements. Phaser was very easy to work with, and very enjoyable.
- Need to get better with grid
- Update: didn't actually need grid because phaser builds the canvas with one line of code. Did still build a grid for the game that didn't end up getting used.

## Known Bugs
- If you die and the final boss is alive, a second final boss appears on restart and the first one is still there. If you beat only one, it triggers the win function. So you always have at least two once you lose.
- If you get stuck on a wall, the sword still moves forward without you and then get stuck floating out in space. To fix this, you can walk towards the wall where the sword is and reduce the distance back to normal.

## Acknowledgments 

- Pixel art came from the following:
- pixel sword: nicepng.com
- pixel hero: pngfind.com
- zombies: hiclipart.com
- floor and walls: deviantart.com
- doors: pixelworld
- I used pixlr.com to get my images set up to be put into png format so I could use them.
- most of my phaser knowledge came from the following sources:
- https://cragl.cs.gmu.edu/teaching/cs325/phaser-1.1.6/examples/index.html
- http://phaser.io/docs/2.6.2/index
- https://phaser.io/tutorials/making-your-first-phaser-2-game
- music (once it's working) credit goes to my boy Naimada, maker of the chillest/sickest beats. Follow him on spotify for some of the best beats to work to. 