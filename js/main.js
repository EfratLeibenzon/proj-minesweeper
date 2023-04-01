
const EMPTY = ' '
const MINE = '💣'
const life = '❤️'
const lifeGone = '💔'
const smileyReguler = '😊'
const smileyWin = '🤩'
const smileyLose = '🤯'


var gBoard = []

var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

// This is called when page loads
function onInit() {
    gGame.isOn = true
    buildBoard()
    renderBoard(gBoard, '.board')
}



// Builds the board
// Set the mines
// Call setMinesNegsCount()
// Return the created board

function buildBoard() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j] = {
                isMine: false,
                minesAroundCount: 0,
                isShown: false,
                isMarked: false,
            }
        }
    }
    placeMines(gLevel.MINES)

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            gBoard[i][j].minesAroundCount = setMinesNegsCount(i, j, gBoard)
        }
    }
    console.table(gBoard)
}


function placeMines(amount) {

    for (var k = 0; k < amount; k++) {
        var emptyCells = findEmptyPoss()

        var cellPos = emptyCells[getRandomInt(0, emptyCells.length)]
        var currCell = gBoard[cellPos.i][cellPos.j]
        currCell.isMine = true

    }
}

function getCell() {
    var row = getRandomInt(0, gBoard.length)
    var col = getRandomInt(0, gBoard[0].length)
    var cell = gBoard[row][col]
    return cell
}

function findEmptyPoss() {

    var emptyPoss = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j]
            if (!cell.isMine) {
                var pos = { i, j }
                emptyPoss.push(pos)
            }
        }
    }
    return emptyPoss
}



function setMinesNegsCount(rowIdx, colIdx, mat) {
    var negsCount = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (mat[i][j].isMine) negsCount++
        }
    }
    return negsCount
}

// Render the board as a <table>
// to the page


function renderBoard(mat, selector) {

    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'

    var strHTML = '<table><tbody>'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j]
            var numOfCellNegs = cell.minesAroundCount
            if (cell.isMine) {
                cell = MINE
                // strHTML += `class="mine"`
            }
            else if (cell.isMine === false && numOfCellNegs > 0) { cell = numOfCellNegs }
            else { cell = EMPTY }
            const className = `cell cell-${i}-${j} covered`
            strHTML += `<td class="${className}" 
            oncontextmenu="onCellMarked(this, ${i}, ${j})"
            onclick="onCellClicked(this, ${i}, ${j})">${cell}</td>\n`
        }
        strHTML += '</tr>\n'

    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML

}

// Called when a cell is clicked
function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    if (elCell.classList.contains("marked")) return
    console.log('i', i, 'j', j)

    if (gBoard[i][j].isMine === true) {
        gBoard[i][j].isShown = true
        elCell.classList.remove('covered')
        // var elmines = document.querySelectorAll("mine")
        // elmines.classList.remove('marked', 'covered')

        gGame.isOn = false
        gGame.shownCount++
        console.log('game over')
        var msg = 'Game Over'
        openModal(msg)

    } else if (gBoard[i][j].minesAroundCount === 0 && gBoard[i][j].isMine === false) {
        expandShown(gBoard, elCell, i, j)
    } else {
        gBoard[i][j].isShown = true
        elCell.classList.remove('covered')
        gGame.shownCount++
        checkGameOver()
    }
}


// Called when a cell is rightclicked
// See how you can hide the context
// menu on right click
function onCellMarked(elCell, i, j) {
    if (!gGame.isOn) return
    gBoard[i][j].isMarked = true
    gGame.markedCount++
    console.log('i', i, 'j', j)
    checkGameOver()
    document.getElementsByClassName("cell-${i}-${j}");
    addEventListener("contextmenu", (e) => { e.preventDefault() });
    elCell.classList.toggle('marked')
}


// Game ends when all mines are
// marked, and all the other cells
// are shown
function checkGameOver() {
    console.log('marked:', gGame.markedCount)
    console.log('mines', gLevel.MINES)
    console.log('shown', gGame.shownCount)
    console.log('celles that are not mines', gLevel.SIZE * gLevel.SIZE - gLevel.MINES)
    if (gGame.markedCount === gLevel.MINES && gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES) {
        console.log('you win!')
        var msg = 'You Won!'
        openModal(msg)
        gGame.isOn = false
    }

}


function openModal(msg) {
    const elModal = document.querySelector('.modal')
    const elSpan = elModal.querySelector('.msg')
    elSpan.innerText = msg
    elModal.style.display = 'block'
}
// When user clicks a cell with no
// mines around, we need to open
// not only that cell, but also its
// neighbors.
// NOTE: start with a basic
// implementation that only opens
// the non-mine 1st degree
// neighbors
// BONUS: if you have the time
// later, try to work more like the
// real algorithm (see description
// at the Bonuses section below)
function expandShown(board, elCell, i, j) {
    var rowIdx = i
    var colIdx = j
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            // if (k === rowIdx && n === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            // console.log(gBoard[k][n])
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            if (elCell.classList.contains('covered')) {
                elCell.classList.remove('covered')
                board[i][j].isShown = true
                console.log(elCell.classList)
                gGame.shownCount++
                checkGameOver()
            } else {
                continue
            }

        }
    }

}
// ● Support 3 levels of the game
// o Beginner (4 * 4 with 2 MINES)
// o Medium (8 * 8 with 14 MINES)
// o Expert (12 * 12 with 32 MINES)
function setGameLevel(str) {
    restartGame()
    var level = str
    if (level = 'medium') {
        gLevel.SIZE = 8, gLevel.MINES = 14
    } else if (level = 'Expert') {
        gLevel.SIZE = 12, gLevel.MINES = 32
    } else { gLevel.SIZE = 4, gLevel.MINES = 2 }

}

function restartGame() {
    gBoard = []
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    buildBoard()
    renderBoard(gBoard, '.board')
}





function startTimer() {
    gStartTime = Date.now();
    gIntervalId = setInterval(updateTimer, 10);

}

function stopTimer() {
    clearInterval(gIntervalId);
}


function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

