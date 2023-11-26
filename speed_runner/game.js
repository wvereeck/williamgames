// speed_runner/game.js
window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
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

    function loadLevel() {
        fetch(`levels/level${level}.json`)
            .then(response => response.json())
            .then(data => platforms = data);
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
    }

    function updatePlayer(time = 0) {
        const deltaTime = (time - lastTime) / 10; // convert to seconds
        lastTime = time;
        player.onPlatform = false;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawPlatforms();
        drawLevel();

        player.dx = 0;
        if (keys['ArrowRight'] && !keys['ArrowLeft']) player.dx = 2;
        if (keys['ArrowLeft'] && !keys['ArrowRight']) player.dx = -2;
        if (keys[' '] && !player.jumping) {
            player.jumping = true;
            player.dy = -8;
        }
        player.x += player.dx * deltaTime;
        if (player.jumping) {
            player.y += player.dy * deltaTime;
            player.dy += 0.2; // gravity, adjusted for deltaTime
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
        if (!player.onPlatform) {
            player.jumping = true;
        }
        if (player.x + player.width > canvas.width || player.x < 0) {
            player.dx *= -1;
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