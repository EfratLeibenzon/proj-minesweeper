
const EMPTY = ' '
const MINE = '💣'

const gBoard = []

const gLevel = {
    SIZE: 4,
    MINES: 2
}
const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

// This is called when page loads
function onInit() {
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

    var strHTML = '<table><tbody>'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j]
            var numOfCellNegs = cell.minesAroundCount
            if (cell.isMine) { cell = MINE }
            else if (cell.isMine === false && numOfCellNegs > 0) { cell = numOfCellNegs }
            else { cell = EMPTY }
            const className = `cell cell-${i}-${j} covered`
            strHTML += `<td class="${className}" oncontextmenu="onCellMarked(this, ${i}, ${j})" onclick="onCellClicked(this, ${i}, ${j})">${cell}</td>\n`
        }
        strHTML += '</tr>\n'

    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML

}

// Called when a cell is clicked
function onCellClicked(elCell, i, j) {
    if (elCell.classList.contains("marked")) {
        return
    }
    gBoard[i][j].isShown = true
    console.log('i', i, 'j', j)
    elCell.classList.remove('covered')
    gGame.shownCount++
    checkGameOver()

    if (gBoard[i][j].isMine === true) {
        gGame.shownCount++
        gGame.isOn = false
        console.log('game over')
    }
    if (gBoard[i][j].minesAroundCount === 0 && gBoard[i][j].isMine === false) {
        var rowIdx = i
        var colIdx = j
        for (var k = rowIdx - 1; k <= rowIdx + 1; k++) {
            if (k < 0 || k >= gBoard.length) continue
            for (var n = colIdx - 1; n <= colIdx + 1; n++) {
                if (k === rowIdx && n === colIdx) continue
                if (n < 0 || n >= gBoard[0].length) continue
                console.log(gBoard[k][n])
                var elNeg = document.querySelector(`.cell-${k}-${n}`)
                elNeg.classList.remove('covered')
                console.log(elNeg.classList)
                gGame.shownCount++
            }
        }
    }
}


// Called when a cell is rightclicked
// See how you can hide the context
// menu on right click
function onCellMarked(elCell, i, j) {
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
    if (gGame.markedCount === gLevel.MINES && gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES)
        console.log('you win!')
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

}


// function startTimer() {
//     gStartTime = Date.now();
//     gIntervalId = setInterval(updateTimer, 10);
//     // playSound('count');
//   }

//   function stopTimer() {
//     clearInterval(gIntervalId);
//   }


function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

