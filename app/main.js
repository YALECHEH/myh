import React,{Component} from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store.js';
import {Router, browserHistory,hashHistory,applyRouterMiddleware} from 'react-router'
import { useScroll } from 'react-router-scroll';
import rootRoute from './routes/route'
import  './styles/main.less'
import './common/styles/common.less'
import 'lib-flexible';
require('es6-promise').polyfill();

//解决移动端300毫秒延迟
var FastClick = require('fastclick');
FastClick.attach(document.body);

render(
    <Provider store={store}>
        <Router
            history={browserHistory}
            routes={rootRoute}
            render={applyRouterMiddleware(useScroll())}
        />
    </Provider>
    , document.getElementById('root'));
