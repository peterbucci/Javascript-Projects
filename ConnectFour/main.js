// Create Gameboard

let board = []
let aboveBoard = document.getElementById('aboveBoard')
let gameBoard = document.getElementById('gameBoard')

class Square {
	constructor () {
		let el = document.createElement('div')
		el.setAttribute('class', 'square')
		this.el = el
		this.fill = 0
	}
}

class Column {
	constructor (i) {
		let el = document.createElement('div')
		el.setAttribute('class', 'column')
		el.addEventListener('click', this.onClick.bind(this))
		el.addEventListener('mouseenter', this.onMouseEnter.bind(this))

		this.el = el
		this.index = i
		this.squares = []

		for (let j = 0; j < 6; j++) {
			let square = new Square()
			this.el.appendChild(square.el)
			this.squares.push(square)
		}
	}

	onMouseEnter () {
		let chip = document.getElementById('chip')
		chip.offsetTop == 0 && (chip.style.left = `${10.5 * this.index}vw`)
	}

	onClick () {
	let availableSquares = this.squares.filter(function(square) {
		return square.fill == 0
	})

	if (chip.el.offsetTop == 0 && chip.el.offsetLeft == this.el.offsetLeft) {
		let firstAvailable = availableSquares[availableSquares.length - 1]

		firstAvailable.fill = 1
		chip.el.style.top = firstAvailable.el.offsetTop + 'px'

		setTimeout(function() {
			firstAvailable.el.style.backgroundColor = 'yellow'
			chip.refreshEl()
		}, 1000)
	} else {
		console.log('moving')
	}
	}
}

for (let i = 0; i < 7; i++) {
	let column = new Column(i)
	gameBoard.appendChild(column.el)
	board.push(column)
}

// Create Players

class Player {
	constructor (name, color) {
		this.name = name
		this.color = color
	}
}

let newGame = function () {

}

// Create Chip

class Chip {
	constructor (parent) {
		this.parent = parent
		this.createEl()
	}

	refreshEl () {
		this.el.remove()
		this.createEl()
	}

	createEl () {
		let el = document.createElement('div')
		el.setAttribute('id', 'chip')

		this.el = el
		this.moving = false
		this.parent.appendChild(el)

		setTimeout(function(){(chip.el.style.top = '0', chip.el.style.left = '0')}, 100)
	}
}

let chip = new Chip(aboveBoard)



