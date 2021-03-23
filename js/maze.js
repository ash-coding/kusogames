'use strict';

{
    let isPlaying = false;
    let selectedLevel;
    let mazeSize = [11, 25, 37, 69];
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', e => {       
        e.preventDefault();
        const levels = document.querySelectorAll('input')
        levels.forEach(level => {
          if (level.checked === true) {
            selectedLevel = level.value;
          }
        });
        if(selectedLevel === undefined) {
            alert('難易度を選択してください');
            return;
        }

        if (isPlaying === true) {
            return;
        }
        isPlaying = true;
        startTime = Date.now();
        createMaze();
        createCharacter();
        updateTimer();
    });

    const canvas = document.getElementById('maze-canvas');
    let map = [];
    function createMaze() {
        //迷路を配列で用意
    
        /*
        0 0 0
        0 1 0
        0 1 0
        map[x][y]
        */
    
        /*
        棒倒し法
        (1) 一つ飛びに壁(棒)を作る
        (2) 1列目の棒を上下左右のどちらかに倒す
        (3) 2列目以降の棒を左以外のどれかに倒す
        */
       let col = mazeSize[selectedLevel]; //奇数
       let row = mazeSize[selectedLevel]; //奇数
            
        for (let x = 0; x < col; x++) {
            map[x] = [];
            for (let y = 0; y < row; y++) {
                map[x][y] = 0;
            }
        }
    
        for (let x = 1; x < col; x += 2) {
            for (let y = 1; y < row; y += 2) {
                map[x][y] = 1;
            }
        }
    
        let points = [
            [0, -1],
            [0, 1],
            [1, 0],
            [-1, 0],
        ];
    
        function rand(n) {
            return Math.floor(Math.random() * (n + 1));
        }
    
        let r;
        for (let x = 1; x < col; x += 2) {
            for (let y = 1; y < row; y += 2) {
                do {
                    if (x === 1) {
                        r = points[rand(3)];
                    } else {
                        r = points[rand(2)];
                    }
                } while (map[x + r[0]][y + r[1]] === 1);
                map[x + r[0]][y + r[1]] = 1;
            }
        }

        const ctx = canvas.getContext('2d');
        const startX = 0;
        const startY = 0;
        const goalX = col - 1;
        const goalY = row - 1;
    
        let wallSize = 10;
        const wallColor = '#d3d3d3';
        const routeColor = '#ffa500';
    
        if (typeof canvas.getContext === 'undefined') {
            return;
        }
    
        canvas.width = (col + 2) * wallSize;
        canvas.height = (row + 2) * wallSize;
    
        //上下の壁
        for (let x = 0; x < col + 2; x++) {
            drawWall(x, 0);
            drawWall(x, row + 1);
        }
    
        //左右の壁
        for (let y = 0; y < row + 2; y++) {
            drawWall(0, y);
            drawWall(col + 1, y);
        }
    
        //迷路の内部
        for (let x = 0; x < col; x++) {
            for (let y = 0; y < row; y++) {
                if (map[x][y] === 1) {
                    drawWall(x + 1, y + 1);
                }
                if ((x === startX && y === startY) || (x === goalX && y === goalY)) {
                    drawRoute(x + 1, y + 1);
                }
            }
        }
    
        //壁を描画
        function drawWall(x, y) {
            ctx.fillStyle = wallColor;
            drawRect(x, y);
        }
    
        function drawRoute(x, y) {
            ctx.fillStyle = routeColor;
            drawRect(x, y);
        }
    
        function drawRect(x, y) {
            ctx.fillRect(
                x * wallSize,
                y * wallSize,
                wallSize,
                wallSize,
            );
        }

        //スタート・ゴールを設置
        ctx.font = 'bold 10px Verdana';
        ctx.textBaseline = 'top';
        ctx.fillText('スタート', 0, 0);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText('ゴール', canvas.width, canvas.height);
    }

    let character;
    function createCharacter() {
        character = document.createElement('img');
        character.src = './img/mazeHuman.png';
        const container = document.getElementById('maze-container');
        container.appendChild(character);
    }

    function judgeWallDown() {
        if (charaY + 1 > map[0].length - 1) {
            shake();
        } else {
            if (map[charaX][charaY + 1] === 0) {
                charaY++;
            } else {
                shake();
            }
        }
    }
    function judgeWallUp() {
        if (charaY -1 < 0) {
            shake();
        } else {
            if (map[charaX][charaY - 1] === 0) {
                charaY--;
            } else {
                shake();
            }
        }
    }
    function judgeWallLeft() {
        if (charaX - 1 < 0) {
            shake();
        } else {
            if (map[charaX - 1][charaY] === 0) {
                charaX--;
            } else {
                shake();
            }
        }
    }
    function judgeWallRight() {
        if (charaX + 1 > map[0].length - 1) {
            shake();
        } else {
            if (map[charaX + 1][charaY] === 0) {
                charaX++;
            } else {
                shake();
            }
        }
    }

    function shake() {
        character.style.transform = `translate(${charaX * 10 + 7}px, ${charaY * 10}px)`;
        character.style.transform = `translate(${charaX * 10 - 7}px, ${charaY * 10}px)`;
    }

    let charaX = 0;
    let charaY = 0;
    let goal = false;
    window.addEventListener('keydown', e => {
        e.preventDefault();
        if (isPlaying !== true) {
            return;
        }
        switch (e.key) {
            case 'ArrowDown':
                judgeWallDown();
                break;
            case 'ArrowUp':
                judgeWallUp();
                break;
            case 'ArrowLeft':
                judgeWallLeft();
                break;
            case 'ArrowRight':
                judgeWallRight();
                break;
            default:
                break;
        }
        setTimeout(() => {
            character.style.transform = `translate(${charaX * 10}px, ${charaY * 10}px)`;
        }, 30);

        if (charaX === map[0].length - 1 && charaY === map[0].length - 1) {
            goal = true;
        }

    });

    let startTime;
    const timeLimit = 20 * 1000;
    const timerLabel = document.getElementById('maze-timer');
    function updateTimer() {
        const timeLeft = startTime + timeLimit - Date.now();
        timerLabel.textContent = (timeLeft / 1000).toFixed(2);

        const timeoutId = setTimeout(() => {
            updateTimer();
        }, 10);

        if (timeLeft < 0) {
            isPlaying = false;
            clearTimeout(timeoutId);
            timerLabel.textContent = '0.00';
            setTimeout(() => {
                showResult();
            }, 100);
        } else if (goal) {
            isPlaying = false;
            clearTimeout(timeoutId);
            setTimeout(() => {
                showResult();
            }, 100);
        }
    }

    const result = document.querySelector('.result-panel');
    function showResult() {
        if (goal) {
            document.getElementById('maze-victory').textContent = 'Goal!';
            document.getElementById('maze-victory').style.color = '#ff4500';
        } else {
            document.getElementById('maze-victory').textContent = 'Failure';
            document.getElementById('maze-victory').style.color = '#4169e1';
        }
        
        result.classList.add('display');
    }
}
