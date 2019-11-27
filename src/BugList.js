import React from 'react';
import BugFilter  from './BugFilter';
import BugTable from './BugTable';
//import AddBug from './AddBug';
import graphQLFetch from './graphQLFetch.js';
import URLSearchParams from 'url-search-params';
import {Route} from 'react-router-dom';
import BugDetail from './BugDetail'
import withToast from './withToast';
import {Panel,Pagination,Button} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';


const PAGE_SECTION=5;
function PageLink({params,page,activePage,children})
{
  params.set('page',page)
  if(page===0) return React.cloneElement(children,{disabled:true})
  return(
    <LinkContainer isActive={()=>page===activePage} to={{search: `?${params.toString()}`}}>
      {children}
    </LinkContainer>
  )
}
 class BugList extends React.Component
{
    constructor()
        {
        super();
        this.state={
            bugs:[],
            pages:null
        };
        //this.createBug=this.createBug.bind(this);
        this.closeBug=this.closeBug.bind(this);
        this.deleteBug=this.deleteBug.bind(this);
       
        }
      
      
        async closeBug(index)
        {
          const query=`mutation bugClose($id:Int!)
          {
            bugUpdate(id:$id,changes:{status:Closed})
            {
              id title status owner
        effort created due description
            }
          }`;
          const{bugs}=this.state;
          const{showError}=this.props
          const data=await graphQLFetch(query,{id:bugs[index].id},showError)
          if(data)
          {
            this.setState(prevState=>{
              const newList=[...prevState.bugs];
              newList[index]=data.bugUpdate;
              return {bugs:newList};
            })
         }
         else{this.loadData();}
        }

       async deleteBug(index)
       {
         const query=`mutation bugDelete($id:Int!){
           bugDelete(id:$id)
         }`
         const{bugs}=this.state;
         const{id}=bugs[index];
         const{location:{pathname,search},history}=this.props
         const{showError,showSuccess}=this.props
         const data=await graphQLFetch(query,{id},showError)
         if(data&&data.bugDelete)
         {
           this.setState(prevState=>{
             const newList=[...prevState.bugs];
             if(pathname===`/bugs/${id}`)
             history.push ({pathname:'/bugs',search})
            newList.splice(index,1);
             return {bug:newList}
           });
           this.loadData();
           const undoMessage=(<span>{`Deleted bug ${id} Successfully`}
           <Button bsStyle="link" onClick={()=>this.restoreBug(id)}>UNDO</Button></span>)
           showSuccess(undoMessage); 
        

         }
         else{this.loadData();}
       }
       async restoreBug(id)
       {
         const query=`mutation bugRestore($id:Int!){
           bugRestore(id:$id)
         }`
const {showError,showSuccess}=this.props
         const data=await graphQLFetch(query,{id},showError)
         if(data)
         {
          showSuccess(`id ${id} restored successfully`)
          this.loadData();
         }
        
       }
        componentDidMount()
        {
          this.loadData();
        }
        componentDidUpdate(prevProps)
        {
          const {location:{search:prevSearch}}=prevProps;
          const {location:{search}}=this.props;
          if(prevSearch!==search)
          { this.loadData();}
         
         }
       async loadData()
        {
          const vars={};
            const{location:{search},showError}=this.props;
            const params=new URLSearchParams(search);
            let page=parseInt(params.get('page'),10);
            if(Number.isNaN(page)) page=1
            vars.page=page;
          if(params.get('status'))vars.status=params.get('status');

          const effortMin=parseInt(params.get('effortMin'),10);
          if(!Number.isNaN(effortMin))vars.effortMin=effortMin;
          const effortMax=parseInt(params.get('effortMax'),10);
          if(!Number.isNaN(effortMax)) vars.effortMax=effortMax;
         
        const query=`query bugList($status:StatusType $effortMin:Int $effortMax:Int $page:Int) {
            bugList(status:$status effortMin:$effortMin effortMax:$effortMax page:$page){
              bugs{
                id title status owner
                created effort due
              }
              pages
             } 
        }`
      
        const data=await graphQLFetch(query,vars,showError);
        if(data){
           this.setState({
             bugs:data.bugList.bugs,
             pages:data.bugList.pages
           });
        }
      
   }
    render()
    {
     const{pages}=this.state;
      const {match,location:{search}}=this.props;
     const hasFilter=location.search!=='';
   const params=new URLSearchParams(search);
   let page=parseInt(params.get('page'),10);
   if(Number.isNaN(page))page=1;

   const startPage=Math.floor((page-1)/PAGE_SECTION)*PAGE_SECTION+1;
   const endPage=startPage+PAGE_SECTION-1;
   const prevSection=startPage===1?0:startPage-PAGE_SECTION;
   const nextSection=endPage>=pages?0:startPage+PAGE_SECTION;

  const items=[];
  for(let i=startPage;i<=Math.min(endPage,pages);i++)
  {
     params.set('page',i);
   items.push((
    <PageLink key={i} params={params}  activePage={page} page={i}>
    <Pagination.Item>{i}</Pagination.Item>
  </PageLink>
   ) )
  }
    return(<React.Fragment>
    <Panel defaultExpanded={hasFilter}>
      <Panel.Heading>
     <Panel.Title toggle>Filter</Panel.Title>
    </Panel.Heading>
   <Panel.Body collapsible>
   <BugFilter baseURL='/bugs'/>
   </Panel.Body>
 </Panel>
   <hr/>
        <BugTable issues={this.state.bugs} closeBug={this.closeBug} deleteBug={this.deleteBug}/>
        <hr/>
        {/* <AddBug createBug={this.createBug}/> */}
        <hr/>
        <Route path={`${match.path}/:id`} component={BugDetail}/>
       <Pagination>
         <PageLink params={params} page={prevSection}>
           <Pagination.Item>{'<'}</Pagination.Item>
         </PageLink>
         {items}
         <PageLink params={params} page={nextSection}>
           <Pagination.Item>{'>'}</Pagination.Item>
         </PageLink>
       </Pagination>
        </React.Fragment>
        );
    }
}
export default withToast(BugList);