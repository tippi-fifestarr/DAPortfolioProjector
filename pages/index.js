///@title this is the DaPortfolioProjector project list page
///05.22.21 1630 this page looks like shit fix it
//fixed it!  current trouble here is with displaying the name of the contract
import React , { Component } from 'react';
import { Card, Button, Message } from 'semantic-ui-react'
import projector from '../ethereum/projector';
import Layout from "../components/Layout";
import { Link } from '../routes';
//i thought to use this to easily get the name of the project by address
// import Project from '../ethereum/project'

//list of steps from Udemy 161 Root Route (solidity & eth)
// //1. configure web3 with provider from metamask
// import Web3 from "web3";
 
// window.ethereum.request({ method: "eth_requestAccounts" });
 
// const web3 = new Web3(window.ethereum);
 
// export default web3;
//2. tell web3 that deployed copy of Projector exists
//3. use Projector instance to retrieve a list of deployed campaigns
//4. use react to show something about each campaign

class ProjectorsIndex extends Component {
    // defines a class function (normally have to create instance 
    //to access methods) eg: const campaignIndex = new CampaignIndex();
    // campaignIndex.render()?    //campaignIndex.getInitialProps()??
    //rendering a component is computationally heavy, this is
    static async getInitialProps() {
        console.log('start by getting the addresses of all deployed projects')
        const projects = await projector.methods.getDeployedPortfolioProjects().call();
        //object for props
        // got to have some minimum jsx to make compiler happy
        //for loop through the address
        console.log('started here they are:', projects)
        //not sure if this is necessary...
        let names = [];
        //forgot the semantic way to do it
        ///@dev update to ES whatever is dope
        for (let index = 0; index < await projects.length; index++) {
                console.log('index loop with async of projects works!')
                // const name = notNecessary(because_await)
                names.push(await projector.methods.getDeployedPortfolioProjectsName(projects[index]).call())
                console.log(names[index],"pushed it real good")
                //finished at 1708, pushed the quoth_the_poet_with_a_lisp:expensive_typo.eth
                //at 0x0d7574e4f52d448EE4f9A7C3301cCD3E663cdAB7
        }
        console.log("all the names", names)
        return { projects, names }
    }
            
    renderProjects() {
        //loop through addresses, a map: pass a function into
        //functions called one time for every element in array
        //whatever we return is assigned to items
        // let mapIndex;
        const items = this.props.projects.map(address => {
            //assemble one object to represent the card
            
            return {
                header: address,
                description: (
                    <Link route={`/projects/${address}`}/*dynamically computer*/>
                        <a>
                        View this Portfolio Project's Details
                        </a>
                    </Link>
                ),
                meta: "This project name is {this.props.names[index]}",
                // meta: this.props.names[mapIndex], //placeholder but teststers
                // meta: "lorem ipsum how to fix...umm....{this.props.names} just lists them all its insane", //this is the best i can get it
                //let the card width go all the way (variations)
                fluid: true
            }
        })
        // mapIndex++ //???? how to do this
        
        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <div>
                    {/* <h1>Projectors Index!</h1> */}
                    <h2>Welcome To Tippi Fifestarr's Decentralized A______ Portfolio Project Project 🤓</h2>
                    <p>Each 0x___ address on this index represent a single project within my portfolio. 
                        Each project exists as Smart Contract on the Ethereum Virtual Machine, and therefore 
                        can send and recieve real ETH.  Only Tippi Fifestarr may create new projects, but all of you
                        are welcome and encouraged to check out my projects details and contribute ETH towards future
                        development!  Any user with valid wallet address (metamask recommended) can contribute to a project
                        and by contributing, you gain the ability to approve (vote!) any and all requests within that project.
                        Tippi Fifestarr must finalize the request to actually send the funds to desired address (either pay self
                        or pay others to help!)
                    </p>
                    {/* the link tag gives us the nav functionality */}
                    <Link route="/projects/new">
                        {/* a gives rightclick normal html linky stuff */}
                        <a>
                        <Button
                        floated="right"
                        content="Create Project"
                        icon="add circle" //plus with a circle around it
                        primary
                    />
                        </a>
                    </Link>
                    {/* this.renders the projects 0x and name and link to details */}
                    {this.renderProjects()}
                    <Message info>
                        <Message.Header>Currently Deployed on Rinkeby Testnet</Message.Header>
                        <p>Use this site w/ MetaMask set to Rinkeby Testnet to contribute positively to my Seratonin levels</p>
                    </Message>
                </div>
            </Layout>
        )
    }
}
//be sure to export
export default ProjectorsIndex;
//1733 it looks nice and works with the first example contract address loaded inthere