//this page(Shows "Project" Details) dynamic to the token address of the project
//need to display lots of information from the blockchain but also let us create a request
//for funding that project!  so basically its a project management system!
import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
//be sure to add in the routes.js a routes.add()
import Layout from '../../components/Layout';
//import the returned web3 contract
import Project from '../../ethereum/project';
//need to get the name from within?
// import Projector from "../../ethereum/projector"
// import web3
import web3 from "../../ethereum/web3"
//import contribute form!
import ContributeForm from '../../components/ContributeForm'
import {Link} from '../../routes'

//in udemy this is called CampaignShow
//get intial props method, before rendering (in index.js)
class ProjectDetails extends Component {
    //we have to rerun getIntialProps to refresh this page?
    static async getInitialProps(props) { //even though getInitalProps
        // knows the address, the rest of methods (which belong to component instance)
        //pass the address through to the Project object creator
        //get ourselves a nice workable project contract for the
        //address in query question :0
        const project = Project(props.query.address);
        //we want to call some of our new functions (getSummary)
        const summary = await project.methods.getSummary().call();

        console.log("summary:",summary);
        //token from url
        // console.log(props.query.address);//the actual address of the project
        //want to show here on details.
        //we should label each part of the object
        return { 
            minimumContribution: summary[1],
            balance: summary[0],
            requestsCount: summary[2],
            //# of contributors
            approversCount: summary[3],
            //name of contract as stored in Projector?
            projectName: summary[4],
            //too hard, just add name of manager?
            managerAddress: summary[5],
            //return the adddress of this contract
            address: props.query.address
        
        };//always gotta return
    
    }

    renderCards() {
        //lets make a list of items, remember mapping over through addresses?
        const {
            balance,
            managerAddress,
            minimumContribution,
            requestsCount,
            approversCount,
            projectName
        } = this.props; //incredible destructuring!
    
        const items = [
            { //manager card here
                header: managerAddress,
                meta: "address of manager",
                description: 
                `The manager created this project: "${projectName}" and can create requests to withdraw money`,
                style: { overflowWrap: "break-word"}
            },
            { //minimum contribution
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description:
                'you must contribute at least this much wei to gain access (and voting rights!)'
            },
            {//requests  card
                header: requestsCount,
                meta: 'Number of requests',
                description:
                'a request tries to withdraw money (and transfer?!) from the contract. Requests must be approved by majority of approvers!'
            },
            {//approvers count card
                header: approversCount,
                meta: "number of approvers",
                description: "number of people who have already 'invested' into this project"
            },
            {//balance into ETHER card
                header: web3.utils.fromWei(balance, 'ether'),
                meta: "Project Balance (ether)",
                description: 'the balance is how much money this project has left to spend'
            }


        ]

        return <Card.Group items={items} />
    }

    render() {
        return (
            <Layout>
                <h3>
                    Show Project Details
                </h3>
                {/* 
                remember the automatically generated
                get methods from the contract that I was worried
                about from before?
                me barely, however, h2 are all 4 seperate function
                calls?  is there a way to make a single helper method
                that returns the whole summary of everything!
                that means we are going back modify to the contract...
                */}
                <h2>
                    {/* Names: {this.props.projectName}
                    Total Balance, {this.props.balance}
                    Minimum Contribution, {this.props.minimumContribution}
                    Pending Requests, {this.props.requestsCount}
                    Contributors _____! {this.props.approversCount}
                And whooooo is the Manager? {this.props.managerAddress}  */}
                </h2>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>

                        <Grid.Column width={6}>
                            {/* props through the address */}
                            <ContributeForm address={this.props.address}/>   
                        </Grid.Column>
                        </Grid.Row>
                        {/* two rows */}
                        <Grid.Row>
                            {/* got to have a column too, for styling nice */}
                            <Grid.Column>
                                <Link route={`/projects/${this.props.address}/requests`}>
                                    <a>
                                        <Button primary>View Requests</Button>
                                    </a>
                                </Link>
                            </Grid.Column>
                        </Grid.Row>
                </Grid>
                <p>
                    {/* /* 
                remember the automatically generated
                get methods from the contract that I was worried
                about from before?
                me barely, however, h2 are all 4 seperate function
                calls?  is there a way to make a single helper method
                that returns the whole summary of everything!
                that means we are going back modify to the contract...
                */ }
                </p>
            </Layout>
        )
    }
}

export default ProjectDetails;