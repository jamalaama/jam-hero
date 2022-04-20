class Boundary {
	static width = 48
	static height = 48
	constructor({position}){
		this.position = position
		//4 x 12px because it was 400% zoomed
		this.width = Boundary.width
		this.height = Boundary.height
	}
	draw() {
		cxt.fillStyle = 'rgba(225, 0, 0, 0.8)'
		cxt.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
}


class Sprite {
	constructor({ position, velocity, image, frames = {max: 1}, sprites = []}) {
		this.position = position
		this.image = image
		this.frames = {...frames, val: 0, elapsed: 0}

		this.image.onload = () => {
		this.width = this.image.width / this.frames.max
		this.height = this.image.height
		}
        this.moving = false
        this.sprites = sprites
}

	draw() {
		cxt.drawImage(
		this.image,
        this.frames.val * 48,
		//Cropping 4 sprite image
		0, //y
		this.image.width / this.frames.max, //width
		this.image.height,    //height
		//
		this.position.x,
		this.position.y,
		//Sprite image positioning within the canvas
		
		this.image.width / this.frames.max,
		this.image.height
		)

        if (!this.moving) return
        if (this.frames.max > 1){
            this.frames.elapsed++
        }
        if (this.frames.elapsed % 10 === 0){
        //- 1 so that it doesnt render the character at the last pixel
        if (this.frames.val < this.frames.max - 1) this.frames.val++
        else this.frames.val = 0
	}}

}