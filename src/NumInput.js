import React from 'react';

function format(num)
{
return num!=null?num.toString():'';
}

function unFormat(str)
{
 const val=parseInt(str,10);
 return Number.isNaN(val)?null:val;
}
export default class NumInput extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            value:format(props.value)?format(props.value):''
        }
       
        this.onChange=this.onChange.bind(this);
        this.onBlur=this.onBlur.bind(this);
    }
    onChange(e)
    {
        if(e.target.value.match(/^\d*$/))
  this.setState({value:e.target.value})
  
    }
    onBlur(e)
    {
      const{onChange}=this.props;
      const{value}=this.state;
      onChange(e,unFormat(value));
      
    }
render(){
    const{value}=this.state;
    console.log("from state")
    console.log({...this.state})
    console.log("from props")
    console.log({...this.props})
    return(<input type="text" {...this.props} value={value}  onBlur={this.onBlur} onChange={this.onChange}/> )
}
}