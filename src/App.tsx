import React, { useState, useEffect, Component, FunctionComponent } from 'react';
import './App.css';

export class StringMap { [s: string]: string; }
export class ObjectMap { [s: string]: object; }

async function callServer(actionName: string) {
    let resp = await fetch('http://localhost:8080/newgame');
    return resp.json();
}

class Card extends Component<{cardObject: StringMap}> {
    render() {
        return (
            <span className="Card" key={this.props.cardObject.cardId} id={this.props.cardObject.cardId}>[{this.props.cardObject.name}]&nbsp;&nbsp;</span>
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

export const CodexGame: React.FunctionComponent<{ actionName: string }> = ({ actionName }) => {
    const [data, updateData] = useState();
    const [playerBoard, updatePlayerBoard] = useState();
    const [opponentBoard, updateOpponentBoard] = useState();
    const [stateId, updateStateId] = useState();

    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30551
    // https://github.com/facebook/react/issues/14326#issuecomment-441680293
    useEffect(() => {
        callServer(actionName).then(gameState => {
            updateData(gameState);

            if (gameState.activePlayer == 1) {
                updatePlayerBoard(gameState.player1Board);
                updateOpponentBoard(gameState.player2Board);
            }
            else {
                updatePlayerBoard(gameState.player2Board);
                updateOpponentBoard(gameState.player1Board);
            }

            updateStateId(gameState.state);
        }
        );
    }, [actionName]);

    if (!data || !playerBoard || !opponentBoard)
        return <> <h1>Loading...</h1> </>

    return <> {
        <div>
            <div>
                <h1>Opponent Board</h1>
                <h3>Squad Leader: </h3>
                <h3><CardList listName="In Play" cardObjects={opponentBoard.inPlay} /></h3>
                <h1>Your Board</h1>
                <h3><CardList listName="Hand" cardObjects={playerBoard.hand} /></h3>
                <h3><CardList listName="In Play" cardObjects={playerBoard.inPlay} /></h3>
             </div>
        </div>   
    } </>;
}


export default CodexGame;
