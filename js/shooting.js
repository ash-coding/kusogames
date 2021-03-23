'use strict';

{
  let isPlaying = false;
  let selectedLevel;
  const startButton = document.getElementById('start-button');
  const enemyNumbers = [10, 50, 200, 500];
  const enemy = [];
  const life = document.getElementById('shooting-life');
  const enemyInfo = document.getElementById('shooting-enemy');
  let heart = 3;
  startButton.addEventListener('click', e => {
    e.preventDefault();
    const levels = document.querySelectorAll('input')
    levels.forEach(level => {
      if (level.checked === true) {
        selectedLevel = level.value;
      }
    });
    if (selectedLevel === undefined) {
      alert('難易度を選択してください');
      return;
    }
    if (isPlaying === true) {
      return;
    }

    isPlaying = true;

    for (let i = 0; i < enemyNumbers[selectedLevel]; i++) {
      enemy[i] = new Enemy();
    }
    life.innerHTML = '<i class="fas fa-heart fa-fw"></i>'.repeat(heart);
    enemyInfo.textContent = enemy.length;

    gameLoop();
  });

  const canvas = document.getElementById('shooting-canvas');
  const canvasWidth = 300;
  const canvasHeight = 500;
  const ctx = canvas.getContext('2d');

  const frame = 1000 / 60;
  const starSize = [0.5, 0.8, 1.0, 1.2];
  const starSpeed = [0.5, 1.0, 1.5, 2.0];
  const starColor = ['#f0f8ff', '#d3d3d3', 'b0c4de', 'd8bfd8'];

  class Star {
    constructor() {
      this.x = Math.floor(Math.random() * canvasWidth);
      this.y = Math.floor(Math.random() * canvasHeight);
      this.width = starSize[Math.floor(Math.random() * starSize.length)];
      this.height = this.width;
      this.color = starColor[Math.floor(Math.random() * starColor.length)];
      this.speed = starSpeed[Math.floor(Math.random() * starSpeed.length)];
      this.draw();
    }
    
    draw() {
      if (typeof canvas.getContext === 'undefined') {
        return;
      }
      if (this.y > canvasHeight) {
        this.y = 0;
      }
      ctx.fillStyle = this.color;     
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
      this.y += this.speed;
    }
  }

  class Player {
    constructor() {
      this.image = new Image();
      this.image.src = './img/shootingPlayer.png';
      this.size = 40;
      this.x = canvasWidth / 2 - this.size / 2;
      this.y = canvasHeight - 100;
      this.speed = 5;
      this.unrivaledTime = 0;
      this.initialDraw();
    }

    initialDraw() {
      if (typeof canvas.getContext === 'undefined') {
        return;
      }
      setTimeout(() => {
        ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
      }, 100);
    }

    draw() {
      if (typeof canvas.getContext === 'undefined') {
        return;
      }
      ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    }

    update() {
      if (typeof canvas.getContext === 'undefined') {
        return;
      }
      if (key[38] && this.y > 0) {
        this.y -= this.speed;
      }
      if (key[40] && this.y < canvasHeight - this.size) {
        this.y += this.speed;
      }
      if (key[37] && this.x > 0) {
        this.x -= this.speed;
      }
      if (key[39] && this.x < canvasWidth - this. size) {
        this.x += this.speed;
      }
      if (key[32]) {
        attack.push(new Attack());
      }
      if (this.unrivaledTime === 0) {
        for (let i = 0; i < enemy.length; i++) {
          if (judgePlayer(enemy[i], this)) {
            heart--;
            life.childNodes[heart].classList.add('shooting-death');
            this.unrivaledTime = 120;
            if (canvas.classList.contains('shooting-blink')) {
              canvas.classList.remove('shooting-blink');
            }
            setTimeout(() => {
              canvas.classList.add('shooting-blink');
            }, frame);
            break;
          }
        }
      } else {
        this.unrivaledTime--;
      }
    }

    getX() {
      return this.x;
    }

    getY() {
      return this.y;
    }

    getSize() {
      return this.size;
    }
  }

  let attack = [];
  class Attack {
    constructor() {
      this.size = 2;
      this.x = player.getX() + player.getSize() / 2;
      this.y = player.getY() - this.size;
      this.speed = 10;
      this.draw();
      this.delete = false;
    }

    draw() {
      if (typeof canvas.getContext === 'undefined') {
        return;
      }
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
      ctx.fillStyle = '#ffd700';
      ctx.fill();
    }

    update() {
      this.y -= this.speed;
      if (this.y < 0) {
        this.delete = true;
      }
    }

    setDelete() {
      this.delete = true;
    }


  }

  const directions = [1, -1];
  const enemySpeeds = [1, 1.5, 2, 2.5]
  class Enemy {
    constructor() {
      this.image = new Image();
      this.image.src = './img/shootingEnemy.png';
      this.size = 20;
      this.x = Math.floor(Math.random() * canvasWidth);
      this.y = Math.floor(Math.random() * canvasHeight / 10);
      this.speedX = Math.random() * enemySpeeds[selectedLevel] + 0.5;
      this.speedY = Math.random() * enemySpeeds[selectedLevel] + 1;
      this.directionX = directions[Math.floor(Math.random() * directions.length)];
      this.directionY = directions[Math.floor(Math.random() * directions.length)];
      this.delete = false;
      this.draw();
    }
    
    draw() {
      if (typeof canvas.getContext === 'undefined') {
        return;
      }
      ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    }

    update() {
      if (this.x < 0) {
        this.directionX = 1;
      } else if (this.x > canvasWidth - this.size) {
        this.directionX = -1;
      }
      if (this.y < 0) {
        this.directionY = 1;
      } else if (this.y > canvasHeight - this.size) {
        this.directionY = -1;
      }
      for (let i = 0; i < attack.length; i++) {
        if (this.delete !== true) {
          if (judgeEnemy(attack[i], this)) {
            this.delete = true;
            attack[i].setDelete();
          }
        }
      }
      this.x = this.x + this.speedX * this.directionX;
      this.y = this.y + this.speedY * this.directionY;
      enemyInfo.textContent = enemy.length;
    }

  }

  function judgeEnemy(attack, enemy) {
    return attack.x > enemy.x && attack.x < enemy.x + enemy.size && attack.y > enemy.y && attack.y < enemy.y + enemy.size;
  }

  function judgePlayer(enemy, player) {
    return enemy.x < player.x + player.size && enemy.x + enemy.size > player.x && enemy.y < player.y + player.size && enemy.y + enemy.size > player.y
  }

  function clear() {
    if (typeof canvas.getContext === 'undefined') {
      return;
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  }

  const star = [];
  const starNumber = 300;
  for (let i = 0; i < starNumber; i++) {
    star[i] = new Star();
  }

  const player = new Player();

  let key = [];
  window.addEventListener('keydown', e => {
    if (isPlaying !== true) {
      return;
    }
    e.preventDefault();

    key[e.keyCode] = true;
  });

  window.addEventListener('keyup', e => {
    if (isPlaying !== true) {
      return;
    }
    e.preventDefault();

    key[e.keyCode] = false;
  });

  function gameUpdate() {
    clear();
    for (let i = 0; i < starNumber; i++) {
      star[i].update();
      star[i].draw();
    }
    player.update();
    player.draw();
    for (let i = enemy.length - 1; i >= 0; i--) {
      enemy[i].update();
      enemy[i].draw();
      if (enemy[i].delete) {
        enemy.splice(i, 1);
      }
    }
    for (let i = attack.length - 1; i >= 0; i--) {
      attack[i].update();
      attack[i].draw();
      if (attack[i].delete) {
        attack.splice(i, 1);
      }
    }
  }

  let timeoutId;
  function gameLoop() {
    timeoutId = setTimeout(() => {
      gameUpdate();
      gameLoop();
    }, frame);
    if (enemy.length === 0) {
      victory = true;
      showResult();
    } else if (heart === 0) {
      victory = false;
      showResult(); 
    }
  }

  let victory = false;
  const result = document.querySelector('.result-panel');
  function showResult() {
    enemyInfo.textContent = enemy.length;
    setTimeout(() => {
      clearTimeout(timeoutId);
    }, 2000);
      if (victory) {
          document.getElementById('shooting-victory').textContent = 'Clear!';
          document.getElementById('shooting-victory').style.color = '#ff4500';
      } else {
          document.getElementById('shooting-victory').textContent = 'Failure';
          document.getElementById('shooting-victory').style.color = '#4169e1';
      }
      
      result.classList.add('display');
  }

}