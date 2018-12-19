const array = require('lodash/array');
const yaml = require('node-yaml');
const path = require('path');

const em1 = require('./config/1.js');
const em2 = require('./config/2.js');

let levels = null;
let currentIndex = 0;
let em = [];

let elPrize = document.getElementById('prize');

// 加载配置文件
yaml.read(path.resolve(__dirname, 'config/app.yaml'), (err, data) => {
    if (err) {
        throw err;
    }

    levels = data.levels;
    currentIndex = 0;
});

// 开始抽奖事件
document.getElementById('start').onclick = function() {
    this.classList.add('hide');
    elPrize.classList.remove('hide');
    document.querySelector('.toolbar-footer').classList.remove('hide');
    fillPrize();
};

document.getElementById('btn-next').onclick = function() {
    if (currentIndex >= levels.length) {
        alert('抽奖已结束!');
        return;
    }

    currentIndex++;
    fillPrize();
};

document.getElementById('btn-retrieve').onclick = function() {
    let current = levels[currentIndex];
    const procs = parseInt(current.procs, 10);
    const prizeColumns = document.querySelectorAll('.prize-column');

    for (let i = 0; i < procs; i++) {
        startCalc(prizeColumns[i], em[i]);
    }
};

function fillPrize() {
    let current = levels[currentIndex];

    if (current === null) {
        console.err('数据错误');
        return;
    }

    let data = current.data;
    if (data === "1") {
        em = em1;
    } else if (data === "2") {
        em = em2;
    } else if (data === "1,2") {
        em = em1.concat(em2);
    } else {
        // nothing to do
    }

    let elPrizeRow = document.querySelector('.prize-row');
    elPrizeRow.innerHTML = '';
    document.querySelector('.prize-title').innerText = current.title;

    let procs = parseInt(current.procs, 10);
    for (let i = 0; i < procs; i++) {
        let elPrizeColumn = document.createElement('div');
        elPrizeColumn.classList.add('prize-column');
        elPrizeColumn.classList.add('prize-column-' + procs);
        elPrizeColumn.innerText = '来学网';
        elPrizeRow.appendChild(elPrizeColumn);
    }

    em = array.chunk(em, em.length / procs);
}

function startCalc(el, em) {
    let interval = setInterval(function() {
        let index = Math.ceil(Math.random() * (em.length - 1));

        el.innerText = em[index];
    }, 100);

    setTimeout(function() {
        clearInterval(interval);
    }, 10000);
}