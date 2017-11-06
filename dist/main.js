var CANVAS_WIDTH = document.body.clientWidth - 100;
var CANVAS_HEIGHT = document.body.clientHeight - 100;
var POINT = 0;
var KEY_DOWN = false;
var LAST_MOVE_TIME = new Date().getTime();
var DOWN_TIME = 800;
var nextTetrisIndex = Math.floor(Math.random() * tetris.length);
var newTetris = tetris[Math.floor(Math.random() * tetris.length)];
var CUR_TETRIS = {
    tetris: newTetris,
    top: 1 - newTetris.length,
    left: 3,
    direct: 'up'
};
var CUR_MATRIX = JSON.parse(JSON.stringify(matrix));


var canvas = document.getElementById('canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
var context = canvas.getContext('2d');

function drawMatrix(cxt, x, y, nowMatrix) {
    for (var i = 0; i < nowMatrix.length; i++) {
        for (var j = 0; j < nowMatrix[i].length; j++) {
            drawBackRect(cxt, x + j * 23, y + i * 23, nowMatrix[i][j]);
        }
    }
}

function drawBackRect(cxt, x, y, isFill) {
    cxt.beginPath();
    cxt.fillStyle = isFill ? '#333' : '#eee';
    cxt.fillRect(x, y, 20, 20);
}

function drawTetris(cxt, x, y, index) {
    cxt.clearRect(x, y, 23 * 4, 23 * 2);
    for (var i = 0; i < tetris[index].length; i++) {
        for (var j = 0; j < tetris[index][i].length; j++) {
            drawBackRect(cxt, x + j * 23, y + i * 23, tetris[index][i][j]);
        }
    }
}

function drawPoint(cxt, x, y) {
    cxt.clearRect(x, y-100, 100, 100);
    cxt.fillStyle = 'blue';
    cxt.font = '40px sans-serif';
    cxt.textAlign = 'left';
    cxt.baseline = 'top';
    cxt.fillText(POINT.toString(), x, y);

}

window.addEventListener('keydown', function (e) {

    KEY_DOWN = true;
    switch (e.keyCode) {
        // 上
        case 38:
            tetrisUp();
            break;
        case 40:
            if (!tetrisToGround()) {
                tetrisDown();
            }
            break;
        case 37:
            tetrisLeft();
            break;
        case 39:
            tetrisRight();
            break;
        default:
            KEY_DOWN = false;
            break;
    }
});

window.addEventListener('keyup', function () {
    KEY_DOWN = false;
});

setInterval(function () {
    drawMatrix(context, 300, 20, mixCurMatrix());
    drawTetris(context, 800, 400, nextTetrisIndex);
    drawPoint(context, 800, 100);

    update();
}, 100);

function update() {
    var timeInterval = getInterval();
    // 根据时间自动变换事件
    if (KEY_DOWN && tetrisToGround()) {
        LAST_MOVE_TIME = new Date().getTime();
    }

    if (timeInterval >= DOWN_TIME) {
        if (tetrisToGround()) {
            CUR_MATRIX = mixCurMatrix();
            getPoint();
            CUR_TETRIS = {
                tetris: tetris[nextTetrisIndex],
                top: 1 - tetris[nextTetrisIndex].length,
                left: 3,
                direct: 'up'
            };
            nextTetrisIndex = Math.floor(Math.random() * tetris.length);
        } else {
            tetrisDown();
        }
        LAST_MOVE_TIME = new Date().getTime();
    }
}

function getPoint() {
    var cutLine = 0;
    for (var i = 19; i >= 0; i--) {
        var filled = true;
        for (var j = 0; j < CUR_MATRIX[i].length; j++) {
            if (CUR_MATRIX[i][j] === 0) {
                filled = false;
                break;
            }
        }
        if (filled) {
            CUR_MATRIX.splice(i, 1);
            cutLine++;
        }
    }
    for (var k = CUR_MATRIX.length - 1; k < 19; k++) {
        CUR_MATRIX.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    switch (cutLine) {
        case 1:
            POINT += 1;
            break;
        case 2:
            POINT += 3;
            break;
        case 3:
            POINT += 7;
            break;
        case 4:
            POINT += 14;
            break;
        default:
            break;
    }
}

function mixCurMatrix() {
    var newMatrix = JSON.parse(JSON.stringify(CUR_MATRIX));
    for (var i = 0; i < CUR_TETRIS.tetris.length; i++) {
        for (var j = 0; j < CUR_TETRIS.tetris[i].length; j++) {
            if (i + CUR_TETRIS.top >= 0 && j + CUR_TETRIS.left >= 0) {
                newMatrix[i + CUR_TETRIS.top][j + CUR_TETRIS.left] = CUR_TETRIS.tetris[i][j] || newMatrix[i + CUR_TETRIS.top][j + CUR_TETRIS.left];
            }
        }
    }
    return newMatrix;
}

function tetrisUp() {
    var curTetris = [];
    var lastTetris = CUR_TETRIS.tetris;
    for (var i = 0; i < lastTetris.length; i++) {
        for (var j = 0; j < lastTetris[i].length; j++) {
            if (!curTetris[lastTetris[i].length - 1 - j]) {
                curTetris[lastTetris[i].length - 1 - j] = [];
            }
            curTetris[lastTetris[i].length - 1 - j][i] = lastTetris[i][j];
        }
    }
    CUR_TETRIS.tetris = curTetris;
}

function tetrisToGround() {
    if (CUR_TETRIS.top + CUR_TETRIS.tetris.length - 1 >= 19) {
        return true;
    }
    for (var i = CUR_TETRIS.top; i < CUR_TETRIS.top + CUR_TETRIS.tetris.length; i++) {
        var ti = i - CUR_TETRIS.top;
        for (var j = CUR_TETRIS.left; j < CUR_TETRIS.left + CUR_TETRIS.tetris[ti].length; j++) {
            var tj = j - CUR_TETRIS.left;
            if (CUR_TETRIS.tetris[ti][tj] === 1 && CUR_MATRIX[i + 1][j] === 1) {
                return true;
            }
        }
    }
    return false;
}

function tetrisDown() {
    CUR_TETRIS.top += 1;
}

function tetrisLeft() {
    if (CUR_TETRIS.left <= 0) {
        return;
    }
    for (var i = CUR_TETRIS.top; i < CUR_TETRIS.top + CUR_TETRIS.tetris.length; i++) {
        var ti = i - CUR_TETRIS.top;
        for (var j = CUR_TETRIS.left; j < CUR_TETRIS.left + CUR_TETRIS.tetris[ti].length; j++) {
            var tj = j - CUR_TETRIS.left;
            if (CUR_TETRIS.tetris[ti][tj] === 1 && CUR_MATRIX[i][j - 1] === 1) {
                return;
            }
        }
    }
    CUR_TETRIS.left--;
}

function tetrisRight() {
    if (CUR_TETRIS.left + CUR_TETRIS.tetris[0].length > 9) {
        return;
    }
    for (var i = CUR_TETRIS.top; i < CUR_TETRIS.top + CUR_TETRIS.tetris.length; i++) {
        var ti = i - CUR_TETRIS.top;
        for (var j = CUR_TETRIS.left; j < CUR_TETRIS.left + CUR_TETRIS.tetris[ti].length; j++) {
            var tj = j - CUR_TETRIS.left;
            if (CUR_TETRIS.tetris[ti][tj] === 1 && CUR_MATRIX[i][j + 1] === 1) {
                return;
            }
        }
    }
    CUR_TETRIS.left++;
}

function getInterval() {
    var timeNow = new Date().getTime();
    return timeNow - LAST_MOVE_TIME;
}