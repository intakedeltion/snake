let Canva = document.getElementById("Canva")
let ctx = Canva.getContext("2d");
Canva.addEventListener("mousemove", handleMouseMove);

let fork = document.getElementById("fork");
let knife = document.getElementById("knife");
let scoreText = document.getElementById("score");
let controlsinput = document.getElementById("controls");

let deadAudio = new Audio();
deadAudio.src = 'plate.mp3';

let eatAudio = new Audio();
eatAudio.src = 'eat.m4a';

let backgroundAudio = new Audio();
backgroundAudio.src = 'background.m4a';

let gameovere = false;
let gamestarted = false;

let controls = localStorage.getItem('controls');

let highscore = localStorage.getItem('highscore');

let randomColor;
let score = 0;
let food = { x: 0, y: 0, size: 8, color: ['green', 'yellow', '#652604', 'red'] };
let snakepart = [
];

//snake's basic states
let snake =
{
    x: 350,
    y: 350,
    angle: 0,
    speed: 1,
    sizex: 20,
    sizey: 20
};

if (highscore == null) {
    highscore = 0;
}

if (!window.location.pathname.endsWith("/settings.html")) {
    scoreText.innerHTML = "Score: " + score + " Highscore: " + highscore;
}

if (window.location.pathname.endsWith("/settings.html")) {
    if (controls == "AD") {
        controlsinput.selectedIndex = 0;
    }
    else if (controls == "Mouse") {
        controlsinput.selectedIndex = 1;
    }
}

//here i check value if the thing if mouse if out
controlsinput.onmouseout = function () {
    if (controlsinput.value == "WASD && Arrows") {
        controls = "AD";
        localStorage.setItem('controls', controls);
    }
    else if (controlsinput.value == "Mouse") {
        controls = "Mouse";
        localStorage.setItem('controls', controls);
    }
}

//here givce the food random colour and random x and y as
function generateFood() {
    randomColor = Math.floor(Math.random() * 4)
    let randomNumber = Math.ceil(Math.random() * 4)

    if (randomNumber == 1) {
        food.x = 375 + (Math.floor(Math.random() * 370));
        food.y = 375 + (Math.floor(Math.random() * (370 - (food.x - 375))));
    }
    else if (randomNumber == 2) {
        food.y = 375 + (Math.floor(Math.random() * 370));
        food.x = 375 - (Math.floor(Math.random() * (370 - (food.y - 375))));
    }
    else if (randomNumber == 3) {
        food.x = 375 - (Math.floor(Math.random() * 370));
        food.y = 375 - (Math.floor(Math.random() * (food.x - 5)));
    }
    else if (randomNumber == 4) {
        food.y = 375 - (Math.floor(Math.random() * 370));
        food.x = 375 + (Math.floor(Math.random() * (food.y - 5)));
    }

    //here i check if  snakelength bigger or  =  2 the food and then if the foof spawns in snakes body if generate new coordinatie
    if (snakepart.length >= 2) {
        for (let i = 0; snakepart.length - 1 >= i; i++) {
            if (food.x - snakepart[i].x > -15 && food.x - snakepart[i] < 15 && food.y - snakepart[i].y > -15 && food.y - snakepart[i].y < 15) {
                generateFood();
            }
        }
    }

    //here i check if the  food spawns in snakes body if generate new coordinatie
    if (food.x - snake.x > -15 && food.x - snake.x < 15 && food.y - snake.y > -15 && food.y - snake.y < 15) {
        generateFood();
    }
}

//here i draw food on  the giving coordinatie
function drawFood() {

    ctx.fillStyle = food.color[randomColor];
    ctx.beginPath();
    ctx.arc(food.x, food.y, food.size, 0, 2 * Math.PI, false);
    ctx.fill();
}

// here i draw the snake on the canva
function drawSnake() {
    for (let i = snakepart.length - 1; 0 <= i; i--) {
        if (i == 0) {
            snakepart[i].x = snake.x;
            snakepart[i].y = snake.y;

            ctx.fillStyle = "#FFE4C4";
            ctx.fillRect(snakepart[i].x, snakepart[i].y, snake.sizex, snake.sizey);
        }
        else {
            snakepart[i].x = snakepart[i - 1].x;
            snakepart[i].y = snakepart[i - 1].y;

            ctx.fillStyle = "#FFE4C4";
            ctx.fillRect(snakepart[i].x, snakepart[i].y, snake.sizex, snake.sizey);
        }

    }

    if (score > 19) {
        snake.x += Math.cos(snake.angle) * snake.speed;
        snake.y += Math.sin(snake.angle) * snake.speed;

        ctx.fillStyle = "#EECBAD";
        ctx.fillRect(snake.x, snake.y, snake.sizex, snake.sizey);
    }
    else {
        snake.x += Math.cos(snake.angle) * snake.speed;
        snake.y += Math.sin(snake.angle) * snake.speed;

        ctx.fillStyle = "#FFE4C4";
        ctx.fillRect(snake.x, snake.y, snake.sizex, snake.sizey);
    }

}

//this is function when the gamestarted
function start() {

    if (gamestarted == false) {

        backgroundAudio.currentTime = 0;
        backgroundAudio.play();

        Canva.className = "Canva";
        ctx.clearRect(0, 0, Canva.width, Canva.height);

        snakepart = [];
        snake.x = 350;
        snake.y = 350;
        gameovere = false;
        gamestarted = true;
        score = 0;

        scoreText.innerHTML = "Score: " + score + " Highscore: " + highscore;

        generateFood();
        gameloop();
    }
}

//this function wen your are gameover
function gameover() {
    scoreText.innerHTML = "score: ";
    backgroundAudio.pause();
    Canva.className = "Canva2"
    deadAudio.play();

    if (highscore < score) {
        highscore = score;

        localStorage.setItem('highscore', highscore);
    }

    scoreText.innerHTML = "Score: " + score + " Highscore: " + highscore;

    gamestarted = false;
}

//this listen to your input
document.addEventListener("keydown", (event) => {

    //when you press spacebar
    if (event.keyCode == 32 && gamestarted == false && !window.location.pathname.endsWith("/settings.html")) {
        start();
    }
    //when you Left-pijl en A-key
    else if (event.keyCode == 37 || event.keyCode == 65 && controls == "AD") {
        snake.angle -= 0.3;
    }
    //when yyou press Recht-arrow en D-key
    else if (event.keyCode == 39 || event.keyCode == 68 && controls == "AD") {
        snake.angle += 0.3;
    }
})

//function for knife if you press the knife image
knife.onclick = function () {
    if (!window.location.pathname.endsWith("/settings.html") && gamestarted == false) {
        start();
    }
}

//function for knife animatie if you go over the knife image
knife.onmouseover = function () {
    knife.style.width = "100px";
};

//function for knife animatie if you go out the knife image
knife.onmouseout = function () {
    knife.style.width = "105px";
};

//function for forkif you press the fork image
fork.onclick = function () {
    if (gamestarted == false && window.location.pathname.endsWith("/settings.html")) {
        window.location.href = "index.html";
    }
    else if (gamestarted == false && !window.location.pathname.endsWith("/settings.html")) {
        window.location.href = "settings.html";
    }
}

//function for fork animatie if you go on the fork image
fork.onmouseover = function () {
    fork.style.width = "130px";
};

//function for fork animatie if you go out the fork image
fork.onmouseout = function () {
    fork.style.width = "135px";
};

//gets the input of the mouse angel and caluta's it his position for snake where he need to go
function handleMouseMove(event) {
    if (controls == "Mouse") {
        let rect = Canva.getBoundingClientRect();
        let mouseX = event.clientX - rect.left;
        let mouseY = event.clientY - rect.top;

        let dx = mouseX - snake.x;
        let dy = mouseY - snake.y;

        snake.angle = Math.atan2(dy, dx);
    }
}


//this the loop for the game
function gameloop() {
    let delay = 5;

    //this is that snake can hit h=is tail and be gameover if he has more then or = on 20 score
    if (score >= 20) {
        for (let i = 19; snakepart.length >= i; i++) {
            if (snakepart[i - 1].x - snake.x > (-snake.sizex / 2) && snakepart[i - 1].x - snake.x < (snake.sizex / 2) && snakepart[i - 1].y - snake.y > (-snake.sizey / 2) && snakepart[i - 1].y - snake.y < (snake.sizey / 2)) {
                gameovere = true;
                gameover();
            }
        }
    }

    if (gamestarted == true && gameovere == false) {
        //check if backgroundaudio is finish if so he play he again
        if (backgroundAudio.currentTime > 199) {
            backgroundAudio.pause();
            backgroundAudio.currentTime = 0;
            backgroundAudio.play();
        }

        //ckeck out if the snake touch the rand.
        if (snake.x < 0 || snake.x > 730 || snake.y < 0 || snake.y > 730 || snake.x + snake.y > 1250 || snake.x + snake.y < 230) {
            gameovere = true;
            gameover();
        }
        else {
            ctx.clearRect(0, 0, Canva.width, Canva.height);

            //here i check if snake over the food if so i spawn new 1 and pick this up and get point
            if (food.x - snake.x > -15 && food.x - snake.x < 15 && food.y - snake.y > -15 && food.y - snake.y < 15) {
                eatAudio.play();

                snakepart.push({ x: 0, y: 0 });
                score++;
                scoreText.innerHTML = "Score: " + score + " Highscore: " + highscore;

                generateFood();
            }
            else {
                drawFood();
            }

            drawSnake();
            setTimeout(gameloop, delay)
        }

    }
} 