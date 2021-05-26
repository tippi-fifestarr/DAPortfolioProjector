import React, {Component} from 'react'
import { Table, Button } from 'semantic-ui-react'
import web3 from '../ethereum/web3'
import Project from '../ethereum/project';

class RequestRow extends Component {
    onApprove = async () => {
        const project = Project(this.props.address);
        const accounts = await web3.eth.getAccounts();
        await project.methods.approveRequest(this.props.id).send({
            from: accounts[0]
        })
    }

    onFinalize = async () => {
        const project = Project(this.props.address);
        const accounts = await web3.eth.getAccounts();
        await project.methods.finalizeRequest(this.props.id).send({
            from: accounts[0]
        })
    }

    render() {
        const { Row, Cell } = Table;
        const { id, request, approversCount } = this.props;
        const readyToFinalize = request.approvalCount > approversCount / 2;

        return (
            <Row disabled={request.isCompleted} 
            positive={readyToFinalize && !request.isCompleted}>
                <Cell>{id}</Cell>
                {/* access request object as prop */}
                <Cell>{request.description}</Cell>
                {/* value property (for total request amount) */}
                <Cell>{web3.utils.fromWei(request.value)}</Cell>
                {/* if confused by which is what, check .sol */}
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount} / {approversCount}  </Cell>
                <Cell>
                    {/* approve button check boolen to hide*/}
                    {request.isCompleted ? null : (
                        // if thats true, return null, however if false: render this butt
                        <Button color="green" basic onClick={this.onApprove}>
                            {/* no () when not invoking right away */}
                            Approve!
                        </Button>
                    )}
                </Cell>
                <Cell>
                    {request.isCompleted ? null : (
                        <Button color="teal" basic onClick={this.onFinalize}>
                            Finalize?
                        </Button>
                    )}
                </Cell>
            </Row>
        )
    }
}

export default RequestRow;