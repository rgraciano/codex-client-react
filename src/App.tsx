import React, { useState, useEffect, Component, FunctionComponent } from 'react';
import './App.css';

export class StringMap { [s: string]: string; }
//export class ObjectMap { [s: string]: object; }

async function callServer(payload: StringMap) {
    let resp: Response;

    if (payload.actionName == 'NewGame')
        resp = await fetch('http://localhost:8080/newgame');
    else
        resp = await fetch('http://localhost:8080/action', { 
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            }
        });

    return resp.json();
}

export const Card: React.FunctionComponent<{ updater: Updater, listName: string, cardObject: StringMap }> 
                                            = ({ updater, listName, cardObject }) => {

    function playCard(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();

        let payload: StringMap = {};
        payload.actionName = 'PlayCard';
        payload.cardId = cardObject.cardId;

        updater(payload);
    }

    return (
        <a href="#" className="Card" onClick={playCard} key={cardObject.cardId} id={cardObject.cardId}>[{cardObject.name}]&nbsp;&nbsp;</a>
    );
}


export const Patroller: React.FunctionComponent<{ patrollerSlot: string, updater: Updater, cardObject: StringMap }> 
                                            = ({ patrollerSlot, updater, cardObject }) => {
    return (
        <div>
            <h3>{patrollerSlot}: <Card updater={updater} listName={"Patrollers"} cardObject={cardObject} /></h3>
        </div>
    );
}

export const CardList: React.FunctionComponent<{ updater: Updater, listName: string, cardObjects: StringMap[] }> 
                                            = ({ updater, listName, cardObjects }) => {

    function cards(cardObjects: StringMap[]) {
        return cardObjects.map(cardObj => <Card updater={updater} listName={listName} cardObject={cardObj}></Card>);
    }

    return (
        <div>{listName}: { cards(cardObjects) }</div>
    );
}

export const CodexGame: React.FunctionComponent<{ payload: StringMap }> = ({ payload }) => {
    const [gameState, updateGameState] = useState();
    const [playerBoard, updatePlayerBoard] = useState();
    const [opponentBoard, updateOpponentBoard] = useState();

    useEffect(() => {
        handleUpdate(payload);
    }, [ payload ]);

    function handleUpdate(payload: StringMap) {
        payload.gameStateId = gameState ? gameState.gameStateId : '';

        callServer(payload).then(gameState => {
            updateGameState(gameState);

            if (gameState.activePlayer == 1) {
                updatePlayerBoard(gameState.player1Board);
                updateOpponentBoard(gameState.player2Board);
            }
            else {
                updatePlayerBoard(gameState.player2Board);
                updateOpponentBoard(gameState.player1Board);
            }
        });
    }

    if (!gameState || !playerBoard || !opponentBoard) {
        return <h1>Loading...</h1>;
    }

    return <> {
        <div>
            <div>
                <h1>Opponent Board</h1>
                <h3>Squad Leader: </h3>
                <h3><CardList listName="In Play" updater={handleUpdate} cardObjects={opponentBoard.inPlay} /></h3>
                <h1>Your Board</h1>
                <h3><CardList listName="Hand" updater={handleUpdate} cardObjects={playerBoard.hand} /></h3>
                <h3><CardList listName="In Play" updater={handleUpdate} cardObjects={playerBoard.inPlay} /></h3>
             </div>
        </div>   
    } </>;
}

type Updater = (payload: StringMap) => void;

export default CodexGame;
