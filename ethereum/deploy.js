///@title deployed.js boilerplate from Lottery 102
//WARNING error error check MNEMONIC and rpc WARNING
//0x11A961283CcEAf585e172B664e6fce86B7F27F28
//some key changes in how we deploy (comp on the fly vs our build folder)
const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
// //100% unsure about this line so commenting it out require('dotenv').config();
//refactor, updating: require in the builds
// const { interface, bytecode } = require("./compile");
const compiledProjector = require('./build/PortfolioProjectProjector.json')
//right now we aren't using the compiled PortfolioProject but later we will web3
// in webapp to interact with deployed instances (we'll need that abi) to work with it

//had to consult my NFTnote truffle-config.js to find these value, 
//not sure if it will work
// var mnemonic = process.env.MNEMONIC
// var rpc = process.env.NEXT_PUBLIC_RINKEBY_RPC_URL
const provider = new HDWalletProvider(
  // mnemonic,
    "advice jar _____",
    //remember to not include your actual money wallets mnemonic in the github push
    // remember to change this to your own phrase! or figure out how to .env
//    process.env.MNEMONIC, process.env.RINKEBY_RPC_URL
    // rpc
    'https://rinkeby.infura.io/v3/b9....9' //for example

  // remember to change this to your own endpoint!  
  //env doesn't work in next.js?  gotta be a way...nope...well...
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

//   previously, we parsed json from (interface), not 
  const result = await new web3.eth.Contract(
      JSON.parse(compiledProjector.interface) //-< updated way
    )
    //this is the chained on action to ______ the Contract
    .deploy({ data: compiledProjector.bytecode })
    .send({ gas: "1000000", from: accounts[0] });
    
    console.log("Contract deployed to", result.options.address);

};
deploy();

///5.22.2021 just checked this, it works: cleanly deployed 0xa430081b34425905f16C45463468a3De06A471A2

//2125 : address newly deployed: 0x9f69823AA36700aEEE9A8E6AA54B2A3a33B6718B
///it was the wrong contract that i deployed
//5.23 1723 redeployed to solidity
///new "projector" with getSummary function (untested) 0x9e56f15851a1e3D81eF765ECaf53115f5241ab91