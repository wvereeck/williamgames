// speed_runner/game.js
window.onload = function() {
    let canvas = document.getElementById('gameCanvas');
    canvas.style.border = '5px solid black';
    const ctx = canvas.getContext('2d');

    const player = {
        x: canvas.width / 2,
        y: canvas.height - 30,
        width: 20,
        height: 30,
        dx: 0,
        dy: 0,
        jumping: false,
        onPlatform: true
    };

    let platforms = [];
    let level = 1;
    let lastTime = 0;
    let keys = {};

    let finishLiney = 100

    function loadLevel() {
        fetch(`levels/level${level}.json`)
            .then(response => response.json())
            .then(data => platforms = data);
        player.x = canvas.width / 2;
        player.y = canvas.height - 30;
    }

    function drawPlayer() {
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawPlatforms() {
        for (const platform of platforms) {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }
    }

    function drawLevel() {
        ctx.font = '20px Arial';
        ctx.fillText(`Level: ${level}`, 10, 30);
        ctx.fillRect(0, finishLiney, canvas.width, 5); // finish line
    }

    function drawYouWin() {
        // Clear the game canvas and display the win message
        ctx.clearRect(0, 100, canvas.width, canvas.height);
        ctx.font = '50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('YOU WIN!', canvas.width / 2, canvas.height / 2);
    }

    function updatePlayer(time = 0) {
        const deltaTime = (time - lastTime) / 10; // convert to seconds
        lastTime = time;
        player.onPlatform = false;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (level <= 5) { 
            drawPlatforms(); 
            drawLevel();
        } else { 
            drawYouWin(); 
        }
        drawPlayer();


        player.dx = 0;
        if (keys['ArrowRight'] && !keys['ArrowLeft']) player.dx = 3;
        if (keys['ArrowLeft'] && !keys['ArrowRight']) player.dx = -3;
        if (keys['ArrowDown'] && player.onPlatform) player.onPlatform = false;
        if ((keys[' '] || keys['ArrowUp'] ) && !player.jumping) {
            player.jumping = true;
            player.dy = -8;
        }
        player.x += player.dx * deltaTime;
        if (player.jumping) {
            player.y += player.dy * deltaTime;
            player.dy += 0.3 * deltaTime; // gravity, adjusted for deltaTime
        }
        for (const platform of platforms) {
            if (player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y < platform.y  &&
                player.y + player.height > platform.y &&
                player.dy > 0) {
                player.y = platform.y - player.height;
                player.dy = 0;
                player.jumping = false;
                player.onPlatform = true;
            }
        }

        if (player.y + player.height > canvas.height) { // ground
            player.y = canvas.height - player.height;
            player.dy = 0;
            player.jumping = false;
            player.onPlatform = true;
        }
        if (player.x + player.width > canvas.width) {
            player.x = canvas.width - player.width;
        }
        if (player.x < 0) {
            player.x = 0;
        }
        if (!player.onPlatform) {
            player.jumping = true;
        }
 
        // Check if the player has reached the finish line
        if (player.y <= finishLiney) {
            level++;
            loadLevel();
        }

        requestAnimationFrame(updatePlayer);
    }

    window.addEventListener('keydown', function(e) {
        keys[e.key] = true;
    });

    window.addEventListener('keyup', function(e) {
        keys[e.key] = false;
    });

    loadLevel();
    requestAnimationFrame(updatePlayer);
}