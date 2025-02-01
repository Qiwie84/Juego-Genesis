const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Configuración de la pantalla
const resizeCanvas = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
};
window.addEventListener("resize", resizeCanvas);
resizeCanvas();


// Cargar imágenes
const playerImage = new Image();
playerImage.src = 'imgs/messi.png';
const bulletImage = new Image();
bulletImage.src = 'imgs/corazón.png'; // Imagen de la bala
const enemyImage = new Image();
enemyImage.src = 'imgs/antonela.png';

// Jugador
const player = {
    x: canvas.width / 2 - 30,
    y: canvas.height / 2 - 30,
    width: 60,
    height: 60,
};

// Enemigos
const enemies = [];
const enemySpeed = 5;

// Contador de eliminaciones
let killCount = 0;

// Variables de control del movimiento
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

// Variables de balas
const bullets = [];

// Variables de intervalo de disparo
let bulletInterval = 125; // 125 ms = 8 balas por segundo
let lastBulletTime = 0;

// Actualizar juego (sin delay)
function updateGame() {
    const currentTime = Date.now();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mover al jugador con el mouse o el toque táctil
    player.x = mouseX - player.width / 2;
    player.y = mouseY - player.height / 2;

    // Limitar movimiento al área del canvas
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y > canvas.height - player.height) player.y = canvas.height - player.height;

    // Mover enemigos
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += enemySpeed;
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            i--;
        }
    }

    // Colisiones con enemigos
    for (let i = 0; i < enemies.length; i++) {
        if (isCollision(player, enemies[i])) {
            alert("¡Perdiste!");
            resetGame();
            break;
        }
    }

    // Dibujar todo
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    for (let i = 0; i < enemies.length; i++) {
        ctx.drawImage(enemyImage, enemies[i].x, enemies[i].y, 60, 60);
    }

    // Mostrar el contador de eliminaciones
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Eliminaciones: " + killCount, 20, 40);

    // Disparo automático
    if (currentTime - lastBulletTime >= bulletInterval) {
        const bullet = {
            x: player.x + player.width / 2 - 25,
            y: player.y - 20, // 20 píxeles por encima de Messi
            width: 50,
            height: 50
        };
        bullets.push(bullet);
        lastBulletTime = currentTime;
    }

    // Mover balas
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= 10; // Velocidad de la bala
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }

    // Colisiones con balas
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

    // Dibujar las balas (corazón.png)
    for (let i = 0; i < bullets.length; i++) {
        ctx.drawImage(bulletImage, bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
    }

    requestAnimationFrame(updateGame);
}

// Detectar colisión
function isCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Generar enemigos aleatorios
function generateEnemy() {
    const x = Math.random() * (canvas.width - 60);
    enemies.push({ 
        x, 
        y: 0, 
        width: 60, // Ancho de la imagen de Antonella
        height: 60,
        imageWidth: 60, // Ancho original
        imageHeight: 60 // Altura original
    });
}


// Iniciar el juego
function resetGame() {
    player.x = canvas.width / 2 - 30;
    player.y = canvas.height / 2 - 30;
    enemies.length = 0;
    killCount = 0;
}

// Control con el mouse
canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Control táctil para mover
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
});

// Generar enemigos cada 200ms (la mitad de rápido que antes)
setInterval(generateEnemy, 200);


// Esperar que las imágenes se carguen antes de iniciar el juego
let imagesLoaded = 0;
const totalImages = 3;

const incrementImageLoadCount = () => {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        updateGame();
    }
};

playerImage.onload = incrementImageLoadCount;
bulletImage.onload = incrementImageLoadCount;
enemyImage.onload = incrementImageLoadCount;
