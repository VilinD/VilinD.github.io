const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");

let frames = 0;
const DEGREE = 180 / Math.PI;
const sprite = new Image();
sprite.src = "img/sprite.png";

const gameState = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}

const startBtn = {
    x : 120,
    y : 263,
    w: 83,
    h : 29,
}

const newScore_sound = new Audio();
newScore_sound.src = "audio/sfx_point.wav"; 

const onFlap_sound = new Audio();
onFlap_sound.src = "audio/sfx_flap.wav"; 

const death_sound = new Audio();
death_sound.src = "audio/sfx_die.wav"; 

const pipeHit_sound = new Audio();
pipeHit_sound.src = "audio/sfx_hit.wav"; 

const swooshing_sound = new Audio();
swooshing_sound.src = "audio/sfx_swooshing.wav"; 


cvs.addEventListener("click", function (evt) {
    switch (gameState.current) {
        case gameState.getReady:
            gameState.current = gameState.game;
            swooshing_sound.play();
            break;
        case gameState.game:
            bird.flap();
            onFlap_sound.play();
            break;
        case gameState.over:
            let rect = cvs.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;

            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
                resetGame();
                gameState.current = gameState.getReady;
            }

            break;
    }
});



const background = {
    sX: 0,
    sY: 0,
    w: 275,
    h: 226,
    x: 0,
    y: cvs.height - 226,

    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }
}

const foreground = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: cvs.height - 112,

    deltaX: 2,

    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },

    update: function () {
        if (gameState.current == gameState.game) {
            this.x = (this.x - this.deltaX) % (this.w / 2);
        }
    },
}

const bird = {
    animation: [
        { sX: 276, sY: 112 },
        { sX: 276, sY: 139 },
        { sX: 276, sY: 164 },
        { sX: 276, sY: 139 },
    ],
    x: 50,
    y: 150,
    w: 34,
    h: 26,

    frame: 0,

    gravity: 0.25,
    jump: 4.6,
    speed: 0,
    rotation: 0,
    radius: 12,

    draw: function () {
        let bird = this.animation[this.frame];

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, - this.w / 2, - this.h / 2, this.w, this.h);

        ctx.restore();
    },
    flap: function () {
        this.speed = - this.jump;
    },

    update: function () {
        this.period = gameState.current == gameState.getReady ? 10 : 5;
        this.frame += frames % this.period == 0 ? 1 : 0;
        this.frame = this.frame % this.animation.length;

        if (gameState.current == gameState.getReady) {
            this.y = 150;
            this.rotation = 0 * DEGREE;
        } else {
            this.speed += this.gravity;
            this.y += this.speed;

            if (this.y + this.h / 2 >= cvs.height - foreground.h) {
                this.y = cvs.height - foreground.h - this.h / 2;
                if (gameState.current == gameState.game) {
                    gameState.current = gameState.over;
                    death_sound.play();
                }
            }

            if (this.speed >= this.jump) {
                this.rotation = -90 * DEGREE;
                this.frame = 1;
            } else {
                this.rotation = 25 * DEGREE;
            }
        };
    },
}

const pipes = {
    position: [],
    top: {
        sX: 553,
        sY: 0,
    },

    bottom: {
        sX: 502,
        sY: 0,
    },

    w: 53,
    h: 400,
    gap: 85,
    maxYPos: -150,
    deltaX: 2,

    draw: function () {
        for (let i = 0; i < this.position.length; i++) {
            let pipe = this.position[i];

            let topYPosition = pipe.y;
            let bottomYPosition = pipe.y + this.h + this.gap;

            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, pipe.x, topYPosition, this.w, this.h);
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, pipe.x, bottomYPosition, this.w, this.h);
        }
    },
    update: function () {
        if (gameState.current != gameState.game) {
            return;
        }

        if (frames % 100 == 0) {
            this.position.push({
                x: cvs.width,
                y: this.maxYPos * (Math.random() + 1),
            })
        }
        for (let i = 0; i < this.position.length; i++) {
            let pipe = this.position[i]

            pipe.x -= this.deltaX;
            let bottomYPosition = pipe.y + this.h + this.gap;

            if(bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + this.w && bird.y + bird.radius > pipe.y && bird.y - bird.radius < pipe.y + this.h){
                gameState.current = gameState.over;
                pipeHit_sound.play();
            }

            if(bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + this.w && bird.y + bird.radius > bottomYPosition && bird.y - bird.radius < bottomYPosition + this.h){
                gameState.current = gameState.over;
                pipeHit_sound.play();
            }

            if(pipe.x + this.w <= 0){
                this.position.shift();
                score.currentScore++;
                newScore_sound.play();

                score.best = Math.max(score.currentScore, score.best);
                localStorage.setItem("best",score.best);

            }
        }

    },


};

const score = {
    best : parseInt(localStorage.getItem("best")) || 0,
    currentScore : 0,

    draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000"

        if(gameState.current == gameState.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.currentScore,cvs.width / 2,50);
            ctx.strokeText(this.currentScore,cvs.width / 2,50);  
        }else if(gameState.current == gameState.over){
            ctx.font = "25px Teko";
            ctx.fillText(this.currentScore,225,186);
            ctx.strokeText(this.currentScore,225,186);

            ctx.fillText(this.best,225,228);
            ctx.strokeText(this.best,225,228);
        }
    } 
}


const getReady = {
    sX: 0,
    sY: 228,
    w: 173,
    h: 152,
    x: cvs.width / 2 - 173 / 2,
    y: 80,
    draw: function () {
        if (gameState.current == gameState.getReady) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
};


const gameOver = {
    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: cvs.width / 2 - 225 / 2,
    y: 90,
    draw: function () {
        if (gameState.current == gameState.over) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
};

function draw() {
    ctx.fillStyle = "#70C5CE";
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    background.draw();
    pipes.draw();
    foreground.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
}

function update() {
    bird.update();
    foreground.update();
    pipes.update();
}


function loop() {
    update();
    draw();
    frames++;

    requestAnimationFrame(loop);
}

loop();

function resetGame(){
    bird.speed = 0;
    pipes.position = [];
    score.currentScore = 0;
}