import state from '/client/state/index';

const SPRITE_HEIGHT = 128;
const SPRITE_WIDTH = 128;

class Sword {
    sprite = "sword"
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    update() {

    }
    render() {
        const { ctx } = state;
        ctx.drawImage(
            this.img,
            this.x,
            ctx.canvas.height - this.y - 64,
            28,
            28
        );
    }
}

export default Sword;
