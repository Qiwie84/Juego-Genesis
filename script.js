        // Variables para el control de los movimientos
let touchStartX = 0;
let lastTouchX = 0; // Para seguir el movimiento

// Función de actualización del juego
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mover jugador con el desplazamiento táctil
    if (isMoving) {
        const deltaX = touchStartX - lastTouchX; // Diferencia en la posición del dedo
        player.x += deltaX;

        // Limitar el movimiento del jugador dentro del canvas
        if (player.x < 0) player.x = 0;
        if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
    }

    lastTouchX = touchStartX; // Actualizar la posición del dedo

    // Mover balas
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bulletSpeed;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }

    // Mover enemigos
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += enemySpeed;
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            i--;
        }
    }

    // Colisiones
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (isCollision(bullets[i], enemies[j])) {
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                killCount++;
                i--;
                break;
            }
        }
    }

    // Colisión jugador-enemigos
    for (let i = 0; i < enemies.length; i++) {
        if (isCollision(player, enemies[i])) {
            alert("¡Perdiste!");
            resetGame();
            break;
        }
    }

    // Dibujar todo
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    for (let i = 0; i < bullets.length; i++) {
        ctx.drawImage(bulletImage, bullets[i].x, bullets[i].y, 50, 50);
    }
    for (let i = 0; i < enemies.length; i++) {
        ctx.drawImage(enemyImage, enemies[i].x, enemies[i].y, 60, 60);
    }

    // Mostrar el contador de eliminaciones
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Eliminaciones: " + killCount, 20, 40);

    requestAnimationFrame(updateGame);
}

// Control táctil o clic
canvas.addEventListener('mousedown', (e) => {
    e.preventDefault();
    touchStartX = e.clientX;
    lastTouchX = touchStartX; // Inicializar la última posición
    isMoving = true;
    shootBullet();
});

canvas.addEventListener('mousemove', (e) => {
    if (isMoving) {
        touchStartX = e.clientX;
    }
});

canvas.addEventListener('mouseup', () => {
    isMoving = false;
});

// Disparo automático mientras se mueve
function shootBullet() {
    setInterval(() => {
        bullets.push({ x: player.x + player.width / 2 - 25, y: player.y, width: 50, height: 50 });
    }, 100);
}
