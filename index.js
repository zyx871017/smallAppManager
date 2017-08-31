import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './src/components/common/Header';
import Login from './src/components/common/Login';
import GoodsList from './src/components/goodsList/GoodsList';
import Category from './src/components/category/Category';

ReactDOM.render((
    <MuiThemeProvider>
        <HashRouter>
            <div>
                <Route path="/main" component={Header}/>
                <Route path="/main/goodsList" component={GoodsList}/>
                <Route path="/main/category" component={Category}/>
                <Route path="/login" component={Login}/>
            </div>
        </HashRouter>
    </MuiThemeProvider>
), document.getElementById('app-root'));