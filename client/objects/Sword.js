import state from '/client/state/index';
import {ethers} from 'ethers';
import jsCookie from 'js-cookie';

class Sword {
    x = 0;
    y = 0;
    sprite = "sword"
    boxWidth = .5;
    heightOffset = 20;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    async touch() {
        state.destroyObject(this);
        
        await ethereum.request({ method: 'eth_requestAccounts' });

        const profile = jsCookie.get('x-nomad-profile');

        console.log(profile);
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
