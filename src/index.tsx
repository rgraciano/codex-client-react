import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { CardList, CodexGame } from './App';
import * as serviceWorker from './serviceWorker';

let cardObjects = [ { cardId: 'first', cardName: 'imaninja' }, { cardId: 'second', cardName: 'numbatwo' }];

//ReactDOM.render(<Hand cardObjects={cardObjs} />, document.getElementById('root'));

//ReactDOM.render(<CardList listName="Hand" cardObjects={cardObjects} />, document.getElementById('root'));

ReactDOM.render(<CodexGame />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();