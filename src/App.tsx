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

export const Card: React.FunctionComponent<{ whoControlsThis: WhoControlsThis, updater: Updater, listName: string, cardObject: StringMap }> = ({ whoControlsThis, updater, listName, cardObject }) => {
    const [validActions, updateValidActions] = useState([]);
    const [validIds, updateValidIds] = useState([]);

    // will need a sub-menu...
    function patrol(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
    }

    let callApiAction = (actionName: string) => (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        let payload: StringMap = {};
        payload.actionName = actionName;
        payload.cardId = cardObject.cardId;

        updater(payload);
    }

    function isValidAction(actionName: string): boolean {
        return (validActions.findIndex(nm => nm === actionName) > -1);
    }

    function menuItem(actionName: string, actionTitle: string) {
        switch(actionName) {
            case 'PlayCard':
                if (!cardObject.canPlay) return null;
            case 'Attack':
                if (!cardObject.canAttack) return null;
            
        }
        return isValidAction(actionName) && <li><a href="#" onClick={callApiAction(actionName)}>{actionTitle}</a></li>;
    }

    function playerOptions() {
        if (whoControlsThis == "player") {
            return (
                <>
                    { cardObject.canPlay && menuItem('PlayCard', 'Play') }
                    { cardObject.canAttack && menuItem('Attack', 'Attack') }
                    { cardObject.canUseAbility && menuItem('Ability', 'Use Ability') }
                </>
            );
        }
        else return null;
    }

    return (
        <PhaseContext.Consumer>
            {({phase}) => (
                <>
                    { updateValidActions(phase.validActions) }
                    { updateValidIds(phase.idsToResolve) }

                    <a href="#" className="Card" key={cardObject.cardId} id={cardObject.cardId}>[{cardObject.name}]&nbsp;&nbsp;</a>
                    <div className="cardMenu">
                        <ul>
                            { playerOptions }
                            
                            { menuItem('AttackCardsChoice', 'Choose Defender') }
                            { menuItem('AttacksChoice', 'Resolve Trigger: Attacks') }
                            { menuItem('DiesOrLeavesChoice', 'Resolve Trigger: Dies') }
                            { menuItem('DiesOrLeavesChoice', 'Resolve Trigger: Leaves') }
                            { menuItem('UpkeepChoice', 'Resolve Trigger: Upkeep') }
                            { menuItem('ArrivesChoice', 'Resolve Trigger: Arrives') }
                            { menuItem('DestroyChoice', 'Resolve Trigger: Destroy') }
                        </ul>
                    </div>
                </>
            )}
        </PhaseContext.Consumer>
    );
}


export const Patroller: React.FunctionComponent<{ whoControlsThis: WhoControlsThis, patrollerSlot: string, updater: Updater, cardObject: StringMap }> 
                                            = ({ whoControlsThis, patrollerSlot, updater, cardObject }) => {
    return (
        <div>
            <h3>{patrollerSlot}: <Card whoControlsThis={whoControlsThis} updater={updater} listName={"Patrollers"} cardObject={cardObject} /></h3>
        </div>
    );
}

export const CardList: React.FunctionComponent<{ whoControlsThis: WhoControlsThis, updater: Updater, listName: string, cardObjects: StringMap[] }> 
                                            = ({ whoControlsThis, updater, listName, cardObjects }) => {
    
    
    function cards(cardObjects: StringMap[]) {
        return cardObjects.map(cardObj => <Card whoControlsThis={whoControlsThis} updater={updater} listName={listName} cardObject={cardObj}></Card>);
    }

    return (<div>{listName}: { cards(cardObjects) }</div>);
}

const PhaseContext = React.createContext(
    { 
        phase: { validActions: [],
                 idsToResolve: [] }
    });

export const CodexGame: React.FunctionComponent<{ payload: StringMap }> = ({ payload }) => {
    const [gameState, updateGameState] = useState();
    const [playerBoard, updatePlayerBoard] = useState();
    const [opponentBoard, updateOpponentBoard] = useState();

    const PhaseProvider = PhaseContext.Provider;

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
                <PhaseProvider value={gameState.phaseStack.stack[gameState.phaseStack.stack.length - 1]}>
                    <h1>Player {gameState.activePlayer}, Turn ImplementLater</h1>
                    <h1>Opponent Board</h1>
                    <h3>Squad Leader: </h3>
                    <h3><CardList whoControlsThis="opponent" listName="In Play" updater={handleUpdate} cardObjects={opponentBoard.inPlay} /></h3>
                    <h1>Your Board</h1>
                    <h3><CardList whoControlsThis="player" listName="Hand" updater={handleUpdate} cardObjects={playerBoard.hand} /></h3>
                    <h3><CardList whoControlsThis="player" listName="In Play" updater={handleUpdate} cardObjects={playerBoard.inPlay} /></h3>
                </PhaseProvider>
             </div>
        </div>   
    } </>;
}

type Updater = (payload: StringMap) => void;
type ObjectMap = { [key: string]: Object };
type WhoControlsThis = ('player' | 'opponent');

export default CodexGame;
