import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { CodexGame } from './CodexGame';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, RouteComponentProps, Link } from 'react-router-dom';
import { Welcome } from './Welcome';

function setupRoutes() {
    return (
        <Router>
            <Route path="/" exact component={Welcome} />
            <Route path="/newgame/:spec1/:spec2" exact component={CodexGame} />
            <Route path="/continue/:gameStateId" component={CodexGame} />
        </Router>
    );
}

ReactDOM.render(setupRoutes(), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
