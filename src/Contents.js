import React from 'react';
import {Switch,Route,Redirect} from 'react-router-dom';
import BugList from './BugList';
import BugReport from './BugReport';
import BugEdit from './BugEdit';
import About from './About'

const NotFound=()=>(<div>Not Found</div>)
export default function Contents()
{
      return(<Switch>
    <Redirect exact from='/' to='/bugs'/>
    <Route path='/bugs' component={BugList}/>
    <Route path='/report' component={BugReport}/>
    <Route path='/edit/:id' component={BugEdit}/>
    <Route path='/about'    component={About}/>
    <Route component={NotFound}/>
      </Switch>)
      }
  
