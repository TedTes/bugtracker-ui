import React from 'react';
import {Link,withRouter,NavLink} from 'react-router-dom';
import {Button,Glyphicon,Tooltip,OverlayTrigger} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import UserContext from './UserContext';
class BugRowPlain extends React.Component{
       // const BugRow=withRouter(({issue,location:{search},closeBug,deleteBug,index})=>{
       // const selectedLocation={pathname:`/bugs/${issue.id}`,search}
       // const closeTooltip= (<Tooltip id="close-tooltip" placement="top" >Close Bug</Tooltip>) ;
       // const deleteTooltip=( <Tooltip id="close-tooltip" placement="top" >Delete Bug</Tooltip>) ;  
       // const editTooltip=(<Tooltip id="edit-tooltip" placement="top" >Edit Bug</Tooltip>);
      
      // const style=this.props.row_style;
      // const issue=props.issue;
     
     
   render ()
   {
       const{issue,location:{search},deleteBug,closeBug,index}=this.props
       const selectedLocation={pathname:`/bugs/${issue.id}`,search}
       const closeTooltip= (<Tooltip id="close-tooltip" placement="top" >Close Bug</Tooltip>) ;
       const deleteTooltip=( <Tooltip id="close-tooltip" placement="top" >Delete Bug</Tooltip>) ;  
       const editTooltip=(<Tooltip id="edit-tooltip" placement="top" >Edit Bug</Tooltip>);
       const user=this.context;
       const disabled=!user.signedIn;
       function onDelete(e)
       {
       e.preventDefault();
       deleteBug(index);
       }
     function onClose(e)
       {
       e.preventDefault();
       closeBug(index);
       }
       
       const tableRow=(<tr>
              <th >{issue.id}</th>
              <th >{issue.status}</th>
              <th >{issue.owner}</th>
              <th >{issue.effort}</th>
              <th >{issue.created.toDateString()}</th>
              <th >{issue.due?issue.due.toDateString():''}</th>
              <th >{issue.title}</th>
              <th>
                     {/* <Link to={`/edit/${issue.id}`}>Edit</Link> */}
              <LinkContainer to={`/edit/${issue.id}`}>
              <OverlayTrigger delayShow={1000} overlay={editTooltip}>
                     <Button bsSize="xsmall" >
                     <Glyphicon glyph="edit"/>
                     </Button>
              </OverlayTrigger>
              </LinkContainer>
              {/* <NavLink to={selectedLocation}>Select</NavLink> */}
              
              {/* {' | '} */}
              <OverlayTrigger delayShow={1000} overlay={closeTooltip}>
              <Button  bsSize="xsmall" onClick={onClose} disabled={disabled}>
                   <Glyphicon glyph="remove"/> 
              </Button>
              </OverlayTrigger>
              {'  '}
              <OverlayTrigger delayShow={1000} overlay={deleteTooltip}>
              <Button  bsSize="xsmall" onClick={onDelete} disabled={disabled}>
              <Glyphicon glyph="trash"/> 
              </Button>
              </OverlayTrigger>
              </th>
        </tr>
               )
               return(
                 <LinkContainer to={selectedLocation}>
                        {tableRow}
                 </LinkContainer>
               )
   };
   
}

BugRowPlain.contextType=UserContext;
const BugRow=withRouter(BugRowPlain)
delete BugRow.contextType;
export default BugRow;
// .toDateString()
// issue.due.toDateString()