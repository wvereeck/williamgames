// game.js

let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

// Define the current level
let currentLevel = 1;
let levelData;

// Define the ice cube
let iceCube = {
    x: null,
    y: null,
    size: 50,
    speed: 5,
    direction: null
};

// Define the play area
let playArea = {
    x: 0,
    y: iceCube.size,
    width: canvas.width,
    height: canvas.height
};

// Handle user input
window.addEventListener('keydown', function(event) {
    if (iceCube.direction !== null) {
        // Don't change direction if the ice cube is already in motion
        return;
    }

    switch (event.key) {
        case 'ArrowUp':
            iceCube.direction = 'up';
            break;
        case 'ArrowDown':
            iceCube.direction = 'down';
            break;
        case 'ArrowLeft':
            iceCube.direction = 'left';
            break;
        case 'ArrowRight':
            iceCube.direction = 'right';
            break;
    }
});

function loadLevel() {
    // Load level data
    fetch(`levels/level${currentLevel}.json`)
        .then(response => response.json())
        .then(data => {
            levelData = data;

            //Convert start, finish, and rock positions to pixels
            levelData.start.x = levelData.start.x * iceCube.size;
            levelData.start.y = levelData.start.y * iceCube.size + playArea.y;
            levelData.finish.x = levelData.finish.x * iceCube.size;
            levelData.finish.y = levelData.finish.y * iceCube.size + playArea.y;
            for (let rock of levelData.rocks) {
                rock.x = rock.x * iceCube.size;
                rock.y = rock.y * iceCube.size + playArea.y;
            }

            // Set the initial position of the ice cube to the start position
            iceCube.x = levelData.start.x;
            iceCube.y = levelData.start.y; // Adjust for the play area
        });
}

// Game loop
function gameLoop() {
    // Make sure levelData is defined
    if (!levelData) {
        console.log('levelData is not defined');
        requestAnimationFrame(gameLoop);
        return;
    }

    // Check if the ice cube is over the finish
    if (iceCube.x === levelData.finish.x && iceCube.y === levelData.finish.y) {
        // Display "Level Complete" message
        ctx.fillText('Level Complete', canvas.width / 2, canvas.height / 2);

        // Load the next level after a delay
        setTimeout(function() {
            currentLevel++;
            loadLevel();
        }, 3000);

        return; // Exit the game loop
    }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Display the level title
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(levelData.title, 10, 30);

    // Draw the start, finish, and rocks
    ctx.fillStyle = 'green';
    ctx.fillRect(levelData.start.x, levelData.start.y, iceCube.size, iceCube.size); // Adjust for the play area
    ctx.fillStyle = 'red';
    ctx.fillRect(levelData.finish.x, levelData.finish.y, iceCube.size, iceCube.size);
    ctx.fillStyle = 'gray';
    for (let rock of levelData.rocks) {
        ctx.fillRect(rock.x, rock.y, iceCube.size, iceCube.size);
    }

    // Update the ice cube's position based on its direction
    switch (iceCube.direction) {
        case 'up':
            if (iceCube.y - iceCube.speed >= playArea.y) {
                iceCube.y -= iceCube.speed;
            } else {
                iceCube.direction = null;
            }
            break;
        case 'down':
            if (iceCube.y + iceCube.size + iceCube.speed <= playArea.height) {
                iceCube.y += iceCube.speed;
            } else {
                iceCube.direction = null;
            }
            break;
        case 'left':
            if (iceCube.x - iceCube.speed >= playArea.x) {
                iceCube.x -= iceCube.speed;
            } else {
                iceCube.direction = null;
            }
            break;
        case 'right':
            if (iceCube.x + iceCube.size + iceCube.speed <= playArea.width) {
                iceCube.x += iceCube.speed;
            } else {
                iceCube.direction = null;
            }
            break;
    }

    // Check for collisions with rocks
    for (let rock of levelData.rocks) {
        switch(iceCube.direction) {
            case 'up':
                if (iceCube.x === rock.x && iceCube.y - iceCube.size === rock.y) {
                    iceCube.direction = null;
                }
                break;
            case 'down':
                if (iceCube.x === rock.x && iceCube.y + iceCube.size === rock.y) {
                    iceCube.direction = null;
                }
                break;
            case 'left':
                if (iceCube.x - iceCube.size === rock.x && iceCube.y === rock.y) {
                    iceCube.direction = null;
                }
                break;
            case 'right':
                if (iceCube.x + iceCube.size === rock.x && iceCube.y === rock.y) {
                    iceCube.direction = null;
                }
                break;
        }
    }

    // Draw the ice cube
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(iceCube.x, iceCube.y, iceCube.size, iceCube.size);

    requestAnimationFrame(gameLoop);
}

loadLevel();
gameLoop();