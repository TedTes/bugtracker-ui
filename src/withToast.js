import React from 'react';
import Toast from './Toast';

export default function withToast(OriginalComponent)
{
    return(
        class WrapperToast extends React.Component{
            constructor(props)
            {
                super(props);
                this.state={
                    toastMessage:'',
                    toastType:'success',
                    toastVisible:false

                }
              this.showError=this.showError.bind(this);
             this.showSuccess=this.showSuccess.bind(this);
             this.toastDismiss=this.toastDismiss.bind(this);
    }
                showError(message)
                {
                    this.setState({toastMessage:message,toastType:'danger',toastVisible:true})
                }
                toastDismiss()
                {
                    this.setState({toastVisible:false})
                }
                showSuccess(message)
                {
                    this.setState({toastVisible:true,toastMessage:message,toastType:'success'})
                }
                render()
                {
                    const{toastMessage,toastType,toastVisible}=this.state;
                    return(
                        <React.Fragment>
                         <OriginalComponent showSuccess={this.showSuccess} 
                         showError={this.showError} 
                         toastDismiss={this.toastDismiss}   {...this.props}/>
                        
                        <Toast showing={toastVisible} onDismiss={this.toastDismiss} bsType={toastType}>
                           {toastMessage}
                        </Toast>
                        </React.Fragment>
                        
                    )
                }
            
        }
    )
}
