'use strict';

{
    let isPlaying = false;
    let selectedLevel;
    const lifeText = '<i class="fas fa-heart fa-fw"></i>';
    let lives = [30, 20, 5, 1];
    const life = document.getElementById('memory-life');
    let heart;
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
        
        life.innerHTML = `${lifeText.repeat(lives[selectedLevel])}`;
        heart = lives[selectedLevel];
        
        cardsOpen();
        setTimeout(() => {
            cardsHide();
            isPlaying = true;
        }, 10000);
    });

    function cardsOpen() {
        instances.forEach(instance => {
            cardShow(instance);
        });
    }

    function cardsHide() {
        instances.forEach(instance => {
            cardHide(instance);
        });
    }
    
    function cardShow(instance) {
        instance.back.classList.remove('show-back');
        instance.card.classList.remove('hide-card');        
        setTimeout(() => {
            instance.back.classList.add('hide-back');
            instance.card.classList.add('show-card');
        }, 10);
    }

    function cardHide(instance) {
        instance.back.classList.add('show-back');
        instance.card.classList.add('hide-card');
        setTimeout(() => {
            instance.back.classList.remove('hide-back');
            instance.card.classList.remove('show-card');
        }, 10);
    }
    
    const cards = [
        's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 'st', 'sj', 'sq', 'sk',
        'k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'k7', 'k8', 'k9', 'kt', 'kj', 'kq', 'kk',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'ht', 'hj', 'hq', 'hk',
        'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'dt', 'dj', 'dq', 'dk',
        'a0', 'b0',
    ];

    const numbers = [];
    for (let i = 0; i < cards.length; i++) {
        // numbers.push(i);
        numbers[i] = i;
    }
    const random = [];
    for (let i = 0; i < cards.length; i++) {
        random[i] = numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0];
    }

    const parent = document.getElementById('memory-container');

    class Card {
        constructor(mark, x, y) {
            this.card = document.createElement('img');
            this.back = document.createElement('img');
            this.mark = mark;
            this.x = x;
            this.y = y;
            this.back.src = `./img/backcard.png`;
            this.back.style.zIndex = '5';
            this.back.clicked = false;
            this.card.src = `./img/${mark}.png`;
            this.card.alt = mark;
            this.card.style.left = `${x + 8}px`;
            this.card.style.top = `${y + 12}px`;
            this.back.style.left = `${x + 8}px`;
            this.back.style.top = `${y + 12}px`;
            parent.appendChild(this.back);
            parent.appendChild(this.card);
        }
    }
    
    let n = 0;
    const instances = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 6; j++) {
            instances.push(new Card(cards[random[n]], i * 77, j * 115));
            n++;
        }
    }

    let clickCount = 0;
    let selectedCard = [];
    instances.forEach(instance => {
        instance.back.addEventListener('click', () => {
            if (isPlaying === false) {
                return;
            }
            if (instance.back.clicked) {
                return;
            }
            if (clickCount === 2) {
                return;
            }
            cardShow(instance);
            instance.back.clicked = true;
            selectedCard[clickCount] = instance;
            clickCount++;
            if (clickCount === 2) {
                if (selectedCard[0].mark[1] === selectedCard[1].mark[1]) {
                    correctCard();
                } else {
                    wrongCard();
                }
            }
        });
    });

    let correctCount = 0;
    function correctCard() {
        setTimeout(() => {
            selectedCard[0].card.classList.add('memory-correct');
            selectedCard[1].card.classList.add('memory-correct');
        }, 1000);
        setTimeout(() => {
            clickCount = 0;
            correctCount++;
            if (correctCount === 27) {
                clear = true;
                showResult();
            }
        }, 2000);
    }

    function wrongCard() {
        heart--;
        setTimeout(() => {
            life.childNodes[heart].classList.add('memory-death');
            cardHide(selectedCard[0]);
            cardHide(selectedCard[1]);
            selectedCard[0].back.clicked = false;
            selectedCard[1].back.clicked = false;
            clickCount = 0;
            if (heart === 0) {
                clear = false;
                showResult();
            }
        }, 2000);
    }

    let clear = false;
    const result = document.querySelector('.result-panel');
    function showResult() {
        if (clear) {
            document.getElementById('memory-victory').textContent = 'Clear!';
            document.getElementById('memory-victory').style.color = '#ff4500';
        } else {
            document.getElementById('memory-victory').textContent = 'Failure';
            document.getElementById('memory-victory').style.color = '#4169e1';
        }
        
        result.classList.add('display');
    }

}