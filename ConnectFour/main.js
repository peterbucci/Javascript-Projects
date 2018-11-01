// Create Gameboard

let board = []
let aboveBoard = document.getElementById('aboveBoard')
let gameBoard = document.getElementById('gameBoard')
let afterBoard = document.getElementById('afterBoard')

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
		if (!game.disabled) {
			let chip = document.getElementById('chip')
			chip.offsetTop == 0 && (chip.style.left = `${10.5 * this.index}vw`)
		}
	}

	onClick () {
		let availableSquares = this.squares.filter(function(square) {
			return square.fill == 0
		})
		if (!game.disabled && chip.el.offsetTop == 0 && availableSquares.length > 0) {
			game.disabled = true

			function click () {
				console.log('click')
				let firstAvailable = availableSquares[availableSquares.length - 1]
				console.log(firstAvailable.el.offsetTop)
				chip.el.style.top = firstAvailable.el.offsetTop + chip.el.clientHeight + 'px'

				setTimeout(function() {
					if (game.turn % 2 == 0) {
						firstAvailable.el.style.backgroundColor = game.players[1].color
						firstAvailable.fill = 2
					} else {
						firstAvailable.el.style.backgroundColor = game.players[0].color
						firstAvailable.fill = 1
					}
					
					game.takeTurn()
					chip.refreshEl()
					game.disabled = false
				}, 1000)
			}

			if (chip.el.offsetLeft !== this.el.offsetLeft) {
				chip.el.style.left = `${10.5 * this.index}vw`
			
				chip.el.addEventListener('transitionend', click, {once: true})
			} else {
				click()
			}
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
		this.appendEl()
	}

	createEl () {
		let el = document.createElement('div')
		el.setAttribute('id', 'chip')

		this.el = el
	}

	appendEl () {
		game.turn % 2 == 0 ? this.el.style.backgroundColor = game.players[1].color : this.el.style.backgroundColor = game.players[0].color
		this.parent.appendChild(this.el)
		setTimeout(() => {
			this.el.style.top = '0' 
			this.el.style.left = '0'
		}, 100)
	}
}

// Start Game

class Player {
	constructor (name, color, card) {
		this.name = name
		this.color = color
		this.turn = name + '\'s move'
	}
}

// Look into setting eventlistners like column class

class Game {
	constructor () {
		this.players = []
		this.turn = 0
		this.disabled = true
		
		// Game UI (The current turn and whose move it is)
		
		let moveUI = document.createElement('div')
		let turnUI = document.createElement('div')
		
		moveUI.setAttribute('id', 'moveUI')
		afterBoard.insertAdjacentElement('afterbegin', moveUI)
		turnUI.setAttribute('id', 'turnUI')
		afterBoard.insertAdjacentElement('beforeend', turnUI)
		
		this.whoseMove = moveUI
		this.currentTurn = turnUI
		
		// Character Create UI
		
		let createACharacterUI = document.createElement('div')
		createACharacterUI.setAttribute('class', 'createACharacterUI')
		afterBoard.insertAdjacentElement('beforeend', createACharacterUI)
	
		let nameInput = document.createElement('input')
		nameInput.setAttribute('id', 'nameInput')
		nameInput.setAttribute('value', 'Player One')
		
		let instructions = document.createElement('span')
		instructions.setAttribute('id', 'instructions')
		let text = 'Player One\'s Name And Color'
		instructions.innerHTML = text
	
		let chooseRed = document.createElement('div')
		let chooseBlack = document.createElement('div')
		chooseRed.setAttribute('class', 'pickAColor')
		chooseRed.setAttribute('id', 'red')
		chooseBlack.setAttribute('class', 'pickAColor')
		chooseBlack.setAttribute('id', 'black')
	
		let construct = [instructions, nameInput, [chooseRed, chooseBlack]]
	
		construct.forEach((el) => {
			let containers = document.createElement('div')
			containers.setAttribute('class', 'pContainer')
			createACharacterUI.insertAdjacentElement('beforeend', containers)
	
			if (el.length == 2) {
				containers.appendChild(el[0])
				containers.appendChild(el[1])
			} else {
				containers.appendChild(el)
			}
		})

		function chooseAColor (e) {
			let player = new Player(nameInput.value, e.target.id)
			this.players.push(player)
			
			e.target.remove()
			instructions.innerHTML = 'Player Two\'s Name And Color'
			nameInput.setAttribute('value', 'Player Two')
			
			if (this.players.length == 2) {
				createACharacterUI.remove()
				this.takeTurn()
				chip.appendEl()
				this.disabled = false
			}
		}

		chooseRed.addEventListener('click', chooseAColor.bind(this))
		chooseBlack.addEventListener('click', chooseAColor.bind(this))
	}

	takeTurn () {
		let a = this.loop(5, 6, 'horizontal')
		let b = this.loop(6, 5, 'vertical')
		let c = this.diagonalLoop([[0,3],[0,4],[0,5],[1,5],[2,5],[3,5]], [[6,3],[6,4],[6,5],[5,5],[4,5],[3,5]])

		if (a || b || c) {
			this.winner()
		} else {
			this.turn++

			if (game.turn % 2 == 0) {
				this.whoseMove.innerHTML = game.players[1].turn
			} else {
				this.whoseMove.innerHTML = game.players[0].turn
			}
			this.currentTurn.innerHTML = 'Turn: ' + game.turn.toString()
		}

	}
	
	loop (firstVal, secondVal, orientation) {
		for (let i = firstVal; i >= 0; i--) {
			let duplicates = []
			let last = 0
			let count = 0
			
			for (let j = secondVal; j >= 0; j--) {
				let square
				orientation === 'vertical' ? (square = board[i].squares[j]) : (square = board[j].squares[i])
				
				if (last !== square.fill && last !== 0) {
					duplicates.push({
					name: '', 
					count: count
					})
					count = 0
				}
				if (square.fill) {count++}
				if (j == 0 && count !== 0) {duplicates.push({name: '', count: count})}
				
				last = square.fill
			}
			
			let results = duplicates.map(el => el.count)
			
			if (results.indexOf(4) !== -1) {
				return true
			}
		}
		return false
	}
	
	diagonalLoop(loopOne, loopTwo) {
		
		function bothLoops (loop, direction) {
			for (let i = 0; i < loop.length; i++) {
				let el = loop[i]
				let column = el[0]
				let row = el[1]
				let duplicates = []
				let last = 0
				let count = 0
				if (direction === 'forward') {
					var dirSwitch = true
				} else {
					var dirSwitch = false
				}

				while (row >= 0 && column <= 6 && dirSwitch) {
					let square = board[column].squares[row]
					
					if (last !== square.fill && last !== 0) {
						duplicates.push({
							name: '',
							count: count})
						count = 0
					}
					if (square.fill) {count++}
					if (row === 0 && count !== 0) {duplicates.push({name: '', count: count})}
					
					last = square.fill
					
					column++
					row--
				}
				
				while (row >= 0 && column >= 0 && !dirSwitch) {
					let square = board[column].squares[row]
					
					if (last !== square.fill && last !== 0) {
						duplicates.push({
							name: '',
							count: count})
						count = 0
					}
					if (square.fill) {count++}
					if (row === 0 && count !== 0) {duplicates.push({name: '', count: count})}
					
					last = square.fill
					
					column--
					row--
				}
				
				let results = duplicates.map(el => el.count)
				
				if (results.indexOf(4) !== -1) {
					return true
				}
			}
			return false
		}
		
		return bothLoops(loopOne, 'forward') ||
			bothLoops(loopTwo, 'backwards')
	}
	
	winner () {
		if (game.turn % 2 == 0) {
			this.whoseMove.innerHTML = game.players[1].name + ' wins!'
		} else {
			this.whoseMove.innerHTML = game.players[0].name + ' wins!'
		}
	}
}

let game = new Game()

let chip = new Chip(aboveBoard)