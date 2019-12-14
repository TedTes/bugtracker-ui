require('dotenv').config();
const path=require('path');
const proxy=require('http-proxy-middleware')
const express=require('express');
const app=express();

const enableHMR=(process.env.ENABLE_HMR||true)===true;

if(enableHMR&&process.env.NODE_ENV!=='production')
{
    console.log('Adding dev middleware, enabling HMR');
/* eslint "global-require": "off" */
/* eslint "import/no-extraneous-dependencies": "off" */
const webpack=require('webpack');
const devMiddleware=require('webpack-dev-middleware');
const hotMiddleware=require('webpack-hot-middleware');

const config=require('./webpack.config.js');
config.entry.app.push('webpack-hot-middleware/client');
config.plugins=config.plugins||[];
config.plugins.push(new webpack.HotModuleReplacementPlugin());

const compiler=webpack(config);
app.use(devMiddleware(compiler));
app.use(hotMiddleware(compiler))
}
// app.get("*",(req,res)=>{
//     res.sendFile(path.resolve('public/index.html'))
// })

const UI_API_ENDPOINT=process.env.UI_API_ENDPOINT||'graphql';
const env={UI_API_ENDPOINT};
const port=process.env.PORT||5000;
app.use(express.static('public'));
const apiProxyTarget = process.env.API_PROXY_TARGET;
console.log( process.env.API_PROXY_TARGET)
if (apiProxyTarget) {
app.use('/graphql', proxy({target: apiProxyTarget,changeOrigin:false}));
app.use('/auth',proxy({target:apiProxyTarget,changeOrigin:false}));
}
app.get('/env.js',(req,res)=>
{
    const env = {
        UI_API_ENDPOINT: process.env.UI_API_ENDPOINT,
        UI_AUTH_ENDPOINT: process.env.UI_AUTH_ENDPOINT,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        };
res.send(`window.ENV=${JSON.stringify(env)}`);
})

if (!process.env.UI_AUTH_ENDPOINT) {
    process.env.UI_AUTH_ENDPOINT = 'http://localhost:4000/auth';
    }

app.listen(port,()=>{
    console.log(`server running port:${port}`)
})