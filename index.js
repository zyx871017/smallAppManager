import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from './src/common/Header';

ReactDOM.render((
    <BrowserRouter>
        <Route path="/header" component={Header}/>
    </BrowserRouter>
), document.getElementById('app-root'));