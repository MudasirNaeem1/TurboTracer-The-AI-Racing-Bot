var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

canvas.width = self.innerWidth;
canvas.height = self.innerHeight;

var canvasW = canvas.width;
var canvasH = canvas.height;

var carW = canvasW / 30;
var carH = canvasH / 10;

var playerCarX = 4 * carW;
var playerCarY = canvasH - carH;

var playerCarSpeed = 0;
var playerCarAngle = 0;

var isPlayerAlive = false;

var settedPlayerSpeed = 0;
var settedPlayerAngle = 0;

var carSpeed = 0;
var carRotation = 0;

var populationSize = 0;
var cars = [];
var finishedCars = [];
var bestCarEver = 0;
var noEliteCars = 0;
var moveIndex = 0;

var difficultyLevel = 0;
var currentGeneration = 1;

var bestCompletionTime = 0;
var averageCompletionTime = 0;

var mainLoopId = 0;

var track = [{ startX: 0 * carW, startY: 3 * carH, trackWidth: 1 * carW, trackHeight: 7 * carH },
{ startX: 8 * carW, startY: 6 * carH, trackWidth: 1 * carW, trackHeight: 4 * carH },
{ startX: 0 * carW, startY: 3 * carH, trackWidth: 14 * carW, trackHeight: 1 * carH },
{ startX: 8 * carW, startY: 6 * carH, trackWidth: 12 * carW, trackHeight: 1 * carH },
{ startX: 13 * carW, startY: 0 * carH, trackWidth: 1 * carW, trackHeight: 3 * carH },
{ startX: 19 * carW, startY: 3 * carH, trackWidth: 1 * carW, trackHeight: 3 * carH },
{ startX: 13 * carW, startY: 0 * carH, trackWidth: 17 * carW, trackHeight: 1 * carH },
{ startX: 19 * carW, startY: 3 * carH, trackWidth: 5 * carW, trackHeight: 1 * carH },
{ startX: 29 * carW, startY: 0 * carH, trackWidth: 1 * carW, trackHeight: 10 * carH },
{ startX: 23 * carW, startY: 3 * carH, trackWidth: 1 * carW, trackHeight: 7 * carH }
]

var moveForward = false,
    moveBackward = false,
    turnLeft = false,
    turnRight = false;

function clear() {

    ctx.clearRect(0, 0, canvasW, canvasH);

}

function playerCarUpdate() {

    playerCarSpeed = 0;

    if (moveForward) {
        playerCarSpeed = -settedPlayerSpeed;
    }
    if (moveBackward) {
        playerCarSpeed = settedPlayerSpeed;
    }
    if (turnLeft) {
        playerCarAngle += settedPlayerAngle;
    }
    if (turnRight) {
        playerCarAngle -= settedPlayerAngle;
    }

    var playerDeltaX = playerCarSpeed * Math.sin(playerCarAngle * Math.PI / 180);
    var playerDeltaY = playerCarSpeed * Math.cos(playerCarAngle * Math.PI / 180);

    playerCarX += playerDeltaX;
    playerCarY += playerDeltaY;

    for (var i = 0; i < track.length; i++) {

        if (playerCarX <= track[i].startX + track[i].trackWidth && playerCarX + carW >= track[i].startX && playerCarY <= track[i].startY + track[i].trackHeight && playerCarY + carH >= track[i].startY) {

            isPlayerAlive = false;
            return;

        }

    }

}

function playerCarDraw() {

    ctx.save();
    ctx.translate(playerCarX + carW / 2, playerCarY + carH / 2);
    ctx.rotate(-playerCarAngle * Math.PI / 180);
    ctx.fillStyle = "Blue";
    ctx.fillRect(-carW / 2, -carH / 2, carW, carH);
    ctx.restore();

}

function updateCar(car) {

    if (!car.alive) return;

    var move;

    if (currentGeneration == 1 || car.survivalTime >= car.moves.length) {

        move = Math.floor(Math.random() * 3);
        car.moves.push(move);

    } else {

        move = car.moves[car.survivalTime];

    }

    car.survivalTime++;

    switch (move) {

        case 0:

            car.angle += carRotation;
            break;

        case 1:

            car.angle -= carRotation;
            break;

        case 2:

            break;

    }

    var deltaX = car.speed * Math.sin(car.angle * Math.PI / 180);
    var deltaY = car.speed * Math.cos(car.angle * Math.PI / 180);

    car.x += deltaX;
    car.y += deltaY;


    for (var i = 0; i < track.length; i++) {

        if (car.x <= track[i].startX + track[i].trackWidth && car.x + carW >= track[i].startX && car.y <= track[i].startY + track[i].trackHeight && car.y + carH >= track[i].startY) {

            car.alive = false;
            break;

        }

    }

    if (car.y + carH >= canvasH && car.x >= 23 * carW + 1 * carW && car.x + carW <= 29 * carW) {

        finishedCars.push(car);
        carIndex = cars.indexOf(car);
        cars.splice(carIndex, 1);
        populationSize--;
        console.log("Finished.");

    }

    if (car.y + carH >= canvasH) {
        car.alive = false;
    }

    if (car.x <= 0 + 9 * carW && car.x + carW >= 0 && car.y <= 6 * carH + 4 * carH && car.y + carH >= 6 * carH) {

    } else {
        //Entered Segment 2
        car.progress++;

        if (car.x <= 0 + 14 * carW && car.x + carW >= 0 && car.y <= 3 * carH + 4 * carH && car.y + carH >= 3 * carH) {

        } else {
            //Entered Segment 3
            car.progress++;

            if (car.x <= 13 * carW + 7 * carW && car.x + carW >= 13 * carW && car.y <= 3 * carH + 4 * carH && car.y + carH >= 3 * carH) {

            } else {
                //Entered Segment 4
                car.progress++;

                if (car.x <= 13 * carW + 11 * carW && car.x + carW >= 13 * carW && car.y <= 0 + 4 * carH && car.y + carH >= 0) {

                } else {
                    //Entered Segment 5
                    car.progress++;

                    if (car.x <= 24 * carW + 7 * carW && car.x + carW >= 24 * carW && car.y <= 0 + 10 * carH && car.y + carH >= 0) {

                    } else {
                        //Entered Segment 6
                        car.progress++;
                    }
                }
            }
        }
    }

}

function drawCar(car) {

    ctx.save();
    ctx.translate(car.x + carW / 2, car.y + carH / 2);
    ctx.rotate(-car.angle * Math.PI / 180);
    ctx.fillStyle = car.color;
    ctx.fillRect(-carW / 2, -carH / 2, carW, carH);
    ctx.restore();

}

function drawTrack() {

    for (var i = 0; i < track.length; i++) {

        ctx.fillRect(track[i].startX, track[i].startY, track[i].trackWidth, track[i].trackHeight);

    }

}

function getRandomColor() {

    var letters = "0123456789ABCDEF";
    var color = "#";

    for (var i = 0; i < 6; i++) {

        color += letters[Math.floor(Math.random() * 16)];

    }

    return color;

}

function initializePopulation() {

    for (var i = 0; i < populationSize; i++) {

        var car = {

            x: 4 * carW,
            y: canvasH - carH,
            speed: carSpeed,
            angle: 180,
            color: getRandomColor(),
            alive: true,
            survivalTime: 0,
            progress: 0,
            moves: []

        };

        cars.push(car);

    }

}

function calculateFitness(car) {

    var progressWeight = 0.5;
    var survivalTimeWeight = 0.5;

    var fitness;

    if (difficultyLevel == 1) {

        fitness = car.survivalTime;

    } else if (difficultyLevel == 2) {

        fitness = car.progress;

    } else if (difficultyLevel == 3) {

        fitness = (progressWeight * car.progress) - (survivalTimeWeight * car.survivalTime);

    }

    return fitness;

}

function selectParents(elite) {

    var parent1 = elite[Math.floor(Math.random() * elite.length)];
    var parent2 = elite[Math.floor(Math.random() * elite.length)];
    return [parent1, parent2];

}

function crossover(parent1, parent2) {

    var crossoverPoint = Math.floor(Math.random() * parent1.moves.length);
    var offspringMoves = parent1.moves.slice(0, crossoverPoint).concat(parent2.moves.slice(crossoverPoint));
    return offspringMoves;

}

function mutate(moves) {

    var mutationIndex = Math.floor(Math.random() * moves.length);
    moves[mutationIndex] = Math.floor(Math.random() * 3);
    return moves;

}

function replacePopulation(offspringMoves) {

    for (var i = 0; i < populationSize; i++) {

        var car = {

            x: 4 * carW,
            y: canvasH - carH,
            speed: carSpeed,
            angle: 180,
            color: getRandomColor(),
            alive: true,
            survivalTime: 0,
            progress: 0,
            moves: offspringMoves[i]

        };

        cars[i] = car;

    }

}

function geneticAlgorithm() {

    var offspringMoves = [];

    currentGeneration++;

    var eliteCount = populationSize * (noEliteCars / 100);
    var elite = cars.sort((a, b) => calculateFitness(b) - calculateFitness(a)).slice(0, eliteCount);

    finishedCars.forEach(finishedCar => {

        elite.unshift(finishedCar);

    })

    elite.forEach(eliteCar => {

        offspringMoves.push(eliteCar.moves);

    });

    for (var i = elite.length; i < populationSize; i++) {

        var selectedParents = selectParents(elite);
        var offspring = crossover(selectedParents[0], selectedParents[1]);
        offspring = mutate(offspring);
        offspringMoves.push(offspring);

    }

    replacePopulation(offspringMoves);

}

function mainLoop() {

    clear();

    if (cars.every(car => !car.alive)) {

        console.log("All cars in this generation have died.");
        console.log(cars.length);

        if (cars.length == 0) {
            document.getElementById("playButton").disabled = false;
            ctx.font = "50px Garamond";
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillText("Training Completed", canvasW / 2, canvasH / 2);
            ctx.fillText("Ready To Play?", canvasW / 2, 60 + canvasH / 2);
            return;
        }

        bestCompletionTime = Infinity;
        averageCompletionTime = 0;
        finishedCars.forEach(finishedCar => {
            if (finishedCar.survivalTime < bestCompletionTime) {
                bestCompletionTime = finishedCar.survivalTime;
            }
            averageCompletionTime += finishedCar.survivalTime;
        })
        averageCompletionTime /= finishedCars.length;

        geneticAlgorithm();

    }


    cars.forEach(car => {

        if (car.alive) {

            updateCar(car);
            drawCar(car);

        }

    });

    ctx.fillStyle = "black";
    ctx.font = "30px Garamond";
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'start';
    ctx.fillText("Generation: " + currentGeneration, 10, 30);
    ctx.fillText("Best Completion Time: " + bestCompletionTime, 10, 60);
    ctx.fillText("Average Completion Time: " + Math.round(averageCompletionTime), 10, 90);
    ctx.fillText("Remaining Cars: " + (populationSize), 10, 120);

    drawTrack();

    mainLoopId = requestAnimationFrame(mainLoop);

}

function playWithBestCar() {

    playerCarX = 4 * carW;
    playerCarY = canvasH - carH;

    playerCarSpeed = 0;
    playerCarAngle = 0;

    var countdownTime = 4;
    var countdownInterval;

    function drawCountdown() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "50px Garamond";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(countdownTime, canvas.width / 2, canvas.height / 2);

    }

    function updateCountdown() {

        countdownTime--;

        if (countdownTime <= 0) {

            clearInterval(countdownInterval);
            bestCars = finishedCars.sort((a, b) => a.survivalTime - b.survivalTime);
            bestCarEver = bestCars[0];
            bestCarEver.x = 4 * carW;
            bestCarEver.y = canvasH - carH;
            bestCarEver.angle = 180;
            isPlayerAlive = true;
            moveIndex = 0;

            playGame();

        } else {

            drawCountdown();

        }

    }

    countdownInterval = setInterval(updateCountdown, 1000);

}


function playGame() {

    clear();

    drawTrack();

    playerCarDraw();
    playerCarUpdate();

    drawCar(bestCarEver);

    move = bestCarEver.moves[moveIndex];

    switch (move) {
        case 0:
            bestCarEver.angle += carRotation;
            break;
        case 1:
            bestCarEver.angle -= carRotation;
            break;
        case 2:
            break;
    }

    var deltaX = bestCarEver.speed * Math.sin(bestCarEver.angle * Math.PI / 180);
    var deltaY = bestCarEver.speed * Math.cos(bestCarEver.angle * Math.PI / 180);
    bestCarEver.x += deltaX;
    bestCarEver.y += deltaY;
    if (bestCarEver.moves.length > moveIndex && isPlayerAlive) {
        if (playerCarY + carH >= canvasH && playerCarX >= 23 * carW + 1 * carW && playerCarX + carW <= 29 * carW) {

            ctx.font = "50px Garamond";
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillText("You Win", canvasW / 2, canvasH / 2);
            cancelAnimationFrame(mainLoopId);

        } else {
            requestAnimationFrame(playGame);
        }
    } else {
        ctx.font = "50px Garamond";
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText("You Lose", canvasW / 2, canvasH / 2);
        ctx.fillStyle = "black";
        ctx.font = "30px Garamond";
        ctx.textBaseline = 'alphabetic';
        ctx.textAlign = 'start';
        ctx.fillText("Best Time : " + bestCarEver.survivalTime, 10, 30);
        cancelAnimationFrame(mainLoopId);
    }

    moveIndex++;

}


function startSimulation() {

    cancelAnimationFrame(mainLoopId);

    carSpeed = Number(document.getElementById("speedOption").value);
    carRotation = Number(document.getElementById("angleOption").value);

    populationSize = Number(document.getElementById("popSize").value);
    cars = [];
    finishedCars = [];
    bestCarEver = 0;
    noEliteCars = Number(document.getElementById("noEliteCars").value);

    currentGeneration = 1;

    bestCompletionTime = Infinity;
    averageCompletionTime = NaN;

    if (document.getElementById('easyDifficulty').checked) {
        difficultyLevel = document.getElementById('easyDifficulty').value;
    }
    if (document.getElementById('mediumDifficulty').checked) {
        difficultyLevel = document.getElementById('mediumDifficulty').value;
    }
    if (document.getElementById('hardDifficulty').checked) {
        difficultyLevel = document.getElementById('hardDifficulty').value;
    }

    settedPlayerSpeed = carSpeed;
    settedPlayerAngle = carRotation;

    document.getElementById("playButton").disabled = true;

    initializePopulation();
    requestAnimationFrame(mainLoop);

}

function enforceMinMax(el) {
    if (el.value != "") {
        if (parseInt(el.value) < parseInt(el.min)) {
            el.value = el.min;
        }
        if (parseInt(el.value) > parseInt(el.max)) {
            el.value = el.max;
        }
    }
}

window.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp") {
        moveForward = true;
    } else if (event.key === "ArrowDown") {
        moveBackward = true;
    } else if (event.key === "ArrowLeft") {
        turnLeft = true;
    } else if (event.key === "ArrowRight") {
        turnRight = true;
    }
});

window.addEventListener("keyup", function (event) {
    if (event.key === "ArrowUp") {
        moveForward = false;
    } else if (event.key === "ArrowDown") {
        moveBackward = false;
    } else if (event.key === "ArrowLeft") {
        turnLeft = false;
    } else if (event.key === "ArrowRight") {
        turnRight = false;
    }
});