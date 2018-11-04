// Create Gameboard
let aboveBoard = document.getElementById('aboveBoard')
let gameBoard = document.getElementById('gameBoard')
let afterBoard = document.getElementById('afterBoard')

class Square {
	constructor () {
		let el = document.createElement('div')
		el.setAttribute('class', 'square')
		this.el = el
		this.fill = 0
		this.column
		this.row
	}
}

class Column {
	constructor (i) {
		let el = document.createElement('div')
		el.setAttribute('class', 'column')

		this.el = el
		this.index = i
		this.squares = []

		this.el.addEventListener('click', this.onClick.bind(this))
		this.el.addEventListener('mouseenter', this.onMouseEnter.bind(this))

		for (let j = 0; j < 6; j++) {
			let square = new Square()
			square.row = j
			square.column = i
			this.el.appendChild(square.el)
			this.squares.push(square)
		}
	}

	onMouseEnter () {
		if (!game.disabled) {
			game.chip.el.offsetTop == 0 && (game.chip.el.style.left = `${10 * this.index}vh`)
		}
	}

	onClick () {
		let availableSquares = this.squares.filter(function(square) {
			return square.fill == 0
		})
		if (!game.disabled && game.chip.el.offsetTop == 0 && availableSquares.length > 0) {
			game.disabled = true

			function click () {
				let firstAvailable = availableSquares[availableSquares.length - 1]
				game.chip.el.style.top = firstAvailable.el.offsetTop + game.chip.el.clientHeight + 'px'

				setTimeout(function() {
					if (game.turn % 2 == 0) {
						firstAvailable.el.style.backgroundColor = game.players[1].color
						firstAvailable.fill = 2
						game.chip.deleteEl()
						game.chip = new Chip(aboveBoard, game.players[0].color)
					} else {
						firstAvailable.el.style.backgroundColor = game.players[0].color
						firstAvailable.fill = 1
						game.chip.deleteEl()
						game.chip = new Chip(aboveBoard, game.players[1].color)
					}
					
					game.lastMove = firstAvailable
					game.takeTurn()
					!game.over && (game.disabled = false)
				}, 1000)
			}

			if (game.chip.el.offsetLeft !== this.el.offsetLeft) {
				game.chip.el.style.left = `${10 * this.index}vh`
			
				game.chip.el.addEventListener('transitionend', click, {once: true})
			} else {
				click()
			}
		}
	}
}

// Create Chip

class Chip {
	constructor (parent, color) {
		this.parent = parent
		this.createEl(color)
	}

	createEl (color) {
		let el = document.createElement('div')
		el.setAttribute('id', 'chip')
		this.el = el
		this.parent.appendChild(this.el)
		this.el.style.backgroundColor = color
		setTimeout(() => {
			this.el.style.top = '0' 
			this.el.style.left = '0'
		}, 100)
	}

	deleteEl () {
		game.chip.el.remove()
	}
}

// Start Game

class Player {
	constructor (name, color) {
		this.name = name
		this.color = color
		this.turn = name + '\'s move'
	}
}

class Game {
	constructor () {
		this.players = []
		this.turn = 1
		this.lastMove
		this.chip
		// If true, disable event listener functions
		this.disabled = true
		// If true, game is over
		this.over = false
		
		this.toggleBoard()
		this.toggleGameUI()
		this.toggleCreateACharacterUI()
	}

	toggleBoard () {

		if (!this.board) {
			this.board = []
			for (let i = 0; i < 7; i++) {
				let column = new Column(i)
				gameBoard.appendChild(column.el)
				this.board.push(column)
			}
		} else {
			this.board.forEach((column) => {
				column.el.remove()
			})
		}
	}

	toggleCreateACharacterUI () {
		if (!this.createACharacterUI) {
			this.createACharacterUI = document.createElement('div')
			this.createACharacterUI.setAttribute('class', 'createACharacterUI')
			afterBoard.insertAdjacentElement('beforeend', this.createACharacterUI)

			let title = document.createElement('span')
			title.setAttribute('id', 'title')
			let text = 'Connect'
			title.innerHTML = text

			let titleNum = document.createElement('span')
			titleNum.setAttribute('id', 'titleNum')
			text = '4'
			titleNum.innerHTML = text
		
			let nameInput = document.createElement('input')
			nameInput.setAttribute('id', 'nameInput')
			nameInput.setAttribute('value', 'Enter A Name')
			
			let instructions = document.createElement('span')
			instructions.setAttribute('id', 'instructions')
			text = 'Player One'
			instructions.innerHTML = text
		
			let chooseRed = document.createElement('div')
			let chooseBlack = document.createElement('div')
			chooseRed.setAttribute('class', 'pickAColor')
			chooseRed.setAttribute('id', 'red')
			chooseBlack.setAttribute('class', 'pickAColor')
			chooseBlack.setAttribute('id', 'black')

			let submit = document.createElement('button')
			submit.innerHTML = 'Submit'
		
			let construct = [[title, titleNum], instructions, nameInput, [chooseRed, chooseBlack], submit]
		
			construct.forEach((el) => {
				let containers = document.createElement('div')
				containers.setAttribute('class', 'pContainer')
				this.createACharacterUI.insertAdjacentElement('beforeend', containers)
		
				if (el.length == 2) {
					containers.appendChild(el[0])
					containers.appendChild(el[1])
				} else {
					containers.appendChild(el)
				}
			})

			function addPlayer () {
				if (this.color && nameInput.value.length > 3) {
					let player = new Player(nameInput.value, this.color.id)
					this.players.push(player)
					
					this.color.remove()
					instructions.innerHTML = 'Player Two'
					nameInput.setAttribute('value', 'Enter A Name')
					this.color = null
					
					if (this.players.length == 2) {
						this.toggleCreateACharacterUI()

						this.moveUI.innerHTML = game.players[0].turn
			
						this.turnUI.innerHTML = 'Turn: ' + game.turn.toString()
						this.chip = new Chip(aboveBoard, this.players[0].color)
						this.disabled = false
					}
				}	
			}

			this.color = null

			function chooseAColor (e) {
				if (e.target.style.boxShadow === 'rgb(66, 66, 66) 5px 5px 5px') {
					e.target.style.boxShadow = 'none'
					this.color = null
				} else {
					this.color = e.target
					this.color.style.boxShadow = 'rgb(66, 66, 66) 5px 5px 5px'
					this.color.id === 'red' && this.color.nextSibling && (this.color.nextSibling.style.boxShadow = 'none')
					this.color.id === 'black' && this.color.previousSibling && (this.color.previousSibling.style.boxShadow = 'none')
				}
			}

			chooseRed.addEventListener('click', chooseAColor.bind(this))
			chooseBlack.addEventListener('click', chooseAColor.bind(this))

			submit.addEventListener('click', addPlayer.bind(this))
		} else {
			this.createACharacterUI.remove()
		}
	}

	toggleGameUI () {
		if (!this.moveUI && !this.turnUI) {
			this.moveUI = document.createElement('div')
			this.turnUI = document.createElement('div')
			
			this.moveUI.setAttribute('id', 'moveUI')
			afterBoard.insertAdjacentElement('afterbegin', this.moveUI)
			this.turnUI.setAttribute('id', 'turnUI')
			afterBoard.insertAdjacentElement('beforeend', this.turnUI)
		} else {
			this.moveUI.remove()
			this.turnUI.remove()
		}
	}

	toggleWinScreen (winner) {
		if (!this.winScreen) {
			this.winScreen = document.createElement('div')
			this.winScreen.setAttribute('id', 'winScreen')
			this.winScreen.insertAdjacentHTML('afterbegin', winner + ' wins!')
			let newGame = document.createElement('button')
			newGame.setAttribute('id', 'newGame')
			newGame.innerHTML = 'New Game'
			this.winScreen.insertAdjacentElement('beforeend', newGame)
	
			this.winScreen.addEventListener('click', this.newGame.bind(this))
		} else {
			this.winScreen.remove()
		}
	}

	takeTurn () {

		// Win Conditions
		let results = []

		// Check Vertical Adjacent (Down) NOTE: Chips will obviously never be above the last move
		results.push(this.checkWinner(false, true, false, false, this.lastMove))
		// Check Horizontal Adjacent (Left & Right)
		results.push(this.checkWinner(false, false, true, false, this.lastMove))
		results.push(this.checkWinner(false, false, false, true, this.lastMove))
		// Check Diagonal Adjacent (Up Left & Down Right)
		results.push(this.checkWinner(true, false, true, false, this.lastMove))
		results.push(this.checkWinner(false, true, false, true, this.lastMove))
		// Check Diagonal Adjacent (Up Right & Down Left)
		results.push(this.checkWinner(true, false, false, true, this.lastMove))
		results.push(this.checkWinner(false, true, true, false, this.lastMove))

		// Check 'Win Conditions' and take your turn if it's false
		if (results.indexOf(4) !== -1) {
			this.winner()
		} else {
			this.turn++

			game.turn % 2 == 0 ? this.moveUI.innerHTML = game.players[1].turn : this.moveUI.innerHTML = game.players[0].turn
			this.turnUI.innerHTML = 'Turn: ' + game.turn.toString()
		}

	}

	checkWinner (up, down, left, right, nextSquare, lastMove = this.lastMove, count = 1) {
		
		if (up && nextSquare) {
			this.board[nextSquare.column].squares[nextSquare.row - 1] ? nextSquare = this.board[nextSquare.column].squares[nextSquare.row - 1] 
				: nextSquare = null
		}
		if (down && nextSquare) {
			this.board[nextSquare.column].squares[nextSquare.row + 1] ? nextSquare = this.board[nextSquare.column].squares[nextSquare.row + 1]
				: nextSquare = null
		}
		if (left && nextSquare) {
			this.board[nextSquare.column - 1] ? nextSquare = this.board[nextSquare.column - 1].squares[nextSquare.row]
				: nextSquare = null
		}
		if (right && nextSquare) {
			this.board[nextSquare.column + 1] ? nextSquare = this.board[nextSquare.column + 1].squares[nextSquare.row]
				: nextSquare = null
		}

		if (nextSquare && nextSquare.fill == lastMove.fill) {
			count++
			return this.checkWinner(up, down, left, right, nextSquare, nextSquare, count)
		}	else {
			return count
		}
	}
	
	winner () {
		if (game.turn % 2 == 0) {
			this.moveUI.innerHTML = game.players[1].name + ' wins!'
			this.toggleWinScreen(game.players[1].name)
		} else {
			this.moveUI.innerHTML = game.players[0].name + ' wins!'
			this.toggleWinScreen(game.players[0].name)
		}
		afterBoard.insertAdjacentElement('beforeend', this.winScreen)
		this.over = true
	}

	newGame () {
		this.toggleBoard()
		this.toggleGameUI()
		this.toggleWinScreen()
		this.chip.deleteEl()
		game = new Game()
	}
}

var game = new Game()