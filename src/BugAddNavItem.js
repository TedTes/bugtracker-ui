import React from 'react'
import {withRouter} from 'react-router-dom';
import withToast from './withToast'
import {
    NavItem, Glyphicon, Modal, Form, FormGroup, FormControl, ControlLabel,
    Button, ButtonToolbar, Tooltip, OverlayTrigger,
    } from 'react-bootstrap';
import graphQLFetch from './graphQLFetch';
import Toast from './Toast';

 class BugAddNavItem extends React.Component{
constructor(props)
{
    super(props);
    this.state={
       showing:false,
    }
    this.showModal=this.showModal.bind(this);
    this.hideModal=this.hideModal.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);

}
showModal()
{
    this.setState({showing:true});
}
hideModal()
{
    this.setState({showing:false})
}
async handleSubmit(e)
{
    e.preventDefault();
    this.hideModal();
    const form=document.forms.bugAdd;
const bug={
    owner:form.owner.value,
    title:form.title.value,
    due:new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10)
};
const query=`mutation bugAdd($bug:IssueInputs!)
{
    bugAdd(bug:$bug)
    {
        id
    }
}`
const{showError}=this.props;
const data=await graphQLFetch(query,{bug},showError)
if(data)
{
    const{history}=this.props;
    history.push(`/edit/${data.bugAdd.id}`)
}
}

render()
{
    const{showing}=this.state;
    const { user: { signedIn } } = this.props;
   return( <React.Fragment>
      <NavItem disabled={!signedIn} onClick={this.showModal}>
          <OverlayTrigger delayShow={1000} placement="left" overlay={<Tooltip id="create-bug"
          >Create Bug</Tooltip>}>
              <Glyphicon glyph="plus"/>
          </OverlayTrigger></NavItem>

          <Modal keyboard show={showing} onHide={this.hideModal} >
             <Modal.Header closeButton>
                 <Modal.Title>Create Bug</Modal.Title>
             </Modal.Header>
             <Modal.Body>
                 <Form name="bugAdd">
                 {/* <FormGroup validationState={title.length < 3 ? 'error' : null}> */}
                     <FormGroup>
                     <ControlLabel>Title</ControlLabel>
                     <FormControl name="title" autoFocus/>
                     </FormGroup>
                     <FormGroup>
                         <ControlLabel>Owner:</ControlLabel>
                         <FormControl name="owner" />
                     </FormGroup>
             </Form>
             </Modal.Body>
             <Modal.Footer>
                 <ButtonToolbar>
                     <Button bsStyle="primary" type="button" onClick={this.handleSubmit}>Submit</Button>
                     <Button bsStyle="link" onClick={this.hideModal} >Cancel</Button>
                 </ButtonToolbar>
             </Modal.Footer>
         </Modal>
    </React.Fragment>
);
}}
export default withRouter(withToast(BugAddNavItem));