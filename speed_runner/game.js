// speed_runner/game.js
window.onload = function() {
    let canvas = document.getElementById('gameCanvas');
    canvas.style.border = '5px solid black';
    const ctx = canvas.getContext('2d');

    const player = {
        x: canvas.width / 2,
        y: canvas.height - 30,
        width: 50,
        widthOffset: 15,
        height: 50,
        dx: 0,
        dy: 0,
        jumping: false,
        direction: 'left'
    };

    let platforms = [];
    let level = 1;
    let lastTime = 0;
    let keys = {};

    let finishLiney = 75

    let idleSprites = [];
    for (let i = 1; i <= 12; i++) {
        let idleSprite = new Image();
        idleSprite.src = `assets/sprites/Idle (${i}).png`;
        idleSprites.push(idleSprite);
    }
    let jumpSprites = [];
    for (let i = 1; i <= 12; i++) {
        let jumpSprite = new Image();
        jumpSprite.src = `assets/sprites/Jump (${i}).png`;
        jumpSprites.push(jumpSprite);
    }
    let walkSprites = [];
    for (let i = 1; i <= 12; i++) {
        let walkSprite = new Image();
        walkSprite.src = `assets/sprites/Walk (${i}).png`;
        walkSprites.push(walkSprite);
    }

    function loadLevel() {
        fetch(`levels/level${level}.json`)
            .then(response => response.json())
            .then(data => platforms = data);
        player.x = canvas.width / 2;
        player.y = canvas.height - 30;
        player.dx = 0;
        player.dy = 0;
    }

    function drawPlayer() {
        let frameCount = Math.floor(Date.now() / 35) % 12;
        let heightoffset = 5;
        ctx.save()
        if (player.jumping && player.direction === 'right') {
            ctx.drawImage(jumpSprites[frameCount], player.x, player.y + heightoffset, player.width, player.height);
        } else if (player.jumping && player.direction === 'left') {
            ctx.scale(-1, 1);
            ctx.drawImage(jumpSprites[frameCount], -player.x - player.width, player.y + heightoffset, player.width, player.height);
        } else if (player.dx === 0 && player.direction === 'right') {
            ctx.drawImage(idleSprites[frameCount], player.x, player.y + heightoffset, player.width, player.height);
        } else if (player.dx === 0 && player.direction === 'left') {
            ctx.scale(-1, 1);
            ctx.drawImage(idleSprites[frameCount], -player.x - player.width, player.y + heightoffset, player.width, player.height);
        } else if (player.direction === 'left'){
            ctx.scale(-1, 1);
            ctx.drawImage(walkSprites[frameCount], -player.x - player.width, player.y + heightoffset, player.width, player.height);
        } else {
            ctx.drawImage(walkSprites[frameCount], player.x, player.y + heightoffset, player.width, player.height);
        }
        ctx.restore()
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
        if (keys['ArrowRight'] && !keys['ArrowLeft']) {
            player.dx = 2.5;
            player.direction = 'right';
        }
        if (keys['ArrowLeft'] && !keys['ArrowRight']) {
            player.dx = -2.5;
            player.direction = 'left';
        }
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
            if (player.x < platform.x - player.widthOffset + platform.width &&
                player.x + player.width > platform.x + player.widthOffset &&
                player.y + player.height < platform.y  &&
                player.y + player.height + player.dy > platform.y &&
                player.dy > 0) {
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
        if (player.x > canvas.width - player.width + player.widthOffset) {
            player.x = canvas.width - player.width + player.widthOffset;
        }
        if (player.x < 0 - player.widthOffset) {
            player.x = 0 - player.widthOffset;
        }

        // Check if the player has fallen off the platform
        let onCurrentPlatform = false;
        if (player.y + player.height >= canvas.height) { // ground
            player.y = canvas.height - player.height;
            onCurrentPlatform = true;
        }
        for (const platform of platforms) {
            if (player.x < platform.x - player.widthOffset + platform.width &&
                player.x + player.width > platform.x + player.widthOffset &&
                player.y < platform.y  &&
                player.y + player.height >= platform.y) {
                onCurrentPlatform = true;
            }
        }
        if (!onCurrentPlatform) {
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