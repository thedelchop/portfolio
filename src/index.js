/* eslint-disable global-require */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import AppContainer from 'react-hot-loader/lib/AppContainer';
import App from './components/App';
import configureStore from './configureStore';

const history = createHistory();
const { store } = configureStore(history, window.REDUX_STATE);

const render = (AppComponent) => {
  const root = document.getElementById('root');

  ReactDOM.hydrate(
    <AppContainer>
      <Provider store={store}>
        <AppComponent />
      </Provider>
    </AppContainer>,
    root,
  );
};

render(App);

if (module.hot && process.env.NODE_ENV === 'development') {
  module.hot.accept('./components/App', () => {
    render(require('./components/App').default);
  });
}
