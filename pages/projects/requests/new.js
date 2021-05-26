import React, { Component } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Project from '../../../ethereum/project';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes'//redirect when done
import Layout from "../../../components/Layout"


class RequestNew extends Component {
    //initialize props / states
    state = {
        value: '',
        description: '',
        recipient: '',
        loading: false,
        errorMessage: ""
    };
    
    //to get access to other stuff
    static async getInitialProps(props) {
        const {address} = props.query;

        return { address };
    }

    //set up onsubmit handler, wire to form
    onSubmit = async event => {
        event.preventDefault();

        const project = Project(this.props.address);
        //pass in variables from state, destructure
        const { description, value, recipient } = this.state;

        this.setState({loading: true, errorMessage:''})
        try {
            //get list of accounts and send from 0
            const accounts = await web3.eth.getAccounts();
            await project.methods.createRequest(
                description,
                web3.utils.toWei(value, 'ether'),
                recipient
                )//verified correct order
                .send({from: accounts[0]})
            //make sure to pass in wei
            //navigate user back to list of requests
            Router.pushRoute(`/projects/${this.props.address}/requests`)

        } catch (err) {
            this.setState({errorMessage: err.message})
        }

        this.setState({loading: false})
    }


    render() {
        return (
            <Layout>
                <Link route={`/projects/${this.props.address}/requests`}>
                    <a>

                            Back (projects request list)

                    </a>
                </Link>
                <h3>Create a Request</h3>   {/*error message truthy flipper*/}
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input 
                            value={this.state.description}
                            onChange={event => this.setState({
                                description: event.target.value
                            })}
                        />
                    </Form.Field>

                    <Form.Field> 
                        {/* beware of creating request over balance size */}
                        <label>Value in Ether</label>
                        <Input 
                            value={this.state.value}
                            onChange={event => this.setState({
                                value: event.target.value
                            })}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Recipient</label>
                        <Input 
                            recipient={this.state.recipient}
                            onChange={event => this.setState({
                                recipient: event.target.value
                            })}
                        />
                    </Form.Field>
                    <Message error header="oops! something went wrong"
                    content={this.state.errorMessage} />
                    <Button primary loading={this.state.loading}>
                        Create!    
                    </Button>
                </Form>
            </Layout>
        )
    }
}

export default RequestNew;