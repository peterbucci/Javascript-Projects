// Create Game board

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
						game.chip = new Chip(game.players[0].color)
					} else {
						firstAvailable.el.style.backgroundColor = game.players[0].color
						firstAvailable.fill = 1
						game.chip.deleteEl()
						game.chip = new Chip(game.players[1].color)
					}
					
					game.takeTurn(firstAvailable)
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
	constructor (color) {
		this.parent = document.getElementById('aboveBoard')
		this.createEl(color)
	}

	createEl (color) {
		this.el = document.createElement('div')

		this.el.setAttribute('id', 'chip')
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

class Move {
	constructor (move, time) {
		this.square = move
		if (game.moves.length == 0) {
			this.timeSpent = time - game.startTime
			this.time = time
		} else {
			this.timeSpent = time - game.moves[game.moves.length - 1].time
			this.time = time
		}
	}
}

class Game {
	constructor () {
		this.players = []
		this.turn = 1
		this.moves= []
		// If true, disable event listener functions
		this.disabled = true
		// If true, game is over
		this.over = false
		
		this.UI = document.getElementById('afterBoard')
		this.toggleBoard()
		this.toggleGameUI()
		this.toggleCreateACharacterUI()
	}

	toggleBoard () {
		let gameBoard = document.getElementById('gameBoard')

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
			this.UI.insertAdjacentElement('beforeend', this.createACharacterUI)

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
						let date = new Date()
						this.startTime = date.getTime()
						this.chip = new Chip(this.players[0].color)
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
			this.UI.insertAdjacentElement('afterbegin', this.moveUI)
			this.turnUI.setAttribute('id', 'turnUI')
			this.UI.insertAdjacentElement('beforeend', this.turnUI)
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
			let replay = document.createElement('button')
			replay.setAttribute('id', 'replay')
			replay.innerHTML = 'View Replay'
			this.winScreen.insertAdjacentElement('beforeend', replay)
	
			newGame.addEventListener('click', this.newGame.bind(this))
			replay.addEventListener('click', this.replay.bind(this))
		} else {
			this.winScreen.remove()
		}
	}

	takeTurn (move) {
		let date = new Date()
		let time = date.getTime()
		this.lastMove = new Move(move, time)
		this.moves.push(this.lastMove)
		
		console.log(this.moves)

		// Win Conditions
		let results = []

		results.push(this.checkWinner('down', null))
		results.push(this.checkWinner(null, 'left') + this.checkWinner(null, 'right') - 1)
		results.push (this.checkWinner('up', 'left') + this.checkWinner('down', 'right') - 1)
		results.push (this.checkWinner('up', 'right') + this.checkWinner('down', 'left') - 1)

		// Check 'Win Conditions' and take your turn if it's false
		if (results.indexOf(4) !== -1) {
			this.winner()
		} else {
			this.turn++

			this.turn % 2 == 0 ? this.moveUI.innerHTML = this.players[1].turn : this.moveUI.innerHTML = this.players[0].turn
			this.turnUI.innerHTML = 'Turn: ' + this.turn.toString()
		}

	}

	checkWinner (vertical, horizontal, lastSquare = this.lastMove.square, count = 1, moveForward = true) {
		let currentSquare = lastSquare
	
		if (vertical === 'up' && this.board[currentSquare.column].squares[currentSquare.row - 1]) {
			currentSquare = this.board[currentSquare.column].squares[currentSquare.row - 1]
		} else if (vertical === 'down' && this.board[currentSquare.column].squares[currentSquare.row + 1] ) {
			currentSquare = this.board[currentSquare.column].squares[currentSquare.row + 1]
		} else if (vertical) {
			moveForward = false
		}
		if (horizontal === 'left' && this.board[currentSquare.column - 1]) {
			currentSquare = this.board[currentSquare.column - 1].squares[currentSquare.row]
		} else if (horizontal === 'right' && this.board[currentSquare.column + 1]) {
			currentSquare = this.board[currentSquare.column + 1].squares[currentSquare.row]
		} else if (horizontal) {
			moveForward = false
		}

		if (moveForward && currentSquare.fill == lastSquare.fill) {
			count++
			return this.checkWinner(vertical, horizontal, currentSquare, count)
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
		this.UI.insertAdjacentElement('beforeend', this.winScreen)
		this.over = true
	}

	newGame () {
		this.toggleBoard()
		this.toggleGameUI()
		this.toggleWinScreen()
		this.chip.deleteEl()
		game = new Game()
	}
	
	replay () {
		this.board.forEach((column) => {
			column.squares.forEach((square) => {
				square.el.style.backgroundColor = 'white'
			})
		})
		
		this.chip.deleteEl()
		this.chip = new Chip(this.players[0].color)
		
		for (let i = 0; i < this.moves.length; i++) {
			console.log(this.moves[i].square.el.offsetTop + 'px')
			this.chip.el.style.top = this.moves[i].square.el.offsetTop + 'px'
			this.chip.el.style.left = this.moves[i].square.el.offsetLeft + 'px'
			this.chip.el.addEventListener('transitionend', function () {
				if (i % 2 == 0) {
					this.moves[i].square.el.style.backgroundColor = this.chip.el.style.backgroundColor
					this.chip.deleteEl()
					this.chip = new Chip(this.players[1].color)
				} else {
					this.moves[i].square.el.style.backgroundColor = this.chip.el.style.backgroundColor
					this.chip.deleteEl()
					this.chip = new Chip(this.players[0].color)
				}
			}.bind(this))

		}
	}
}

var game = new Game()