import React, { Component } from "react";
// 189 udemy solid: at this point we just build by page with 2 components
//advantage of semantic ui react is speed, beauty and open source
import { Form, Button, Input, Message, Label } from "semantic-ui-react";
//this is kind of like a wrapper for each page
import Layout from "../../components/Layout";
//our project contract creator, i'm not at all sure why we need it here
import projector from "../../ethereum/projector";
import web3 from "../../ethereum/web3";
//react compentnet lets us render ancher tags and navigate
//router lets us redirect the people, use it after made new project
//let the user nav around...nice
import { Router } from "../../routes";

//eventually, everything clicks into correctness
class ProjectNew extends Component {
  state = {
    //param (min, name) required for submitting new project to projector
    minimumContribution: "",
    name: "",
    //UX let us know
    errorMessage: "",
    //whats up
    loading: false
  };

  //push the button
  onSubmit = async (event) => {
      //dont be basic
    event.preventDefault();
    //set the spinning loading UI and clear any error message
    this.setState({ loading: true, errorMessage: "" });

    //try to create a new Project using the "Projector.sol"
    try {
      const accounts = await web3.eth.getAccounts();
      await projector.methods
      //createProject, required param of value min(wei), name(string)
        .createPortfolioProject(this.state.minimumContribution, this.state.name)
        //send the transaction from our 0 account (whatever is active in wallet?)
        .send({
          from: accounts[0],
        });//if error give us errorMessage in the app state
      // immediately after we call, redirect
      Router.pushRoute('/');//tiny bit of code does that nav
      //creates a new entry in the browser history
      //lot of set up to get that ^ code set up
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    //update the loading button state, resolve the UX flag
    this.setState({ loading: false });
  };

  //render the page
  render() {
    return (
    //page wrapper
      <Layout>
        
        <h3>Create New Project</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
             <Label as='a' color='teal' ribbon='right'>
              :10,000 wei = 0.00000000000001 ETH
            </Label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={(event) =>
                this.setState({ minimumContribution: event.target.value })
              }
            />
          </Form.Field>
          {/* <Message error header="Oops!" content={this.state.errorMessage} /> */}
          <Form.Field>
            <label>Project "Name"</label>
            <Label as='a' color='green' ribbon='right'>
              :String
            </Label>
            <span>
                {/* not sure if this span is necessary */}
            <Input
              label="name:"
              labelPosition="left"
              value={this.state.name}
              onChange={(event) =>
                this.setState({ name: event.target.value })
              }
            />
            </span>
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button 
            loading={this.state.loading} 
            primary
            size="huge"
            // centered
          >
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default ProjectNew;
//05.22.21 1556 confirmed working new address on etherscan 
//https://rinkeby.etherscan.io/address/0xa77586a491fb916c0f01d6d9be4d4bd1602c618e#code
//unverified
//how to verify
//
