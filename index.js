const canvas = document.querySelector('canvas')
const cxt = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const collisionsMap = []
//the map is 70 tiles wide, hence i +=70
for (let i = 0; i < collisions.length; i += 70) {
	collisionsMap.push(collisions.slice(i, 70 + i))
//70 + i so that it changes every 70 tiles of the data set
}

const battleZonesMap = []
for (let i = 0; i < battledata.length; i += 70) {
	battleZonesMap.push(battledata.slice(i, 70 + i))
}

const offset = {
	x:-1840,
	y:-85
}

const boundaries = []

collisionsMap.forEach((row, i) => {
	//i = rows
	//j = symbols on each row
	row.forEach((symbol, j) => {
		if (symbol === 1025) 
		boundaries.push(
			new Boundary({
				position: {
					x: j * Boundary.width -1840,
					y: i * Boundary.height - 85

				}
			})
		)
	})
})

const battleZones = []

battleZonesMap.forEach((row, i) => {
	row.forEach((symbol, j) => {
		if (symbol === 90) 
		battleZones.push(
			new Boundary({
				position: {
					x: j * Boundary.width -1840,
					y: i * Boundary.height - 85

				}
			})
		)
	})
})

console.log(battleZones)


const image = new Image()
image.src = './img/gameMap1.png'

const foregroundImage = new Image()
foregroundImage.src = './img/Foreground.png'

const playerImage = new Image()
playerImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

const player = new Sprite({
	position: {
		x:canvas.width / 2 - 192 / 4 / 2,
		y:canvas.height / 2 - 68 / 2
	},
	image: playerImage,
	frames: {
		max: 4
	},
	sprites: {
		up: playerUpImage,
		left: playerLeftImage,
		right: playerRightImage,
		down: playerImage
	}
})

const background = new Sprite({
	position: {
	x: offset.x,
	y: offset.y
	},
	image: image
})

const foreground = new Sprite({
	position: {
	x: offset.x,
	y: offset.y
	},
	image: foregroundImage
})


const keys = {
	w: {
		pressed: false
	},
	a: {
		pressed: false
	},
	s: {
		pressed: false
	},
	d: {
		pressed: false
	}
}

const movables = [background, ...boundaries, foreground, ...battleZones]

function rectangularCollision({rectangle1, rectangle2}) {
	return (
		rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
		rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
		rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
		rectangle1.position.y + rectangle1.height >= rectangle2.position.y
	)
}
function animate() {
	window.requestAnimationFrame(animate)
	background.draw()
	boundaries.forEach(Boundary => {
		Boundary.draw()
	})

	battleZones.forEach(battleZone => {
		battleZone.draw()
	})
	
	player.draw()
	foreground.draw()

	if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
		for (let i = 0; i < battleZones.length; i++){
			const battleZone = battleZones[i]
			const overlappingArea = Math.min(player.position.x + player.width, 
				battleZone.position.x + battleZone.width) -
				Math.max(player.position.x, battleZone.position.x)
			if (
				rectangularCollision({
					rectangle1: player,
					rectangle2: battleZone
				}) &&
				overlappingArea > (player.width * player.height) / 2
			)	{
				console.log('battle activated')
				break
				}
		}
			
	}
	let moving = true
	player.moving = false
	if (keys.w.pressed && lastKey === 'w') {
		player.moving = true
		player.image = player.sprites.up
		for (let i = 0; i < boundaries.length; i++){
			const Boundary = boundaries[i]
			if (
				rectangularCollision({
					rectangle1: player,
					rectangle2: {
						...Boundary,
						position: {
							x: Boundary.position.x,
							y: Boundary.position.y + 3
						}
				}
			})
			){
				console.log('colliding')
				moving = false
				break
				}
			}
				
		if(moving)
		movables.forEach((movable) => {
			movable.position.y += 3
		})
	}
		else if (keys.a.pressed && lastKey === 'a') {
			player.moving = true
			player.image = player.sprites.left
			for (let i = 0; i < boundaries.length; i++){
				const Boundary = boundaries[i]
				if (
					rectangularCollision({
						rectangle1: player,
						rectangle2: {
							...Boundary,
							position: {
								x: Boundary.position.x +3,
								y: Boundary.position.y
							}
					}
				})
				){
					console.log('colliding')
					moving = false
					break
					}
				}
			if(moving)
			movables.forEach((movable) => {
				movable.position.x += 3
			})
		}
		else if (keys.s.pressed && lastKey === 's') {
			player.moving = true
			player.image = player.sprites.down

			for (let i = 0; i < boundaries.length; i++){
				const Boundary = boundaries[i]
				if (
					rectangularCollision({
						rectangle1: player,
						rectangle2: {
							...Boundary,
							position: {
								x: Boundary.position.x,
								y: Boundary.position.y -3
							}
					}
				})
				){
					console.log('colliding')
					moving = false
					break
					}
				}
			if(moving)
			movables.forEach((movable) => {
				movable.position.y -= 3
			})
		}
		else if (keys.d.pressed && lastKey === 'd') {
			player.moving = true
			player.image = player.sprites.right

			for (let i = 0; i < boundaries.length; i++){
				const Boundary = boundaries[i]
				if (
					rectangularCollision({
						rectangle1: player,
						rectangle2: {
							...Boundary,
							position: {
								x: Boundary.position.x -3,
								y: Boundary.position.y
							}
					}
				})
				){
					console.log('colliding')
					moving = false
					break
					}
				}
			if(moving)
			movables.forEach((movable) => {
				movable.position.x -= 3
			})
		}
	}
animate()

let lastKey = ''
window.addEventListener('keydown', (e) => {
	switch (e.key) {
		case 'w':
			keys.w.pressed = true
			lastKey = 'w'
			//console.log('w')
			break

		case 'a':
			keys.a.pressed = true
			lastKey = 'a'
			//console.log('a')
			break

		case 's':
			keys.s.pressed = true
			lastKey = 's'
			//console.log('s')
			break

		case 'd':
			keys.d.pressed = true
			lastKey = 'd'
			//console.log('d')
			break
	}
})

window.addEventListener('keyup', (e) => {
	switch (e.key) {
		case 'w':
			keys.w.pressed = false
			//console.log('w')
			break

		case 'a':
			keys.a.pressed = false
			//console.log('a')
			break

		case 's':
			keys.s.pressed = false
			//console.log('s')
			break
			
		case 'd':
			keys.d.pressed = false
			//console.log('d')
			break
	}
})