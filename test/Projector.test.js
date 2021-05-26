//149 https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/learn 
///@dev the main purpose of this test is to test the Projects (campaign) contract 
///First test the compile build, then write the tests here for Projector.sol
//step 0 boilerplate testkit, we want to assert and use ganache as testnet
const assert = require("assert");
const ganache = require("ganache-cli");
//Case Convention on Constructor function (create Instances of Web3 library)
//Web3 to create the js object contract, use ganache as "provider"
const Web3 = require("web3");
//connect to the unlocked ganche accounts
//no concern over private keys and security
//freely send money
const web3 = new Web3(ganache.provider());
//WHY NOT? destructure the interface and bytecode from our complied contract
// const { interface, bytecode } = require("../compile");

//get the ABI (json) for the smart contracts
const compiledProjector = require("../ethereum/build/PortfolioProjectProjector.json");
const compiledPortfolioProject = require("../ethereum/build/PortfolioProject.json");

//declare 
let accounts;
let projector;
let PortfolioProjectAddress;
let PortfolioProject;
// remember (string memory name)
let portfolioProjectName;

// remember the name! 
beforeEach(async () => {
    // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
    //use one of the accounts to deploy
    //the Contract (Constructor function)
    //accessing the ethereum module, contract property.
    //first argument is ABI (interface) for the Projector("Factory")
    // we aren't going to make a factory/projector for each "it", so we make a Project beforeEach
  projector = await new web3.eth.Contract(JSON.parse(compiledProjector.interface))
    //chain on .deploy the bytecode and startup initialize instance message
    //.deploy creates js? object to be deployed via transaction
    .deploy({ data: compiledProjector.bytecode })
    // send the transaction with gas
    .send({ from: accounts[0], gas: "1000000" });
    // actually its deployed now

  //we are going to use the factory to make an "instance" of a new project
  //requires a min contribution limit (100 wei in this case) and the msg.sender(manager)
  ///@param: remember send (uint minimum, string "memory" name) 
  await projector.methods.createPortfolioProject("100", "name").send({
    from: accounts[0],
    gas: "1000000",
  });
  // no idea what address? the project is pushed to an address[] inside Projector
  //could you even possibly imagine doing this with callbacks or promises (without async/await)?
  [PortfolioProjectAddress] = await projector.methods.getDeployedPortfolioProjects().call();
  // write the code and cross yer fingers...
  portfolioProjectName = await projector.methods.getDeployedPortfolioProjectsName(PortfolioProjectAddress).call();
  //we've called the view function and destructured into an array of project addresses.
  // campaignAddress = addresses[0]
  //this is the js representation of the whole contract, pass in ABI & address of contract
  PortfolioProject = await new web3.eth.Contract(
    JSON.parse(compiledPortfolioProject.interface),
    PortfolioProjectAddress
  );
  //now we have a ready contract for each describe "it"
});

//most reasonable first test?  Check if the two contracts are truely deployed
describe("PortfolioProjects", () => {
  it("deploys a projector and a PortfolioProject", () => {
    assert.ok(projector.options.address);
    assert.ok(PortfolioProject.options.address);
    // basically, okay our testing setup works
  });

  //we expect accounts[0] (the deployer) is made to be manager
  it("marks caller as project manager", async () => {
    //how do we assert? call manager method to retrieve and ==
    const manager = await PortfolioProject.methods.manager().call();
    assert.strictEqual(accounts[0], manager);
  });

  it('allows people to contribute money and marks them as approvers', async () => {
    await PortfolioProject.methods.contribute().send({
      value: "200",
      from: accounts[1]
    }) //this should mark [1] as a contributor
    //only can look up a single address in the mapping, will return a bool
    const isContributor =  await PortfolioProject.methods.approvers(accounts[1]).call();
    assert(isContributor);
  })

  //try catch block (just like in the lottery contract)
  it('requires a minimum contribution', async() => {
    try {
      await PortfolioProject.methods.contribute().send({
        value: "50",
        from: accounts[1]
      }) //this should fail
      assert(false);
    } catch (err) {
      assert(err);
    }
  })

  //check manager has ability to create payment request
  it('allows a manager to make a payment request (for paint?)', async() => {
    await PortfolioProject.methods
      .createRequest('buy paint', '100', accounts[1])
      //152: 2:40 :'don't forget to "call send"'
      .send({
        from: accounts[0],
        gas: '1000000'
      }) //remember nothing is returned really on a send so try to get request at 0
      const request = await PortfolioProject.methods.requests(0).call()
      //requests are Structs (key value pairs)
      //theres no way to retrieve a whole mapping (because infinite keys)
      assert.equal('buy paint', request.description);
    });

    it('processes requests', async () => {
      await PortfolioProject.methods.contribute().send({
        from: accounts[0],
        //we want to send along some big money to easily tell, so use web3.utils
        value: web3.utils.toWei('10', 'ether')
      });

      await PortfolioProject.methods
        //three arguments, for what, how much, and to whom?!
        .createRequest('A painit', web3.utils.toWei('10', 'ether'), accounts[1])
        .send({ from: accounts[0], gas: '1000000'});
        //now we have to vote

      await PortfolioProject.methods.approveRequest(0).send({
        from: accounts[0], gas: '1000000'
      });

      //theoretically, only accounts[0] can (onlyManager) finalizeRequest
      await PortfolioProject.methods.finalizeRequest(0).send({
        from: accounts[0], gas: '1000000'
      })

      let balance = await web3.eth.getBalance(accounts[1]); 
      //we get a string, turn it into ether then number
      balance = web3.utils.fromWei(balance, 'ether');
      //parse string to float
      balance = parseFloat(balance);
      console.log(balance);
      //beware how much value is getting moved between accounts during testing
      //so we can't really do rigid (balance === 105)
      assert(balance > 104);
      //theres no good workarounds at the time?!
      ///@dev any discussion about this?!
    });

    //freestyle test: check to make sure it FAILS if 
    //try catch block (just like in the lottery contract)
  it('fails if non-contributer tries to vote/approve', async() => {
    try {
      await PortfolioProject.methods.approveRequest(0).send({
        from: accounts[3]
      }) //this should fail
      assert(false);
    } catch (err) {
      assert(err);
    }
  })

  //final test to the added string required!
  it('has a name "name"', async() => {
    // struggle getting this code right including ==, no await, and trying to send an index in instead 
    assert.equal("name", await projector.methods.getDeployedPortfolioProjectsName(PortfolioProjectAddress).call());
  })
});
