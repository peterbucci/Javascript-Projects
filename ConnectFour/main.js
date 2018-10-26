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
		chip.el.style.top = firstAvailable.el.offsetTop + 'px'

		setTimeout(function() {
			if (game.turn % 2 == 0) {
				firstAvailable.el.classList.add(game.players[0].color) 
				firstAvailable.fill = 1
			} else {
				firstAvailable.el.classList.add(game.players[1].color) 
				firstAvailable.fill = 2
			}
			chip.refreshEl()
			game.turn++
			game.takeTurn()
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

// Start Game

let afterBoard = document.getElementById('afterBoard')

class Player {
	constructor (name, color, card) {
		this.name = name
		this.color = color
		this.card = card
	}
}

class Game {
	constructor () {
		this.players = []
		this.turn = 0
	}

	start () {
		let card = this.playerCard()
		card.addEventListener('click', function(e) {
			if (e.target.classList[0] == 'pickAColor') {
				let name = document.getElementById('nameInput')
				let player = new Player(name.value, e.target.classList[1], card)
				game.players.push(player)
				name.value = ''
				e.target.remove()
				card.childNodes[0].innerHTML = 'Player Two\'s Name And Color'
				if (game.players.length == 2) {
					card.remove()
					game.takeTurn()
				}
			}
		})
	}
	
	playerCard () {
		let card = document.createElement('div')
		card.setAttribute('class', 'playerCard')
		afterBoard.insertAdjacentElement('beforeend', card)
	
		let name = document.createElement('input')
		name.setAttribute('id', 'nameInput')
		let text = 'Player One\'s Name And Color'
	
		let red = document.createElement('div')
		let black = document.createElement('div')
		red.setAttribute('class', 'pickAColor red')
		black.setAttribute('class', 'pickAColor black')
	
		let construct = [text, name, [red, black]]
	
		construct.forEach((el) => {
			let container = document.createElement('div')
			container.setAttribute('class', 'pContainer')
			card.insertAdjacentElement('beforeend', container)
	
			if (el.length == 2) {
				container.innerHTML = el[0].outerHTML + el[1].outerHTML
			} else {
				container.innerHTML = el.outerHTML || el
			}
		})

		return card
	}

	takeTurn () {
		let chip = document.getElementById('chip')
		if (game.turn % 2 == 0) {
			console.log(game.players[0].name + '\'s' + ' turn')
			chip.style.backgroundColor = game.players[0].color
		} else {
			console.log(game.players[1].name + '\'s' + ' turn')
			chip.style.backgroundColor = game.players[1].color
		}

		for (let i = board.length - 1; i >= 0; i--) {
			let duplicates = []
			let last = board[i].squares[board[i].squares.length - 1].fill
			let count = 0
			for (let j = board[i].squares.length - 1; j >= 0; j--) {
				if (last !== board[i].squares[j].fill) {
					duplicates.push({
						name: '',
						count: count})
					count = 0
				}
				if (board[i].squares[j].fill) {
					count++
				}
				if (j == 0 && count !== 0) {
					duplicates.push({
						name: '',
						count: count})
				}
				last = board[i].squares[j].fill
			}
			let results = duplicates.map(el => el.count)
			if (results.indexOf(3) !== -1) {
				console.log('We have a winner!')
			} else {
				console.log('No winner, yet.')
			}
		}
	}
}

let game = new Game()

game.start()