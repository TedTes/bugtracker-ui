import React from 'react';
import PropTypes from 'prop-types';
import {FormControl,FormGroup,ControlLabel,Button,Form} from 'react-bootstrap';

export default class AddBug extends React.Component
{
    constructor()
    {
        super();
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    handleSubmit(e)
    {
        e.preventDefault();
        const form=document.forms.bugAdd;
        const bugs = {
            owner: form.owner.value, 
            title: form.title.value, 
            status: 'New',
            due: new Date(new Date().getTime() + 1000*60*60*24*10),
            }
       const {createBug}= this.props;
       createBug(bugs);
        form.owner.value="";
        form.title.value="";
    }
    render()
    {
return(<Form inline name="bugAdd" onSubmit={this.handleSubmit}>
    <FormGroup>
        <ControlLabel>Owner: </ControlLabel>
        {' '}
        <FormControl type="text" name="owner" />
        {' '}
    </FormGroup>
    <FormGroup>
        <ControlLabel>Title:</ControlLabel>
        {' '}
        <FormControl type="text"  name="title"/>
    </FormGroup>
    <Button bsStyle="primary" type="submit">Add </Button>
    </Form>)
    }
}

AddBug.propTypes={
  createBug:PropTypes.func.isRequired,

};
// const sampleIssue=
//        {
//         status: 'New',
//         owner: 'Tedros', 
//         title: 'completion date should be optional',
//         }