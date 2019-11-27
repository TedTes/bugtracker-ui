import React from 'react';
import BugRow from './BugRow';
import {Table} from 'react-bootstrap'

export default function BugTable({issues,closeBug,deleteBug})
{
       
        // const rowStyle={border:"1px solid silver", padding:4};
        const issueRows=issues.map((issue,index)=> <BugRow closeBug={closeBug} deleteBug={deleteBug} index={index} key={issue.id} issue={issue} />)
        return(
            <Table bordered condensed hover responsive> 
        <thead>
            <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Effort</th>
            <th>Created</th>
            <th>Due Date</th>
            <th >Title</th>
           <th>Action</th>
            </tr>
        </thead>
        <tbody>
             {issueRows}
       </tbody>
        </Table>
       
      
        )
    }


