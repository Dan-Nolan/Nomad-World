import state from '/client/state/index';
import {ethers} from 'ethers';

const SWORD_ADDRESS = "0xc95439940280a6964b270b0373F25258d6F53c6C";
const NOMAD_ADDRESS = "0x4731478A76e4bC5f012a569D061bE19c03c9177F";

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
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = await provider.getSigner(0);
        
        const nomad = new ethers.Contract(NOMAD_ADDRESS, [
            "function mintResource(address resource, uint universeId, uint destinationWorldId) external payable"
        ], signer);
        await nomad.mintResource(SWORD_ADDRESS, 0, 0);
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
