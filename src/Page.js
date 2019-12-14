import Contents from './Contents';
import React from 'react';
//import {NavLink} from 'react-router-dom';
import { Navbar, Nav, NavItem, NavDropdown,Col,
       MenuItem, Glyphicon, Tooltip, OverlayTrigger,Grid} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import BugAddNavItem from './BugAddNavItem';
import Search from './Search.js'
import SignInNavItem from './SignInNavItem';
import UserContext from './UserContext';
import Home from './Home.js'

 function NavBar({user,onUserChange})
{
   return(<Navbar>
        <Navbar.Header>
            <Navbar.Brand><b>BugTracker</b></Navbar.Brand>
         </Navbar.Header>
        <Nav>
           <LinkContainer exact to='/'><NavItem>Home</NavItem></LinkContainer>
          <LinkContainer to='/bugs'><NavItem>BugList</NavItem></LinkContainer>
          <LinkContainer to='/report'><NavItem>Report</NavItem></LinkContainer>
        </Nav>
        <Col sm={5}>
            <Navbar.Form>
            <Search/>
            </Navbar.Form>
        </Col>
        <Nav pullRight>
            {/* <NavItem>
            <OverlayTrigger 
            placement="left" 
            delayShow={1000} overlay={<Tooltip id="creact-bug">Create Bug</Tooltip>}>
            <Glyphicon glyph="plus"/>
            </OverlayTrigger>
            </NavItem> */}
            <BugAddNavItem user={user}/>
            <SignInNavItem user={user} onUserChange={onUserChange}/>
            <NavDropdown id="user-dropdown" title={<Glyphicon glyph="option-vertical"/>} 
            noCaret>
                <LinkContainer to='/about'>
                <MenuItem>About</MenuItem>
                </LinkContainer>
               </NavDropdown>
           
        </Nav>
    </Navbar>
//    <nav>
//        <NavLink exact to='/' >Home</NavLink>
//    {' | '}
//    <NavLink to='/bugs'>Bug List</NavLink>
//    {' | '}
//    <NavLink to='/report'>Report</NavLink>
//    </nav>
   ); 

}

function Footer()
{
    return(<small> <hr/><p>Full source code availabe at this{" "} 
    <a href="github.com">GitHub repository</a></p></small>)
}

export default class Page extends React.Component
{
    constructor(props)
    {
        super(props)
        {
            this.state={
               user:{signedIn:false}
            }
        }

        this.onUserChange=this.onUserChange.bind(this);
    }


    async componentDidMount()
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
          }).then(()=>{this.setState(
              {
                  disabled:false
                });
            });
        } 
    })
     const endPoint= window.ENV.UI_AUTH_ENDPOINT;
const response=await fetch(`${endPoint}/user`,{
    method:'POST',
    credentials:'include'
})
   // await this.loadData();
  
};

    onUserChange(user)
    {
        this.setState(
          {user}
        )
    }

    render(){
        const{user}=this.state;
        return(<div>
            <NavBar user={user} onUserChange={this.onUserChange}/>
                <Grid fluid>
                    <UserContext.Provider value={user}>
                    <Contents/>
                    </UserContext.Provider>
                </Grid>
             <Footer/>
            </div>)
    }
   
}
