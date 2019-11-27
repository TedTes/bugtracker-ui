import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import {HashRouter as Router} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Page from './Page.js';
if(module.hot)
{
    module.hot.accept();
}


const element=(<Router><Page/></Router>)
ReactDOM.render(element, document.getElementById('root'));



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
