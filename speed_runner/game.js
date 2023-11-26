// speed_runner/game.js
window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const player = {
        x: canvas.width / 2,
        y: canvas.height - 30,
        width: 20,
        height: 30,
        dx: 2,
        dy: -2,
        jumping: false
    };

    let platforms = [];
    let level = 1;

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

    function updatePlayer() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawPlatforms();
        drawLevel();
        player.x += player.dx;
        if (player.jumping) {
            player.y += player.dy;
            player.dy += 0.5; // gravity
        }
        for (const platform of platforms) {
            if (player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y < platform.y + platform.height &&
                player.y + player.height > platform.y) {
                player.y = platform.y - player.height;
                player.dy = 0;
                player.jumping = false;
            }
        }
        if (player.y + player.height > canvas.height) { // ground
            player.y = canvas.height - player.height;
            player.dy = 0;
            player.jumping = false;
        }
        if (player.x + player.width > canvas.width || player.x < 0) {
            player.dx *= -1;
        }
        requestAnimationFrame(updatePlayer);
    }

    updatePlayer();

    window.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            player.dx = Math.abs(player.dx);
        } else if (e.key === 'ArrowLeft') {
            player.dx = -Math.abs(player.dx);
        } else if (e.key === ' ' && !player.jumping) {
            player.jumping = true;
            player.dy = -10;
        }
    });

    loadLevel();
}