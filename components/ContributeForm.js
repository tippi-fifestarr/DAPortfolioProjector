// import { FormInput } from "semantic-ui-react";
import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Project from "../ethereum/project" //to 
import web3 from '../ethereum/web3'
//import router to refresh page on send money
import { Router } from "../routes";

class ContributeForm extends Component {
    state = { 
        value: '',
        errorMessage: '',
        loading: false
        
    }

    onSubmit = async event => {
        event.preventDefault();
        //send money, specify which address is recieving request
        //get from props?!
        const project = Project(this.props.address) //our contract
        //loading spinner and reset the errorMessage on new submit
        this.setState({ loading: true, errorMessage: "" });
        
        //don't forget about try catch for functions and err to UX
        try {
            const accounts = await web3.eth.getAccounts();
            //contribute -> send()
            await project.methods.contribute().send({
                from: accounts[0],
                //convert this value to wei
                value: web3.utils.toWei(this.state.value, "ether")
            })
            //ES2015 template string = backticks
            //pass in url of current page (this project contract)
            Router.replaceRoute(`/projects/${this.props.address}`)
        } catch (err) {
            this.setState({ errorMessage: err.message })
        }
        //turn off loading flag
        this.setState({ loading: false, value: ""})
    }

    render() {
        return ( //make sure to mark the form with Error property!!
            <Form onSubmit={this.onSubmit}/*notice no ()*/ error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>
                        amount to contribute:
                    </label>
                    <Input
                        value={this.state.value}
                        onChange={event=> this.setState({ value: event.target.value})}
                        label="ether" 
                        labelPosition="right"
                    />    
                </Form.Field>
                <Message error header="oopsies! Try again (differently)" content={this.state.errorMessage}/>                
                <Button 
                    loading={this.state.loading}
                    primary>
                    Contribute!
                </Button>
            </Form>
        )
        //a title

        //a form

        //a button with spinner

    }
}

export default ContributeForm;