import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Redirect} from 'react-router-dom';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Header from './src/components/common/Header';
import Login from './src/components/common/Login';
import GoodsList from './src/components/goodsList/GoodsList';
import Category from './src/components/category/Category';

ReactDOM.render((
    <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
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