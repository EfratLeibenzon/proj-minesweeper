
const EMPTY = ' '
const MINE = '💣'
const FLAG = '🚩'


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
            strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})">${cell}</td>\n`
        }
        strHTML += '</tr>\n'

    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML

}

// Called when a cell is clicked
function onCellClicked(elCell, i, j) {
    gBoard[i][j].isShown = true
    console.log('i', i, 'j', j)
    elCell.classList.remove('covered')
    if (gBoard[i][j].isMine === true) {
        console.log('game over')
    } else if (gBoard[i][j].isMine === EMPTY) {
        elCell.classList.remove('covered')

    }
}


// Called when a cell is rightclicked
// See how you can hide the context
// menu on right click
function onCellMarked(elCell) {

}


// Game ends when all mines are
// marked, and all the other cells
// are shown
function checkGameOver() {


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

function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}

// Returns the class name for a specific cell
function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

