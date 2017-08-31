import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './src/components/common/Header';

ReactDOM.render((
    <MuiThemeProvider>
        <BrowserRouter>
            <Route path="/" component={Header}/>
        </BrowserRouter>
    </MuiThemeProvider>
), document.getElementById('app-root'));