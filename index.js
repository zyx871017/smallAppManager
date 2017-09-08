import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Redirect} from 'react-router-dom';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Header from './src/components/common/Header';
import Login from './src/components/common/Login';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import smallApp from './src/reducers';

let store = createStore(
  smallApp,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render((
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <Provider store={store}>
      <HashRouter>
        <div>
          <Route path="/main" component={Header}/>
          <Route path="/login" component={Login}/>
        </div>
      </HashRouter>
    </Provider>
  </MuiThemeProvider>
), document.getElementById('app-root'));