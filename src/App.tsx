import React from 'react';
import './css/App.css';
import { Department } from './components/Department';
import { Objective } from './components/Objectives';
// import { ObrBoards } from './components/ObrBoards';
import { KeyResults } from './components/KeyResults';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ApplicationContextProvider } from './context/ApplicationContext';
import { Users } from './components/Users';

function App() {
    return (
        <ApplicationContextProvider>
            <Switch>
                <Route path={`/department`} name="Department" exact={true} component={Department} />
                <Route path={`/objective`} name="Objective" exact={true} component={Objective} />
                <Route path={`/user`} name="user" exact={true} component={Users} />
                <Route path={`/keyresult`} name="createKeyResult" exact={true} component={KeyResults} />
                <Route path={`/objective`} name="okrBoard" exact={true} component={Objective} />
                <Redirect to={'/objective'} />
            </Switch>
        </ApplicationContextProvider>
    );
}

export default App;
