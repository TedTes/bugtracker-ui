import React from 'react';
import {withRouter} from 'react-router-dom';
import SelectAsync from 'react-select/lib/Async'
import withToast from './withToast.js'
import graphQLFetch from './graphQLFetch'

class Search extends React.Component{
    constructor(props){
        super(props)
        this.loadOptions=this.loadOptions.bind(this);
        this.onChangeSelection=this.onChangeSelection.bind(this);
        
    }
    onChangeSelection({value})
    {
        console.log("heloooooooo")
        console.log(value)
        
        const{history}=this.props;
        history.push(
            `/edit/${value}`)
    }
    async loadOptions(term)
    {
        console.log("helooooooooooooooooooooooooooooo")
        console.log(term)
        if(term.length<3)return []
        const query=`query bugList($search:String){
            bugList(search:$search){
                bugs{id title}
            }
        }`;
        const {showError}=this.props;
        const data=await graphQLFetch(query,{search:term},showError)
      return data.bugList.bugs.map(bug=>({
          label:`#${bug.id}:${bug.title}`,value:bug.id
      }))

    }

    render()
    {
        return(
            <SelectAsync onChange={this.onChangeSelection} value='' 
            loadOptions={this.loadOptions} instanceId="search-select"
            components={{DropdownIndicator:null}}
            filterOption={()=>true}/>
        )
    }
}

export default withRouter(withToast(Search));