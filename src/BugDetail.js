import React from 'react';
import graphQLFetch from './graphQLFetch.js';
import URLSearchParams from 'url-search-params';
import Toast from './Toast';
export default class BugDetail extends React.Component {
constructor() {
super();
this.state = { 
    bug: {},
    toastVisible:false,
    toastMessage:'',
    toastType:"info"
 };
 this.showError=this.showError.bind(this);
 this.dismissToast=this.dismissToast.bind(this);
}
// showMessage(message)
// {
//     this.setState({toastVisible:true,toastMeassage:true,toastType:"info"})
// }
showError(message){
    this.setState({toastVisible:true,toastMessage:message,toastType:"danger"})
}
dismissToast(){
    this.setState({toastVisible:false});
}
componentDidMount() {
this.loadData();
}
componentDidUpdate(prevProps) {
const { match: { params: { id: prevId } } } = prevProps;
const { match: { params:{id} } } = this.props;
if (prevId !== id) {
this.loadData();
}

}
async loadData() {
const { match: { params:{id}} } = this.props;
const query = `query bug($id: Int!) {
bug (id: $id) {
id description
}
}`;

const data = await graphQLFetch(query, {id:Number(id)},this.showError);
if (data) {
this.setState({ bug: data.bug });
}
else {
    this.setState({ bug: {} });
    }
    }
    render() {
    const { bug: { description } } = this.state;
    const {toastVisible,toastMessage,toastType}=this.state;
    return (
    <div>
    <h3>Description</h3>
    <pre>{description}</pre>
    <Toast showing={toastVisible} onDismiss={this.dismissToast} bsStyle={toastType}>
        {toastMessage}
    </Toast>
    </div>
    );
    }
    }