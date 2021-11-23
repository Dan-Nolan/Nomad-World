import state from '/client/state/index';
import {ethers} from 'ethers';

const SWORD_ADDRESS = "0x49Cda4f63Fe81b653007D04c49591a2096Ea39B7";

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
        
        const abi = [
            "function mint(address) external returns(uint)"
        ];
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = await provider.getSigner(0);
        const sword = new ethers.Contract(SWORD_ADDRESS, abi, signer);
        sword.mint(await signer.getAddress());
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
