import Web3 from "web3";
//tricky to keep your private keys and stuff secret
//most logical habit+skill is awareness + a final cleanup before push
// require('dotenv').config();

// var rpc = process.env.NEXT_PUBLIC_RINKEBY_RPC_URL
// var rpc = 'https://rinkeby.infura.io/v3/b9b....

let web3;
 
//old friend m_ boilerplate
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
 // We are in the browser and metamask is running.
 window.ethereum.request({ method: "eth_requestAccounts" });
 web3 = new Web3(window.ethereum);
} else {
 // We are on the server *OR* the user is not running metamask
 //get the infura RPC for rinkeby from our .env file
 const provider = new Web3.providers.HttpProvider(rpc);
 web3 = new Web3(provider);
}
 
export default web3;
