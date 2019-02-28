import React, { useState, useEffect, Component, FunctionComponent } from 'react';
import logo from './logo.svg';
import './App.css';

export class StringMap { [s: string]: string; }
export class ObjectMap { [s: string]: object; }

callServer('test').then(a => console.log(a));


async function callServer(actionName: string) {
    let resp = await fetch('http://localhost:8080/newgame');
    console.log(resp.type);
    return resp.json(); //await resp.json();
}

const Refresher: React.FunctionComponent<{ actionName: string }> = ({ actionName = 'newgame' }) => {
    const [data, updateData] = useState();

    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30551
    // https://github.com/facebook/react/issues/14326#issuecomment-441680293
    useEffect(() => {
        callServer(actionName).then(a => {console.log(a); return updateData(a)});
    }, [actionName]);

    return <> { JSON.stringify(data) } </>;
}

const Counter:FunctionComponent<{ initial?: number }> = ({ initial = 0 }) => {
    // since we pass a number here, clicks is going to be a number.
    // setClicks is a function that accepts either a number or a function returning
    // a number
    const [clicks, setClicks] = useState(initial);
    return <>
      <p>Clicks: {clicks}</p>
      <button onClick={() => setClicks(clicks+1)}>+</button>
      <button onClick={() => setClicks(clicks-1)}>+</button>
    </>
  }


class Card extends Component<{cardObject: StringMap}> {
    render() {
        return (
            <span className="Card" key={this.props.cardObject.cardId}>[{this.props.cardObject.name}]&nbsp;&nbsp;</span>
        );
    }
}

class Patroller extends Component<{patrollerSlot:string, cardObject: StringMap}> {
    render() {
        return (
            <div>
                <h3>{this.props.patrollerSlot}: <Card cardObject={this.props.cardObject} /></h3>
            </div>
        )
    }
}

export class CardList extends Component<{listName: string, cardObjects: StringMap[]}> {

    cards(cardObjects: StringMap[]) {
        return cardObjects.map(cardObj => <Card cardObject={cardObj}></Card>);
    }

    render() {
        return (
           <div>{this.props.listName}: { this.cards(this.props.cardObjects) }</div>
        );
    }
}

export const CodexGame:FunctionComponent = () => {
    //const refresher = Refresher({ actionName: 'newgame' });
 
    return(
        <div>
            <div>
                <h1>Opponent Board</h1>
                <h2>Patrollers</h2>
                <h3>Squad Leader: </h3>
                <Refresher actionName='newgame' />
            </div>
        </div>
    )
}

export default CardList;
