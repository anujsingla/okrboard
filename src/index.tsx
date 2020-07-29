import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import './css/app.scss';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly-addons.css';
import 'noty/lib/noty.css';
import 'noty/lib/themes/bootstrap-v4.css';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { HashRouter, Route } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';

ReactDOM.render(
  <HashRouter>
    <AppLayout>
      <Route exact={false} path="/" component={App} />
    </AppLayout>
  </HashRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls. Learn
// more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
