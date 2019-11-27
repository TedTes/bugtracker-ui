import React from 'react';
import graphQLFetch from './graphQLFetch';
import {Link} from 'react-router-dom';
import NumInput from './NumInput';
import InputDate from './InputDate';
import TextInput from './TextInput';
import withToast from './withToast';
import {Col, Panel, Form, FormGroup, FormControl, ControlLabel,Alert,
    ButtonToolbar, Button,} from 'react-bootstrap';
 import { LinkContainer } from 'react-router-bootstrap';
import UserContext from './UserContext'
 class BugEdit extends React.Component{

    constructor()
    {
        super();
        this.state={
            bug:{},
            invalidFields:{},
            showingValidation:false,
        }
        this.handleSubmit=this.handleSubmit.bind(this);
        this.onChangeData=this.onChangeData.bind(this);
        this.onValidityChange=this.onValidityChange.bind(this);
        this.dismissValidation=this.dismissValidation.bind(this);
        this.showValidation=this.showValidation.bind(this);
       
    }
    onValidityChange(e,valid)
    {
        const{name}=e.target;
        this.setState((prevState)=>{
            const invalidFields = { ...prevState.invalidFields, [name]: !valid };
        if (valid) delete invalidFields[name];
        return { invalidFields };});
    }
    componentDidMount()
    {
        this.loadData();
    }
    componentDidUpdate(prevProps){
        const{match:{params:{id:prevId}}}=prevProps;
        const{match:{params:{id}}}=this.props;
        if(id!==prevId)
        this.loadData();
    }
    dismissValidation()
    {
     this.setState({showingValidation:false})
    }
    showValidation()
    {
        this.setState({showingValidation:true})
    }
    
    async loadData()
    {
        const {match:{params:{id}},showError}=this.props
        const query=`query bug($id:Int!)
        {
          bug(id:$id)
          {
            id title status owner  title effort created due description
          }
        }`

        const data=await graphQLFetch(query,{id:Number(id)},showError);
       
        if(data)
        {
            // const { bug } = data;
            // //bug.due = bug.due ? bug.due.toDateString() : '';
            // bug.owner = bug.owner != null ? bug.owner : '';
            // bug.description = bug.description != null ? bug.description : '';
            // this.setState({ bug,invalidField:{} });
            // } else {
            this.setState({bug:data?data.bug: {} ,invalidFields:{}});
            }
    }
   async handleSubmit(e)
    {
   e.preventDefault();
   this.showValidation();
   const{bug,invalidFields}=this.state;
   if(Object.keys(invalidFields).length!==0)return;
   const query=`mutation bugUpdate($id:Int!,$changes:BugUpdateInputs!){
       bugUpdate(id:$id,changes:$changes)
       {
        id title status owner
        effort created due description
       }
   }`
const{id,created,...changes}=bug
const{showError,showSuccess}=this.props;
   const data=await graphQLFetch(query,{changes,id},showError)
     if(data){
        this.setState({bug:data.bugUpdate})
        //alert("bug Successfully update")
        showSuccess("Updated bug Successfully");
     }
    
   }
   
    onChangeData(e,numValue)
    {
        const{name,value:textValue}=e.target;
     const value=(numValue===undefined)?textValue:numValue;
     this.setState(prevState=>({
       bug: {...prevState.bug,[name]:value}  
     }
     ));
   // this.setState({bug:{...this.state,[name]:value}})
    }
   

    render()        
    {
         const user=this.context;
        const disabled=!user.signedIn;
        const{invalidFields,showingValidation}=this.state;
        const { bug: { id } } = this.state;
        const { match: { params: { id: propsId } } } = this.props;
        if (id == null) {
        if (propsId != null) {
        return <h3>{`Issue with ID ${propsId} not found.`}</h3>;
        }
        return null;
        }
        const { bug: { title, status } } = this.state;
        const {  bug: { owner, effort, description } } = this.state;
       const {  bug: { created, due } } = this.state;
       let validationMessage;
       if (Object.keys(invalidFields).length !== 0 && showingValidation) {
        validationMessage = (
        <Alert bsStyle="danger" onDismiss={this.dismissValidation}>
        Please correct invalid fields before submitting.
        </Alert>
        );
        }
       return (
        
        <Panel>
            <Panel.Heading><Panel.Title>
            {`Editing bug: ${id}`}
            </Panel.Title></Panel.Heading>
      <Panel.Body>
    <Form horizontal onSubmit={this.handleSubmit}>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={3}>Created:</Col>
          <Col sm={9}>
          <FormControl.Static>
         {created.toDateString()}
         </FormControl.Static>
          </Col>
         </FormGroup> 
      <FormGroup>
      <Col componentClass={ControlLabel} sm={3}>Status:</Col>
      <Col sm={9}>
          <FormControl componentClass="select" name="status" value={status} onChange={this.onChangeData}>
          <option value="New">New</option>
          <option value="Assigned">Assigned</option>
          <option value="Fixed">Fixed</option>
          <option value="Closed">Closed</option>
          </FormControl>
      </Col>
      </FormGroup>
      <FormGroup>
<Col componentClass={ControlLabel} sm={3}>Owner:</Col>
<Col sm={9}>
<FormControl componentClass={TextInput} 
name="owner" value={owner} 
onChange={this.onChangeData} key={id}/>
</Col>
</FormGroup>
<FormGroup>
    <Col componentClass={ControlLabel} sm={3}>Effort:</Col>
    <Col sm={9}>
        <FormControl componentClass={NumInput}  name="effort" value={effort} onChange={this.onChangeData} key={id}/>
        </Col>
 </FormGroup>
<FormGroup validationState={invalidFields.due?'error':null}>
    <Col componentClass={ControlLabel} sm={3}>Due:</Col>
    <Col sm={9}>
        <FormControl 
        componentClass={InputDate} 
        name="due" value={due} 
        onChange={this.onChangeData} 
        onValidityChange={this.onValidityChange} 
        key={id}/>
        <FormControl.Feedback/>
    </Col>
</FormGroup>
<FormGroup>
    <Col componentClass={ControlLabel} sm={3}>Title:</Col>
    <Col sm={9}>
        <FormControl componentClass={TextInput} size={50} name="title" value={title} onChange={this.onChangeData} key={id}/>
    </Col>
</FormGroup>
<FormGroup>
    <Col componentClass={ControlLabel} sm={3} >
    Description:
    </Col>
    <Col sm={9}>
        <FormControl componentClass={TextInput}
         tag="textarea" rows={4} cols={50} 
         name="description" 
         value={description} 
         onChange={this.onChangeData} key={id}/>
    </Col>
</FormGroup>
<FormGroup>
    <Col smOffset={3} sm={6}>
    <ButtonToolbar>
   <Button disabled={disabled} bsStyle="primary" type="submit" >Submit</Button>
   <LinkContainer to='/bugs'>
   <Button bsStyle="link">Back</Button>
   </LinkContainer>
   </ButtonToolbar>
    </Col>
</FormGroup>
<FormGroup>
    <Col smOffset={3} sm={9}>{validationMessage}</Col>
</FormGroup>
</Form>

</Panel.Body>
<Panel.Footer>
<Link to={`/edit/${id - 1}`}>Prev</Link>
{' | '}
<Link to={`/edit/${id +1}`}>Next</Link> 
</Panel.Footer>
 </Panel>
       
);

 }
}

BugEdit.contextType=UserContext;
export default withToast(BugEdit);