//udemy 201 this is called Campaign.js
import web3 from './web3';
import Project from './build/PortfolioProject.json';

//this makes an instance for JS of the Project
//when we use it inside Project Details, we don't know
//what is the address, need to get it from props?
//using a function that recieves an address, does the instancing
//then returns the new contract
export default (address) => {
    return new web3.eth.Contract(
        JSON.parse(Project.interface),
        //will and can be many different addresses
        address
    );
}

//import the bytecode and abi (json) of whatever address is piped in
//export returns a new web3 ethereum Contract to the pages/projects/details.js