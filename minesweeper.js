const c = document.getElementById("game-board");
let ctx = c.getContext("2d");
const gameUnit = 40;
const matrix2 = [];
const bombImage = document.createElement("img");
bombImage.src = "https://banner2.cleanpng.com/20180423/lxe/kisspng-minesweeper-pro-classic-mines-puzzle-free-game-div-crystal-clear-5adddb13780780.6936924515244889794917.jpg";
const flagImage = document.createElement("img");
flagImage.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Minesweeper_flag.svg/1200px-Minesweeper_flag.svg.png";
let mouseX = 0;
let mouseY = 0;
let nrBombs = 0;
let nrFlags = 0;
let checkedSquares = 0;
let win = true;

c.addEventListener('click', checkCoordinates);
c.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    mouseCoordinates(event);
    for(let i = 0; i < 600; i += gameUnit) {
        for(let j = 0; j < matrix2[i].length; j += gameUnit) {
            if (i === mouseX && j === mouseY && matrix2[i][j].flag == false) {
                matrix2[i][j].flag = true;
                ++nrFlags;
                ++checkedSquares;
                document.getElementById("flags").innerHTML = nrFlags;
                if(checkedSquares === 225) {
                    checkWin();
                }
                ctx.drawImage(flagImage, mouseX, mouseY, gameUnit, gameUnit);
            } else if (i === mouseX && j === mouseY && matrix2[i][j].flag == true) {
                matrix2[i][j].flag = false;
                --nrFlags;
                --checkedSquares;
                document.getElementById("flags").innerHTML = nrFlags;
                ctx.clearRect(mouseX, mouseY, gameUnit, gameUnit);
                ctx.fillStyle = "blue";
                ctx.fillRect(i, j, gameUnit, gameUnit);
                ctx.strokeStyle = "black";
                ctx.strokeRect(i, j, gameUnit, gameUnit);
            }
        }
    }
});

startGame();

function startGame() {
    drawGameBoard();
    generateSquares();
    generateBombs();

}
function drawGameBoard() {
    for(let i = 0; i < 600; i += gameUnit) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();
        ctx.moveTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    }
}

function generateSquares() {
    for(let i = 0; i < 600; i += gameUnit) {
        matrix2[i] = [];
        for(let j = 0; j < 600; j += gameUnit) {
            let square = {x : i, y : j, bomb : false, number : 0, flag : false, isChecked : false};
            matrix2[i][j] = square;
            ctx.fillStyle = "blue";
            ctx.fillRect(i, j, gameUnit, gameUnit);
            ctx.strokeStyle = "black";
            ctx.strokeRect(i, j, gameUnit, gameUnit);
        }
    }
}

function generateBombs() {
    while(nrBombs < 15) {
        let bombX = Math.floor(Math.random() * 15) * gameUnit;
        let bombY = Math.floor(Math.random() * 15) * gameUnit;
        for(let i = 0; i < 600; i += gameUnit) {
            for(let j = 0; j < matrix2[i].length; j += gameUnit) {
                if(i === bombX && j === bombY && matrix2[i][j].bomb == false) {
                    matrix2[i][j].bomb = true;
                    ctx.drawImage(bombImage, bombX, bombY, gameUnit, gameUnit);
                    generateNumbers(bombX, bombY);
                    ++nrBombs;
                    break;
                }
            }
        }
    }
}

function generateNumbers(line, column) {
    for(let i = line - gameUnit; i <= line + gameUnit; i += gameUnit) {
        for(let j = column - gameUnit; j <= column + gameUnit; j += gameUnit) {
            console.log(i + " " + j);
            if(i >= 600 || i < 0 || j >= 600 || j < 0 || matrix2[i][j].bomb == true) {
                continue;
            } else {
                matrix2[i][j].number += 1;
            }
        }
    } 
}

function mouseCoordinates(event) {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
    while(mouseX % gameUnit !== 0) {
        --mouseX;
    }
    while(mouseY % gameUnit !== 0) {
        --mouseY;
    }
}

function checkCoordinates(event) {
    mouseCoordinates(event);
    for(let i = 0; i < 600; i += gameUnit) {
        for(let j = 0; j < matrix2[i].length; j += gameUnit) {
            if(i === mouseX && j === mouseY) {
                verifySquare(i, j);
                if(!matrix2[i][j].isChecked) {
                    matrix2[i][j].isChecked = true;
                    ++checkedSquares;
                    if(checkedSquares === 225) {
                        checkWin();
                    }
                }
            }
        }
    }
}

function drawNumbers(i, j) {
    ctx.fillStyle = "white";
    ctx.fillRect(i, j, gameUnit, gameUnit);
    if(matrix2[i][j].number == 1) {
        ctx.fillStyle = "red";
    } else if(matrix2[i][j].number == 2) {
        ctx.fillStyle = "blue";
    } else if(matrix2[i][j].number == 3) {
        ctx.fillStyle = "green";
    } else if(matrix2[i][j].number == 4) {
        ctx.fillStyle = "yellow";
    } else if(matrix2[i][j].number == 5) {
        ctx.fillStyle = "purple";
    } else if(matrix2[i][j].number == 6) {
        ctx.fillStyle = "pink";
    } else if(matrix2[i][j].number == 7) {
        ctx.fillStyle = "brown";
    } else if(matrix2[i][j].number == 8) {
        ctx.fillStyle = "black";
    }
    if(matrix2[i][j].number != 0) {
        ctx.font = "bold 20px Arial";
        ctx.fillText(matrix2[i][j].number, i + 14 , j + 25);
    }
}

function verifySquare(i, j) {
    if(!matrix2[i][j].bomb && matrix2[i][j].number === 0) {
        ctx.fillStyle = "white";
        ctx.fillRect(mouseX, mouseY, gameUnit, gameUnit);
        neighbors(i, j);
    }
    if(!matrix2[i][j].bomb && matrix2[i][j].number > 0) {
        drawNumbers(i, j);
    }
    if(matrix2[i][j].bomb) {
        ctx.drawImage(bombImage, mouseX, mouseY, gameUnit, gameUnit);
        gameOver();
    }
}

function neighbors(line, column) {
    for(let i = line - gameUnit; i <= line + gameUnit; i += gameUnit) {
        for(let j = column - gameUnit; j <= column + gameUnit; j += gameUnit) {
            if(i >= 600 || i < 0 || j >= 600 || j < 0) {
                continue;
            }
            checkTiles(i, j);
        }
    } 
}

function checkTiles(line, column) {
    if(line < 0 || line >= 600 || column < 0 || column >= 600) {
        return;
    }
    if (matrix2[line][column].isChecked == true) {
        return;
    }
    matrix2[line][column].isChecked = true;
    ++checkedSquares;
    if(checkedSquares === 225) {
        checkWin();
    }
    if(matrix2[line][column].number != 0) {
        drawNumbers(line, column);
    } else {
        ctx.fillStyle = "white";
        ctx.fillRect(line, column, gameUnit, gameUnit);
        neighbors(line, column);
    }
}
    
function gameOver() {
    for(let i = 0; i < 600; i += 40) {
        for(let j = 0; j < matrix2[i].length; j += 40) {
            if(matrix2[i][j].bomb) {
                ctx.drawImage(bombImage, i, j, gameUnit, gameUnit);
            }
        }
    }
    c.removeEventListener('click', checkCoordinates);
    document.getElementById("lose").innerHTML = "You lose!😔 Try again";
    clearInterval(myInterval);
}

function checkWin() {
    for(let i = 0; i < 600 ; i += 40) {
        for(let j = 0; j < matrix2[i].length; j += 40) {
            if((matrix2[i][j].bomb == true && matrix2[i][j].flag != true) || (matrix2[i][j].bomb == false && matrix2[i][j].flag == true)) {
                win = false;
            }
        }
    }
    if(win) {
        document.getElementById("winner").innerHTML = "You win! 😀";
        clearInterval(myInterval);
    } else {
        document.getElementById("lose").innerHTML = "You lose!😔 Try again";
        clearInterval(myInterval);
    }
}

let sec = 0;
function pad ( val ) { return val > 9 ? val : "0" + val; }
const myInterval = setInterval( function(){
    document.getElementById("seconds").innerHTML=pad(++sec%60);
    document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10) + ":");
}, 1000);