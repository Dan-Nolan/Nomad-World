import "./index.scss";
import state from "./state/index";
import jsCookie from 'js-cookie';

console.log('profile test', jsCookie.get('x-nomad-profile'));

state.initialize();