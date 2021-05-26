// /@title: Distributed Awesome Portfolio Project
// /@subtitle: New Funding Paradigm: Mr. Manager, Request Funds
// /@author: Tippi Fifestarr, web3._wingbird, man of transparent mysteries
// /@notice first attempt at natspec in solidity, use this contract to raise money
// /@dev true double contract sol, integrating wisdom from chainlink hackathon

// attempting to incorporate ^0.6.6 chainlinkathon technique
pragma solidity ^0.4.17;

// /@notice projector = factory (like a mint makes coins)
// /@dev first double contract attempted (including own factory/projector)
contract PortfolioProjectProjector {
    address[] public deployedProjects;
    //check this with a test before deploying
    mapping(address => string) projectAddressToName;
    
    // /@notice: this function creates a new contract to deploy to blockchain
    // /@param: a minimum is required to deploy the PortfolioProject function
    ///and because of the PortfolioProject constructor functions req msg.sender
    function createPortfolioProject(uint minimum, string memory name) public {
        //security for name required not null
        // require(name != "", 'no null names plz'); //errored here!
        //check it out, assign the name to the map with address
        address newPortfolioProject = new PortfolioProject(minimum, msg.sender, name);
        //add it to deployedProjects array
        deployedProjects.push(newPortfolioProject);
        //assign to the map
        projectAddressToName[newPortfolioProject] = name;
        // console.log(projectAddressToName[newPortfolioProject]);
    }
    
    // /@notice return all of the created PortfolioProjects at once
    function getDeployedPortfolioProjects() public view returns (address[]) {
        return deployedProjects;
    }

    // /@notice return all of the created PortfolioProjects -> name string[] at once
    // i got bored and gave up "its not a core feature", then i got unbored and fixed it.
    //@param: index of the project 
    function getDeployedPortfolioProjectsName(address index) public view returns (string) {
    //     return //loop through the addresses ini deployedProjects.length = to a var of hmmm does this cost gas????
    //     for (uint i=0; i < deployedProjects.length; i++) {
            // return projectAddressToName[deployedProjects[index]];
            return projectAddressToName[index];
    //     }
    }
    //consider adding a function to update the name inside PortfolioProject?
}//echos of forgotten scaffolding from back when i really didn't get it 

// /@notice: orig contract "Campaign" for kickstarting, adapted for webdevs like me
contract PortfolioProject {
    // request to send? the idea of a request!
    //brand new type (like address, uint, etc)
    struct Request {
        string description; //purpose
        uint value;         //amount
        address recipient;  //to_who
        bool isCompleted;   //paid true?
        //refactoring to fix expensive gas array problem
        // /@dev approval = vote yes
        uint approvalCount;
        //better naming? originally "approvals"
        mapping(address => bool) addressVoted; ///@dev true?
    }
    
    // create instance: variable of type (array of Request structs)
    // only mananager can create request (see modifier onlyManager)
    Request[] public requests;
    // /@dev deployer of this contract becomes manager
    address public manager;
    uint public minimumContribution;
    //!!! an array of address called approvers !!! warning
    // address[] public approvers;  //<-we don't like this one
    mapping(address => bool) public approvers;  //this way is Constant Time
    uint public approversCount; //to save on fees, each donation just increment this 
    //bonus string spot
    string public name; //get tjos assigned on construction

    // by convention this is where we have modifierz
    // my naming choice
    modifier onlyManager() {
        require(msg.sender == manager);
        // virtually paste the rest of the code (being modified)
        _;
    }
    
    // /@notice: this is the constructor function (woot!)
    // /@param: requires a minimum amount in wei and msg.sender = creator
    function PortfolioProject(uint minimum, address creator, string _name) public {
        // manager = msg.sender;    //could have an OR operator?
        manager = creator;
        minimumContribution = minimum;
        name = _name;
    }
    
    // contribute can be .sent() with value above minimum (fixed in construction)
    // /@dev: see above (@param)
    function contribute() public payable {
        // greater or =, a dangerous variation?
        require(msg.value > minimumContribution);
        //push the sender into the array of approvers (but what is the issue!?)
        // approvers.push(msg.sender);
        //problems with arrays...
        
        // /@notice this is our scalable solution
        approvers[msg.sender] = true;
        // /@dev SafeMath?  approversCount = number of people donated
        approversCount++;
    }
    
    // lock it down and restrict
    function createRequest(string description, uint value, address recipient)
        public onlyManager {
        //00 create a new struct and add it to the array?
        Request memory newRequest = Request({
           //field key : value argument
           description:  description,
           value: value,
           recipient: recipient,
           isCompleted: false,
           approvalCount: 0
           //we don't have initialize "reference-types" such as addressVoted
        });
        //00 infotip: alternate method to 00, highly unrecommended, yet equivalent
        //Request newRequest = Request(description, value, recipient, false);
        //00 damn slick, but if I or you reorder later coding, it'll get whacked
        //add to array
        requests.push(newRequest);
    }
    
    // /@dev check it out
    function approveRequest(uint index) public {
        
        ///@learn "storage" we want to manipulate the copy of struct thats in storage
        Request storage request = requests[index];
        // /@notice we are making sure the caller of the approveRequest is on the approvers list
        // /@dev requirements can appear wherever you want in a function, isn't that nice? feel free to blockroad
        require(approvers[msg.sender]);
        // /@param: at the index in the requests struct, check if addressVoted for the message.sender is 
        // /@dev !TRUE =not true
        require(!request.addressVoted[msg.sender]);
        
        // /@dev why use SafeMath for this? implements easier, but is there a way in to underflow?
        // /@notice preventing double voting
        request.addressVoted[msg.sender] = true;
        // /@notice increments the approvalCount for this request, towards eventual threshold?
        request.approvalCount++;
    }
    
    // /@notice send the eth to recipient and mark complete
    function finalizeRequest(uint index) public onlyManager {
        ///@learn this boilerplate 
        Request storage request = requests[index];
        
        // roadblocks
        ///@eg if we have 50 voters, 26 people must approve before okay
        require(request.approvalCount > (approversCount / 2));
        require(!request.isCompleted); //if its already completed, fail
        
        // /@param recipient is who to send to, how much is stored in value
        request.recipient.transfer(request.value);
        
        //make sure cannot be finalized again
        request.isCompleted = true;
        
    }

    //after working throuogh most of the front end, lesson 199
    //we jump back and add a dope function, but that also means 
    //figure out the way to integrate "name"

    function getSummary() public view returns(
        uint, uint, uint, uint, string, address
        ) {
        return (
            //balance
            this.balance,
            //minimum
            minimumContribution,
            //total requests
            requests.length,
            //# of contributors
            approversCount,
            //name of contract as stored in Projector?
            name,
            //too hard, just add name of manager?
            manager
            //
        );
    }
    //final bonus component function
    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}
///be willing to leave your old factory and its names in the dust!
//updated Projector address?