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
				firstAvailable.el.style.backgroundColor = game.players[0].color
				firstAvailable.fill = 1
			} else {
				firstAvailable.el.style.backgroundColor = game.players[1].color
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
	}
}

let chip = new Chip(aboveBoard)

// Start Game



class Player {
	constructor (name, color, card) {
		this.name = name
		this.color = color
		this.turn = name + '\'s move'
	}
}

class Game {
	constructor () {
		this.players = []
		this.turn = 0
		
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
				containers.innerHTML = el[0].outerHTML + el[1].outerHTML
			} else {
				containers.innerHTML = el.outerHTML || el
			}
		})
		
		this.createACharacter = createACharacterUI
		this.instructions = document.getElementById('instructions')
		this.nameInput = document.getElementById('nameInput')
		this.chooseRed = document.getElementById('red')
		this.chooseBlack = document.getElementById('black')
	}

	start () {
		
		function chooseAColor (e) {
			let player = new Player(this.nameInput.value, e.target.id)
			game.players.push(player)
			
			e.target.remove()
			this.instructions.innerHTML = 'Player Two\'s Name And Color'
			this.nameInput.setAttribute('value', 'Player Two')
			
			if (game.players.length == 2) {
				game.createACharacter.remove()
				game.takeTurn()
			}
		}

		this.chooseRed.addEventListener('click', chooseAColor.bind(this))
		this.chooseBlack.addEventListener('click', chooseAColor.bind(this))
	}

	takeTurn () {
		let chip = document.getElementById('chip')
		
		if (game.turn % 2 == 0) {
			chip.style.backgroundColor = game.players[0].color
			this.whoseMove.innerHTML = game.players[0].turn
		} else {
			chip.style.backgroundColor = game.players[1].color
			this.whoseMove.innerHTML = game.players[1].turn
		}
		
		setTimeout(function(){(chip.style.top = '0', chip.style.left = '0')}, 100)
		
		this.currentTurn.innerHTML = 'Turn: ' + game.turn.toString()
		
		this.loop(5, 6, 'horizontal')
		this.loop(6, 5, 'vertical')
		this.diagonalLoop([[0,3],[0,4],[0,5],[1,5],[2,5],[3,5]], [[6,3],[6,4],[6,5],[5,5],[4,5],[3,5]])
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
				this.winner()
			}
		}
		
	}
	
	diagonalLoop(loopOne, loopTwo) {
		
		function bothLoops (loop, direction) {
			loop.forEach((el) => {
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
					this.winner()
				}
			})
		}
		
		bothLoops(loopOne, 'forward')
		bothLoops(loopTwo, 'backwards')
	}
	
	winner () {
		this.whoseMove.innerHTML = 'We have a winner!'
	}
}

let game = new Game()

game.start()