// space_invaders/game.js
window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const spaceship = {
        x: canvas.width / 2,
        y: canvas.height - 30,
        width: 20,
        height: 30,
        dx: 2
    };

    function drawSpaceship() {
        ctx.beginPath();
        ctx.moveTo(spaceship.x, spaceship.y);
        ctx.lineTo(spaceship.x - spaceship.width / 2, spaceship.y + spaceship.height);
        ctx.lineTo(spaceship.x + spaceship.width / 2, spaceship.y + spaceship.height);
        ctx.closePath();
        ctx.fill();
    }

    function updateSpaceship() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSpaceship();
        spaceship.x += spaceship.dx;
        if (spaceship.x + spaceship.width / 2 > canvas.width || spaceship.x - spaceship.width / 2 < 0) {
            spaceship.dx *= -1;
        }
        requestAnimationFrame(updateSpaceship);
    }

    updateSpaceship();

    window.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            spaceship.dx = Math.abs(spaceship.dx);
        } else if (e.key === 'ArrowLeft') {
            spaceship.dx = -Math.abs(spaceship.dx);
        }
    });
}