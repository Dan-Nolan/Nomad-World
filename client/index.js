import "./index.scss";
import state from "./state/index";
import jsCookie from 'js-cookie';

const PROFILE_KEY = process.env.REACT_APP_USER_TOKEN || 'x-nomad-profile';

console.log(jsCookie.get(PROFILE_KEY));

state.initialize();