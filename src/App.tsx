import React from 'react';
import './css/App.css';
import { CreateDepartment } from './components/CreateDepartment';
import { Objective } from './components/Objectives';
// import { ObrBoards } from './components/ObrBoards';
import { KeyResults } from './components/KeyResults';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ApplicationContextProvider } from './context/ApplicationContext';
import { CreateUser } from './components/CreateUser';

function App() {
    return (
        <ApplicationContextProvider>
            <Switch>
                <Route path={`/department`} name="createDepartment" exact={true} component={CreateDepartment} />
                <Route path={`/objective`} name="Objective" exact={true} component={Objective} />
                <Route path={`/user`} name="createUser" exact={true} component={CreateUser} />
                <Route path={`/keyresult`} name="createKeyResult" exact={true} component={KeyResults} />
                <Route path={`/objective`} name="okrBoard" exact={true} component={Objective} />
                <Redirect to={'/objective'} />
            </Switch>
        </ApplicationContextProvider>
    );
}

export default App;
