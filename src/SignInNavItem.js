import React from 'react';
import {Modal,Button,NavItem,MenuItem,NavDropdown} from 'react-bootstrap';
import withToast from './withToast';
//import {gapi} from 'gapi-script'
// import { json } from 'C:/Users/tedtf/AppData/Local/Microsoft/TypeScript/3.6/node_modules/@types/body-parser';

 class SignInNavItem extends React.Component{

constructor(props)
{
    super(props)
    this.state=
    {
        showing:false,
    //     user:{
    //        givenName:'',
    //        signedIn:false
    //    },
       disabled:true
    }
    this.signIn=this.signIn.bind(this);
    this.signOut=this.signOut.bind(this);
    this.showModal=this.showModal.bind(this);
    this.hideModal=this.hideModal.bind(this);
}

//     async loadData()
//     {
// const endPoint= window.ENV.UI_AUTH_ENDPOINT;
// const response=await fetch(`${endPoint}/user`,{
//     method:'POST',
//     // headers:{'Content-Type':'application/json'},
//     // body:JSON.stringify(data)
// });
// const body=await response.text();
// const data=JSON.parse(body);
// const{signedIn,givenName}=data;
// this.setState({user:{signedIn,givenName}})
//     }


 componentDidMount()
{
    const clientId = window.ENV.GOOGLE_CLIENT_ID;
    if (!clientId) return;
       window.gapi.load('auth2', ()=>{
          // Retrieve the singleton for the GoogleAuth library and set up the client.
          if (!window.gapi.auth2.getAuthInstance()){
         window.auth2 = gapi.auth2.init({
            client_id:window.ENV.GOOGLE_CLIENT_ID,
            cookiepolicy: 'single_host_origin',
            // Request scopes in addition to 'profile' and 'email'
            //scope: 'additional_scope'
          })
          .then(()=>{this.setState(
              {
                  disabled:false
                });
            });
        } })
     
   // await this.loadData();
  
};
async signIn()
{
this.hideModal();
const { showError } = this.props;
var googleToken;
try {
const auth2 = window.gapi.auth2.getAuthInstance();
const googleUser = await auth2.signIn();
// const givenName = googleUser.getBasicProfile().getGivenName();
// this.setState({ user: { signedIn: true, givenName } });
googleToken = googleUser.getAuthResponse().id_token;
} catch (error) {
 showError(`Error authenticating with Google: ${error.error}`);
 }
try {
    const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
    const response = await fetch(`${apiEndpoint}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials:'include',
    body: JSON.stringify({ googleToken }),    
    });
    
    const body = await response.text();
    const result = JSON.parse(body);
    const { signedIn, givenName } = result;
    // this.setState({ user: { signedIn, givenName } });
    const { onUserChange } = this.props;
  
     onUserChange({ signedIn, givenName });
     } catch (error) {
     showError(`Error signing into the app: ${error}`);
    }
}

   
async signOut()
{
        const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
        const { showError } = this.props;
        try {
        await fetch(`${apiEndpoint}/signout`, {
        credentials: 'include',
        method: 'POST',
        });
        const auth2 = window.gapi.auth2.getAuthInstance();
        //to sign out from app with out signing out from the google account
        await auth2.signOut();
        const { onUserChange } = this.props;
        onUserChange({ signedIn: false, givenName: ' ' });
        } catch (error) {
        showError(`Error signing out: ${error}`);
        }
}

showModal()
{
    const clientId = window.ENV.GOOGLE_CLIENT_ID;
    const { showError } = this.props;
   if (!clientId) {
    showError('Missing environment variable GOOGLE_CLIENT_ID');
    return;
}
    this.setState({showing:true});

}
hideModal()
{
    this.setState({showing:false});
}

render()
{
    const{ user}=this.props;
    const{disabled,showing}=this.state;

    if(user.signedIn)
    {
        return(<NavDropdown id="user" title={user.givenName}>
            <MenuItem onClick={this.signOut}>
                SignOut
            </MenuItem>
        </NavDropdown>)
    }
    return(
        <>
        <NavItem onClick={this.showModal}>
            SignIn
        </NavItem>
         <Modal keyboard show={showing} bsSize="sm" onHide={this.hideModal}>
       <Modal.Header closeButton>
       <Modal.Title>Title</Modal.Title>
       </Modal.Header>
       <Modal.Body>
     <Button block bsStyle="primary" 
     disabled={disabled} onClick={this.signIn}>
       <img src="https://goo.gl/4yjp6B" alt="Sign In" />
        </Button>
       </Modal.Body>
       <Modal.Footer>
           <Button block bsStyle="link" onClick={this.hideModal}>Cancel</Button>
       </Modal.Footer>
         </Modal>
        </>
    )}}

export default withToast(SignInNavItem);