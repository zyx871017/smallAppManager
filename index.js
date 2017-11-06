import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Redirect} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './src/components/common/Header';
import Login from './src/components/common/Login';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import smallApp from './src/reducers';
import printMe from './print.js';

let store = createStore(
  smallApp,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render((
  <MuiThemeProvider>
    <Provider store={store}>
      <HashRouter>
        <div>
          <Route path="/" render={()=>(<Redirect to="/main/goodsList" />)}/>
          <Route path="/main" component={Header}/>
          <Route path="/login" component={Login}/>
        </div>
      </HashRouter>
    </Provider>
  </MuiThemeProvider>
), document.getElementById('app-root'));

if (module.hot) {
  module.hot.accept('./print.js', () => {
    printMe();
  });
}