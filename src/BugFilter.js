/* eslint "react/prefer-stateless-function": "off" */

import React from 'react';
//import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import URLSearchParams from 'url-search-params';
import {ButtonToolbar, Button, FormGroup, FormControl, ControlLabel, InputGroup,Row,Col } from 'react-bootstrap';

 class BugFilter extends React.Component
{
    constructor({location:{search}})
    {
        super();
        const params=new URLSearchParams(search);
        this.state={
            status:params.get('status')||'',
            effortMin:params.get('effortMin')||'',
            effortMax:params.get('efforMax')||'',
            changed:false
        }
        this.onStatusChange=this.onStatusChange.bind(this);
        this.applyFilter=this.applyFilter.bind(this)
        this.showOriginalFilter=this.showOriginalFilter.bind(this);
        this.onChangeEffortMin=this.onChangeEffortMin.bind(this);
        this.onChangeEffortMax=this.onChangeEffortMax.bind(this);
    }
    componentDidUpdate(prevProps){
   const{location:{search:prevSearch}}=prevProps;
   const{location:{search}}=this.props;
   if(search!==prevSearch)
   this.showOriginalFilter();

    }
    showOriginalFilter(){
        const{location:{search}}=this.props
        const params=new URLSearchParams(search);
        this.setState({status:params.get('status')||'',
            effortMin:params.get('effortMin')||'',
            effortMax:params.get('effortMax')||'',
            changed:false});
    }

     onStatusChange(e)
    {
        this.setState({status:e.target.value,changed:true})
   
    }
    applyFilter(e)
    {
          const {status,effortMin,effortMax}=this.state;

          const params=new URLSearchParams();
          if(status)params.set("status",status);
          if(effortMax)params.set("effortMax",effortMax);
          if(effortMin)params.set("effortMin",effortMin);

          const{history,baseURL}=this.props;
         history.push({
          pathname:baseURL,
          search: params.toString()? `?${params.toString()}`:''
      });
    }
    onChangeEffortMin(e)
    {
        const effortMin=e.target.value;
        if(effortMin.match(/^\d*$/))
           this.setState({effortMin:e.target.value,changed:true});
    }
    onChangeEffortMax(e)
    {
        const effortMax=e.target.value;
        if(effortMax.match(/^\d*$/))
           this.setState({effortMax:e.target.value,changed:true});
    }
    render()
    {
       const {status,changed,effortMin,effortMax}=this.state;
        
        return(<Row>
            <Col xs={6} sm={4} md={3} lg={2}>
            <FormGroup>
            <ControlLabel>Status:</ControlLabel>
            <FormControl componentClass="select" value={status} onChange={this.onStatusChange}>
            <option value="">(All)</option>
                <option value='New'>New</option>
                <option value="Assigned">Assigned</option>
                <option value="Fixed">Fixed</option>
                <option value="Closed">Closed</option>
            </FormControl>
            </FormGroup>
            </Col>
            <Col xs={6} sm={4} md={3} lg={2}>
            <FormGroup>
                <ControlLabel>Effort Between:</ControlLabel>
                <InputGroup>
                <FormControl value={effortMin} onChange={this.onChangeEffortMin}/>
                <InputGroup.Addon>-</InputGroup.Addon>
                <FormControl value={effortMax} onChange={this.onChangeEffortMax}/>
                </InputGroup>
            </FormGroup>
            </Col>
            <Col xs={6} sm={4} md={3} lg={2}>
                <FormGroup>
                    <ControlLabel>&nbsp;</ControlLabel>
                    <ButtonToolbar>
                 <Button bsStyle="primary"  onClick={this.applyFilter}>Apply</Button>
                <Button  onClick={this.showOriginalFilter} disabled={!changed}>Reset</Button>
                 </ButtonToolbar>
                </FormGroup>
            
            </Col>
         </Row>
        
           
        //     {/* <Link to='/bugs'>All Bugs</Link>
        //     {' | '}
        //     <Link to={{pathname:'/bugs',search: '?status=New'}}>New Bugs</Link>
        //     {' | '}
        //     <Link to={{pathname:'/bugs',search:'?status=Assigned'}}>Assigned Bugs</Link> */}
            
        // </div>
        );}
}
export default withRouter(BugFilter)