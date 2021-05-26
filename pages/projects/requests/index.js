// a list of requests to 
import React, {Component} from 'react';
import { Table, Button } from 'semantic-ui-react';
import { Link } from "../../../routes"
import Layout from '../../../components/Layout';
//import the project function
import Project from '../../../ethereum/project'
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {

    //here we gain access to project, so can pass through
    static async getInitialProps(props) {
        //
        const { address } = props.query;
        const project = Project(address)
        //get total number of requests from project
        const requestCount = await project.methods.getRequestsCount().call()
        const approversCount = await project.methods.approversCount().call()
        const nameDetail = await project.methods.name().call()

        //then one by one (promise.all) fancy javascript
        const requests = await Promise.all(
            Array(parseInt(requestCount))//array expects a num not string
                .fill() //trick to give a list of indexcise 
                .map((element, index) => { //essentially get an array that moves from 0 to request count!
                    //this returns an individual request
                return project.methods.requests(index).call()
            })
        )
        // console.log(requests)
        return { address, requests, requestCount, approversCount, nameDetail };//passed requests & count
    }

    renderRows() {//the backbone of our body of our table
        //helper method
        return this.props.requests.map((request, index) => {
            return (
                <RequestRow 
                    key={index} //whenever rendering a list of cmpnts
                    id={index}
                    request={request}
                    address={this.props.address}
                    approversCount={this.props.approversCount}
                />
            )
        })//semantic ui expects we will place all of these in a Body element
    }
    
    render() {
        const { Header, Row, HeaderCell, Body } = Table; //destructure from Table tag


        return (
            <Layout>
                <h3>
                    Request List for {this.props.nameDetail}
                </h3>
                <Link route={`/projects/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated="right" style={{marginBottom: 10}}>
                            Add Request
                        </Button>
                    </a>
                </Link>
                <Table>
                    <Header> {/*render out the header titles*/}
                        <Row>
                            <HeaderCell>
                                ID 
{/*index from the individual request from inside the requests array*/}
                            </HeaderCell> 
                            <HeaderCell>
                                Descruiption
                            </HeaderCell>
                            <HeaderCell>
                                Amount
                            </HeaderCell>
                            <HeaderCell>
                                recperinet
                            </HeaderCell>
                            <HeaderCell>
                                approval count
                            </HeaderCell>
                            <HeaderCell>
                                approved
                            </HeaderCell>
                            <HeaderCell>
                                Foinalize
                            </HeaderCell>
                        </Row>
                    </Header>
                    {/* renderRow and cells from the RR comp */}
                    <Body>
                        {this.renderRows()} 
                        {/* dont forget to () */}
                    </Body>
                </Table>
                <div>Found {this.props.requestCount} requests</div>
            </Layout>

        )
    }
}

export default RequestIndex;