
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
    placeMines(gBoard, gLevel.MINES)
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
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }


        }
    }
    console.table(gBoard)
}



function placeMines(mat, numOfMines) {

    if (numOfMines > mat.length * mat[0].length) return
    for (var i = 0; i < numOfMines; i++) {
        var row = getRandomInt(0, mat.length)
        var col = getRandomInt(0, mat[0].length)
        if (mat[row][col].isMine === true) {
            i--
        } else {
            mat[row][col].isMine = true
        }
    }
}



// Count mines around each cell
// and set the cell's
// minesAroundCount.

function setMinesNegsCount(board) {
    var negsCount = 0
    for (var i = board.length - 1; i <= board.length + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = board[i].length - 1; j <= board[i].length + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === board.length && j === board[i].length) continue
            if (board[i][j] === MINE) negsCount++
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
            cell = (cell.isMine) ? MINE : EMPTY
            const className = `cell cell-${i}-${j}`
            strHTML += `<td class="${className} onclick="onCellClicked(this, ${i}, ${j})">${cell}</td>\n`
        }
        strHTML += '</tr>\n'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

// Called when a cell is clicked
function onCellClicked(elCell, i, j) {
    // gBoard[i][j].isShown : true
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
