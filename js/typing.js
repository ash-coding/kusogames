'use strict'

{   
    const wordsSet = [
        {'そら': 'sora', 'くも':'kumo', 'あめ':'ame', 'あか': 'aka', 'あお':'ao', 'しろ':'siro', 'くろ':'kuro', 'みどり':'midori', 'りんご': 'ringo', 'いちご':'itigo', 'ぶどう':'budou', 'いぬ':'inu', 'ねこ':'neko', 'とり':'tori', 'すし':'susi', 'にく':'niku', 'さかな':'sakana', 'おかね':'okane', 'おこめ':'okome', 'めがね':'megane'},
        {'インドネシア': 'indonesia', 'にほん': 'nihon', 'イギリス': 'igirisu', 'スウェーデン':'suwe-den', 'オーストラリア':'o-sutoraria', 'アルゼンチン':'aruzentin', 'フランス':'furansu', 'ポルトガル':'porutogaru', 'アメリカ':'amerika', 'ちゅうごく':'tyuugoku', 'ロシア':'rosia', 'エジプト':'ejiputo', 'ブラジル':'burajiru', 'シンガポール':'singapo-ru', 'サウジアラビア':'saujiarabia', 'ナイジェリア':'naijeria', 'カナダ':'kanada', 'ニュージーランド':'nyu-ji-rando', 'ドイツ':'doitu', 'イタリア':'itaria'},
        {'ななころびやおき': 'nanakorobiyaoki', 'いんがおうほう': 'ingaouhou', 'いちごいちえ': 'itigoitie', 'しんらばんしょう':'sinrabansyou', 'せっさたくま':'sessatakuma', 'てんしんらんまん':'tensinranman', 'あめふってじかたまる':'amefuttejikatamaru', 'いしのうえにもさんねん':'isinouenimosannen', 'いぬもあるけばぼうにあたる':'inumoarukebabouniataru', 'うまのみみにねんぶつ':'umanomimininenbutu', 'きをみてもりをみず':'kiwomitemoriwomizu', 'へそでちゃをわかす':'hesodetyawowakasu', 'ひゃくぶんはいっけんにしかず':'hyakubunhaikkennisikazu', 'のれんにうでおし':'norenniudeosi', 'ねこにこばん':'nekonikoban', 'にかいからめぐすり':'nikaikaramegusuri', 'せいてんのへきれき':'seitennohekireki', 'すずめのなみだ':'suzumenonamida', 'しらぬがほとけ':'siranugahotoke', 'かわいいこにはたびをさせよ':'kawaiikonihatabiwosaseyo'},
        {'アンバランデンデレンハンマーカンマー': 'anbarandenderenhanma-kanma-', 'いっちゃってる！やっちゃってる！いっちゃってる！':'ittyatteru!yattyatteru!ittyatteru!'},
    ];

    let wordsJa;
    let wordJa;
    let words;
    let word;
    let rand;
    let loc;
    let score;
    let miss;
    let clearedNumber;
    const timeLimit = 20 * 1000;
    let startTime;
    let isPlaying = false;
    let clear = false;

    const startButton = document.getElementById('start-button');
    const scoreCount = document.querySelectorAll('#typing-score-count li');
    const targetJa = document.getElementById('typing-target-ja');
    const targetEn = document.getElementById('typing-target-en');
    const scoreLabel = document.getElementById('typing-score');
    const missLabel = document.getElementById('typing-miss');
    const timerLabel = document.getElementById('typing-timer');
    const result = document.querySelector('.result-panel');

    function updateTarget() {
        let typedText;
        typedText = '<span style="color:#d3d3d3;">' + word.substring(0, loc) + '</span>' + word.substring(loc);
        targetEn.innerHTML = typedText;
        targetJa.textContent = wordJa;
    }

    function updateScore() {
        scoreCount[clearedNumber - 1].classList.add(`score-color${clearedNumber - 1}`);
    }

    function updateTimer() {
        const timeLeft = startTime + timeLimit - Date.now();
        timerLabel.textContent = (timeLeft / 1000).toFixed(2);

        const timeoutId = setTimeout(() => {
            updateTimer();
        }, 10);

        if (timeLeft < 0) {
            isPlaying = false;
            clear = false;
            clearTimeout(timeoutId);
            timerLabel.textContent = '0.00';
            targetJa.textContent = '終了!';
            targetEn.textContent = 'Finish!';
            setTimeout(() => {
                showResult();
            }, 100);
        } else if (clearedNumber === 10) {
            isPlaying = false;
            clear = true;
            clearTimeout(timeoutId);
            targetJa.textContent = '終了!';
            targetEn.textContent = 'Finish!';
            setTimeout(() => {
                showResult();
            }, 100);
        }
    }

    function showResult() {
        if (clear) {
            document.getElementById('typing-victory').textContent = 'Clear!';
            document.getElementById('typing-victory').style.color = '#ff4500';
        } else {
            document.getElementById('typing-victory').textContent = 'Failure';
            document.getElementById('typing-victory').style.color = '#4169e1';
        }
        document.getElementById('typing-result-clear').textContent = `${clearedNumber} / 10`;
        document.getElementById('typing-result-score').textContent = `${score}`;
        document.getElementById('typing-result-miss').textContent = `${miss}`;
        
        result.classList.add('display');
    }

    startButton.addEventListener('click', e => {       
        e.preventDefault();
        const levels = document.querySelectorAll('input')
        let selectedLevel;
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

        loc = 0;
        score = 0;
        miss = 0;
        clearedNumber = 0;
        rand = 0;

        wordsJa = Object.keys(wordsSet[selectedLevel]);
        words = Object.values(wordsSet[selectedLevel]);

        scoreLabel.textContent = score;
        missLabel.textContent = miss;
        rand = Math.floor(Math.random() * words.length);
        word = words[rand];
        wordJa = wordsJa[rand];

        targetEn.textContent = word;
        targetJa.textContent = wordJa;
        startTime = Date.now();
        updateTimer();
    });

    window.addEventListener('keydown', e => {
        if (isPlaying !== true) {
            return;
        }
        if (e.key === word[loc]) {
            loc++;
            if (loc === word.length) {
                rand = Math.floor(Math.random() * words.length);
                word = words[rand];
                wordJa = wordsJa[rand];
                loc = 0;
                clearedNumber++;
                updateScore();
            }
            updateTarget();
            score++;
            scoreLabel.textContent = score;
        } else {
            if (targetEn.classList.contains('shake')) {
                targetEn.classList.remove('shake');
                setTimeout(() => {
                    targetEn.classList.add('shake');
                }, 1);
            } else {
                targetEn.classList.add('shake');
            }
            miss++;
            missLabel.textContent = miss;
        }
    });
}