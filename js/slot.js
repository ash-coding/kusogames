'use strict'

{   
    const reelSources = [
        './img/slotSeven.jpeg',
        './img/slotBar.jpeg',
        './img/slotDiamond.jpeg',
        './img/slotBanana.jpeg',
        './img/slotCherry.jpeg',
        './img/slotReplay.jpeg',
        './img/slotSkeleton.jpeg',
    ];

    const reelAlts= [
        'Seven',
        'Bar',
        'Diamond',
        'Banana',
        'Cherry',
        'Replay',
        'Skeleton',
    ];

    const reelImageIds = [
        [
            [3, 0, 6, 5, 2, 5, 1, 4, 2, 5, 2, 0, 3, 2, 5, 2, 1, 2, 5, 2],
            [6, 0, 2, 4, 5, 3, 2, 4, 5, 1, 2, 4, 3, 5, 0, 2, 5, 1, 2, 4],
            [2, 0, 1, 6, 5, 2, 4, 3, 5, 2, 4, 3, 5, 2, 4, 3, 2, 4, 3, 5],
        ],
        [
            [0, 6, 5, 6, 5, 6, 6, 6, 5, 6, 6, 5, 6, 6, 5, 6, 6, 5, 6, 6],
            [0, 6, 5, 6, 5, 6, 6, 6, 6, 6, 6, 6, 5, 6, 6, 5, 6, 6, 6, 6],
            [0, 6, 6, 5, 6, 5, 6, 6, 6, 6, 5, 6, 6, 5, 6, 6, 6, 6, 6, 6],
        ]
    ];

    let isPlaying = false;
    let speed = [1, 10];
    let ease = 0;
    let selectedLevel;
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
        plyaing = false;
        
        if (selectedLevel === '1') {
            speed = [1, 1];
        } else if (selectedLevel === '2') {
            speed = [2, 1];
        } else if (selectedLevel === '3') {
            speed = [2, 1];
            ease = 1;
        }

    });

    const base = document.querySelector('.slot-image0').getBoundingClientRect().top + window.pageYOffset;
    const slotScore = document.getElementById('slot-score');
    let coin = 20;

    class Image {
        constructor(idName, reelId, reelCount) {
            this.image = document.getElementById(idName);
            this.initialTop = this.image.getBoundingClientRect().top + window.pageYOffset;
            this.currentTop = 0;
            this.timeoutId = undefined;
            this.reelId = reelId;
            this.child = this.image.firstElementChild;
            this.reelInitialCount = reelCount;
            this.reelCount = reelCount;
        }

        changeImage() {
            this.reelCount += 4;
            if (this.reelCount > 19) {
                this.reelCount = this.reelInitialCount;
            }
            this.child.src = reelSources[reelImageIds[ease][this.reelId][this.reelCount]];
            this.child.alt = reelAlts[reelImageIds[ease][this.reelId][this.reelCount]];
            this.currentTop = base - this.initialTop;
            this.image.style.transform = `translateY(${this.currentTop}px)`;
        }

        startSpin() {
            let stopY = this.initialTop + this.currentTop - base;
            if (stopY > 240) {
                this.changeImage();
            }
            this.timeoutId = setTimeout(() => {
                this.currentTop += speed[0];
                this.image.style.transform = `translateY(${this.currentTop}px)`;
                this.startSpin();
                if (this.stopId()) {
                    if (stopY === 0 || stopY === 1 || stopY === 2) {
                        clearTimeout(this.timeoutId);
                    } else if (stopY === 60 || stopY === 61 || stopY === 62) {
                        clearTimeout(this.timeoutId);
                    } else if (stopY === 120 || stopY === 121 || stopY === 122) {
                        clearTimeout(this.timeoutId);
                    } else if (stopY === 180 || stopY === 181 || stopY === 182) {
                        clearTimeout(this.timeoutId);
                    }
                }
            }, speed[1]);
        }

        stopId() {
            if (this.reelId === 0) {
                return stopLeft;
            }
            if (this.reelId === 1) {
                return stopCenter;
            }
            if (this.reelId === 2) {
                return stopRight;
            }
        }

        getPosition() {
            if (this.initialTop + this.currentTop - base < 30) {
                return 0;
            }
            if (this.initialTop + this.currentTop - base < 90) {
                return 1;
            }
            if (this.initialTop + this.currentTop - base < 150) {
                return 2;
            }
            if (this.initialTop + this.currentTop - base < 210) {
                return 3;
            }
        }

        getAlt() {
            let currentAlt =  this.child.getAttribute('alt');
            return currentAlt;
        }

        isMatched(p1, p2) {
            return this.child.src === p1.child.src && this.child.src === p2.child.src;
        }

        match() {
            this.image.classList.add('slot-matched');
        }
    }

    let stopLeft = true;
    let stopCenter = true;
    let stopRight = true;
    let plyaing = true;
    let pushedCount = 0;
    let gameCount = 0;

    const leftReel = [
        new Image('slot-L0', 0, 0),
        new Image('slot-L1', 0, 1),
        new Image('slot-L2', 0, 2),
        new Image('slot-L3', 0, 3),
    ];
    const centerReel = [
        new Image('slot-C0', 1, 0),
        new Image('slot-C1', 1, 1),
        new Image('slot-C2', 1, 2),
        new Image('slot-C3', 1, 3),
    ];
    const rightReel = [
        new Image('slot-R0', 2, 0),
        new Image('slot-R1', 2, 1),
        new Image('slot-R2', 2, 2),
        new Image('slot-R3', 2, 3),
    ];

    const lever = document.querySelector('.slot-lever');
    lever.addEventListener('click', () => {
        if (plyaing) {
            return;
        }
        if (coin > 99 || coin < 0) {
            showResult();
        }
        coin -= 3;
        slotScore.textContent = coin;
        
        stopLeft = false;
        stopCenter = false;
        stopRight = false;
        plyaing = true;

        leftReel.forEach(image => {
            image.startSpin();
        });
        centerReel.forEach(image => {
            image.startSpin();
        });
        rightReel.forEach(image => {
            image.startSpin();
        });
        
        gameCount++;
    });
    
    let topLeft;
    let topCenter;
    let topRight;
    const btn1 = document.getElementById('slot-button1');
    const btn2 = document.getElementById('slot-button2');
    const btn3 = document.getElementById('slot-button3');
    const btns = [btn1, btn2, btn3];
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', () => {
            switch (i) {
                case 0:
                    if (stopLeft) {
                        return;
                    }
                    stopLeft = true;
                    break;
                case 1:
                    if (stopCenter) {
                        return;
                    }
                    stopCenter = true;
                    break;
                case 2:
                    if (stopRight) {
                        return;
                    }
                    stopRight = true;
                    break;
            }
            btns[i].classList.add('slot-pushed');
            pushedCount++;
            if (pushedCount === 3) {
                setTimeout(() => {
                    checkResult();
                    updateScore();
                }, 500);
                setTimeout(() => {
                    btns.forEach(btn => {
                        btn.classList.remove('slot-pushed');
                    })
                    for (let j = 0; j < leftReel.length; j++) {
                        if (leftReel[j].image.classList.contains('slot-matched')) {
                            leftReel[j].image.classList.remove('slot-matched');
                        }
                        if (centerReel[j].image.classList.contains('slot-matched')) {
                            centerReel[j].image.classList.remove('slot-matched');
                        }
                        if (rightReel[j].image.classList.contains('slot-matched')) {
                            rightReel[j].image.classList.remove('slot-matched');
                        }
                    }
                    plyaing = false;
                    pushedCount = 0;
                }, weight);
            }
        });
    }

    const imagePositions = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    function arrangeResult() {
        for (let i = 0; i < leftReel.length; i++) {
            imagePositions[0][i] = leftReel[i].getPosition();
            imagePositions[1][i] = centerReel[i].getPosition();
            imagePositions[2][i] = rightReel[i].getPosition();
        }
    }

    let alt = '';
    let altNumber;
    function searchResult(position1, position2, position3) {
        for (let k = 0; k < leftReel.length; k++) {
            for (let n = 0; n < leftReel.length; n++) {
                for (let m = 0; m < leftReel.length; m++) {
                    if (imagePositions[0][k] === position1 && imagePositions[1][n] === position2 && imagePositions[2][m] === position3) {
                        if (leftReel[k].isMatched(centerReel[n], rightReel[m])) {
                            leftReel[k].match();
                            centerReel[n].match();
                            rightReel[m].match();
                            alt = leftReel[k].getAlt();
                            altNumber++;
                        }
                    }
                }
            }
        }
    }

    function checkResult() {
        altNumber = 0;
        arrangeResult();
        searchResult(1, 1, 1);
        searchResult(1, 2, 3);
        searchResult(2, 2, 2);
        searchResult(3, 2, 1);
        searchResult(3, 3, 3);
    }

    let seven = 0;
    let bar = 0;
    let skeleton = 0;
    let diamond = 0;
    let banana = 0;
    let cherry = 0;
    let replay = 0;
    let initialScore = 0;
    let charge;
    let weight = 2000;
    function updateScore() {
        weight = 2000;
        charge = 0;
        initialScore = coin;
        if (altNumber === 0) {
            alt = '';
            return;
        }
        switch (alt) {
            case 'Replay':
                charge = 3;
                replay++;
                break;
            case 'Cherry':
                charge = 5;
                cherry++;
                break;
            case 'Banana':
                charge = 10;
                banana++;
                break;
            case 'Diamond':
                charge = 15;
                diamond++;
                break;
            case 'Seven':
                charge = 50;
                weight = 4000;
                seven++;
                break;
            case 'Bar':
                charge = 30;
                weight = 4000;
                bar++;
                break;
            case 'Skeleton':
                charge = -50;
                weight = 4000;
                skeleton++;
                break;
            default:
                break;
        }
        countupScore();
    }

    function countupScore() {
        const timeoutIdCountup = setTimeout(() => {
            if (coin === initialScore + charge) {
                clearTimeout(timeoutIdCountup);
                if (coin > 99 || coin < 0) {
                    showResult();
                }
            } else if (coin < initialScore + charge) {
                coin ++;
                slotScore.textContent = coin;
                countupScore();
            } else if (coin > initialScore + charge) {
                coin--;
                slotScore.textContent = coin;
                countupScore();
            }
        }, 50);
    }

    const result = document.querySelector('.result-panel');
    function showResult() {
        if (coin > 99) {
            document.getElementById('slot-victory').textContent = 'Clear!';
            document.getElementById('slot-victory').style.color = '#ff4500';
        } else {
            document.getElementById('slot-victory').textContent = 'Failure';
            document.getElementById('slot-victory').style.color = '#4169e1';
        }
        document.getElementById('slot-result-games').textContent = gameCount;
        document.getElementById('slot-result-seven').textContent = seven;
        document.getElementById('slot-result-bar').textContent = bar;
        document.getElementById('slot-result-skeleton').textContent = skeleton;
        document.getElementById('slot-result-diamond').textContent = diamond;
        document.getElementById('slot-result-banana').textContent = banana;
        document.getElementById('slot-result-cherry').textContent = cherry;
        document.getElementById('slot-result-replay').textContent = replay;
        
        result.classList.add('display');
    }
  
}