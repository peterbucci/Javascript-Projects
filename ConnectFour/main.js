let chip = document.getElementById('chip')
let gameBoard = document.getElementById('gameBoard')
let board = []

function generateSquare (column, i) {
	let square = document.createElement('div')

	board[i].squares.push({
		el: square,
		fill: 'none'
	})
	
	square.setAttribute('class', 'square')
	
	column.appendChild(square)
}

for (let i = 0; i < 7; i++) {
	let column = document.createElement('div')
	column.setAttribute('class', 'column')
	gameBoard.appendChild(column)
	board.push({
		el: column,
		squares: []
	})
	for (let j = 0; j < 6; j++) {
		generateSquare(column, i)
	}
}

console.log(board)





let columns = document.querySelectorAll('.column')

columns.forEach((column, i) => {
	column.addEventListener('mouseover', function () {
    	chip.style.left = `${10.5 * i}vw`
	})
	column.addEventListener('click', function() {
		chip.style.top = '805px'
	})
})

