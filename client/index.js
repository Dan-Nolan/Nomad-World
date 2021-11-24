import "./index.scss";
import state from "./state/index";
import jsCookie from 'js-cookie';

const profile = jsCookie.get('x-nomad-profile');
if(!profile) {
    window.location = "https://mynomad.quest";
}

import { ethers } from 'ethers';

const ethereum = window.ethereum;

const SWORD_ADDRESS = "0xc95439940280a6964b270b0373F25258d6F53c6C";
const NOMAD_ADDRESS = "0x4731478A76e4bC5f012a569D061bE19c03c9177F";

(async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner(0);

    await ethereum.request({ method: 'eth_requestAccounts' });

    const sword = new ethers.Contract(SWORD_ADDRESS, [
        "function tokenIdsOf(address tokenOwner) public view returns (bytes32[] memory)"
    ], signer);
    
    let [tokenId] = await sword.tokenIdsOf(await signer.getAddress());
    
    tokenId = parseInt(tokenId);

    const nomad = new ethers.Contract(NOMAD_ADDRESS, [
        "function getResourceWorldId(uint, address, uint) external view returns(uint)"
    ], signer);

    let worldId = -1;
    try {
        worldId = (await nomad.getResourceWorldId(0, sword.address, tokenId)).toNumber();
    }
    catch(ex) {

    }

    state.scene.initializeHero(worldId);
    state.initialize();
})();