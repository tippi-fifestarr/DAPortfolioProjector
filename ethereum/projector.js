import web3 from './web3';
import Projector from './build/PortfolioProjectProjector.json';

//this makes an instance for JS of the PortfolioProjectProjectorProjector
const instance = new web3.eth.Contract(
    //contract setup code
    JSON.parse(Projector.interface),
    //most recently deployed Projector contract
    // "0x11A961283CcEAf585e172B664e6fce86B7F27F28" //switch this one to see the dev history
    // "0x9f69823AA36700aEEE9A8E6AA54B2A3a33B6718B" //new root address (update: broken)
    // "0x9e56f15851a1e3D81eF765ECaf53115f5241ab91" //nope this one forgot name
    // "0xF8eD1B0BCaB0211670C8f47Da0d035e6B0682FB9" //successful draft version
    "0x710452b6cE8e90d84486E11ca792B139B83B8F67" //final version is live
);//original contract with "name", alternate contract in ./deploy.js

export default instance;
//if we need to get access to this instance from somewhere else
//we wont have to repeate this code, is just import this component
//instance components without using the component vocab instance
