const yaml = require('node-yaml');
const path = require('path');

let levels = null;
let currentIndex = 0, intervals = [];
let em = [], list = [], tempEm = [];

let elPrize = document.getElementById('prize');


let em1 = document.getElementById('em1').value.split('\n');
let em2 = document.getElementById('em2').value.split('\n');

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
    if (!document.getElementById('em1').value || !document.getElementById('em2').value) {
        alert('还没有添加名单');
        return;
    }
    
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

document.getElementById('btn-config').onclick = function() {
    toggleConfig();
};

document.getElementById('btn-retrieve').onclick = function(event) {
    const target = event.currentTarget;

    let current = levels[currentIndex];
    const procs = parseInt(current.procs, 10);
    const prizeColumns = document.querySelectorAll('.prize-column');

    if (target.innerText == '点击抽奖') {
        resetEmployees();

        intervals = [];

        for (let i = 0; i < procs; i++) {
            startCalc(prizeColumns[i], i);
        }

        target.innerText = '停止';
        return;
    }
    
    let tempList = [];
    for (let i = 0; i < procs; i++) {
        clearInterval(intervals[i]);

        em[i].splice(tempEm[i], 1);
        tempList.push(prizeColumns[i].innerText);

        let found = false;
        for (let j = em1.length - 1; j >=0; j--) {
            if (em1[j] == prizeColumns[i].innerText) {
                em1.splice(j, 1);
                found = true;
                break;
            }
        }

        if (!found) {
            for (let j = em2.length - 1; j >=0; j--) {
                if (em2[j] == prizeColumns[i].innerText) {
                    em2.splice(j, 1);
                    break;
                }
            }   
        }
    }
    
    document.getElementById('em1').value = em1.join("\n");
    document.getElementById('em2').value = em2.join("\n");
    list.push(tempList.join());

    target.innerText = '点击抽奖';
};

document.getElementById('btn-list').onclick = function() {
    if (list.length <= 0) {
        return alert('没有中奖名单');
    }

    return alert(list.join("\n"));
};

function fillPrize() {
    list = [];
    let current = levels[currentIndex];

    if (current === null) {
        console.err('数据错误');
        return;
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
}

function resetEmployees() {
    let current = levels[currentIndex];

    if (current === null) {
        console.err('数据错误');
        return;
    }

    em1 = document.getElementById('em1').value.split('\n');
    em2 = document.getElementById('em2').value.split('\n');

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

    let newEms = [];
    let procs = parseInt(current.procs, 10);
    let size = Math.floor(em.length / procs);

    for (let i = 0; i < procs; i++) {
        let current = [];
        for (let j = 0; j < size; j++) {
            current.push(em.pop().trim());
        }
        newEms.push(current);
    }

    for (let i = 0; i < em.length; i++) {
        newEms[i].push(em[i]);
    }

    em = newEms;
}

function startCalc(el, i) {
    let interval = setInterval(function() {
        const index = Math.round(Math.random() * (em[i].length - 1));

        el.innerText = em[i][index];
        tempEm[i] = index;
    }, 100);

    intervals.push(interval);
}

function toggleConfig() {
    toggleEl(document.getElementById('config'));
}

function toggleEl(el) {
    if (el.classList.contains('hide')) {
        el.classList.remove('hide');
        return;
    }

    el.classList.add('hide');
}