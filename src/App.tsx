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
    const [validActions, updateValidActions] = useState(['NewGame']);
    const [validIds, updateValidIds] = useState(['none']);

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

    function isValidId(id: string) {
        return validIds && (validIds.findIndex(tid => tid === id) > -1);
    }

    function isValidAction(actionName: string): boolean {
        return validActions && (validActions.findIndex(nm => nm === actionName) > -1);
    }

    /** 
     * Lists this action if it's in the back-end supplied list of valid actions, 
     * and if this card is in the back-end list of valid cards for this action.
     * 
     * Some actions don't use the list of valid IDs - they use an attribute on the card instead -
     * so we allow those actions to skip the validIdCheck here.
     */
    function possibleAction(actionName: string, actionTitle: string, skipValidIdCheck = false) {
        switch(actionName) {
            case 'PlayCard':
                if (!cardObject.canPlay) return null;
                break;
            case 'Attack':
                if (!cardObject.canAttack) return null;
                break;
            
        }
        return (skipValidIdCheck || isValidId(cardObject.cardId)) && isValidAction(actionName) && <li className="cardLI"><a href="#" onClick={callApiAction(actionName)}>{actionTitle}</a></li>;
    }

    function playerActions() {
        if (whoControlsThis == "player") {
            return (
                <>
                    { cardObject.canPlay && possibleAction('PlayCard', 'Play', true) }
                    { cardObject.canAttack && possibleAction('Attack', 'Attack', true) }
                    { cardObject.canUseAbility && possibleAction('Ability', 'Use Ability', true) }
                </>
            );
        }
        else return null;
    }

    return (
        <PhaseContext.Consumer>
            { ({validActions, idsToResolve}) => (
                <>
                    { updateValidActions(validActions) }
                    { updateValidIds(idsToResolve) }
                    <div className="cardOuterDiv">
                        <a href="#" className="card" key={cardObject.cardId} id={cardObject.cardId}>[{cardObject.name}]</a>
                        <div className="cardInnerDiv">
                            <ul className="cardMenu">
                                { playerActions() }
                                
                                { possibleAction('AttackCardsChoice', 'Choose Defender') }
                                { possibleAction('AttacksChoice', 'Resolve Trigger: Attacks') }
                                { possibleAction('DiesOrLeavesChoice', 'Resolve Trigger: Dies') }
                                { possibleAction('DiesOrLeavesChoice', 'Resolve Trigger: Leaves') }
                                { possibleAction('UpkeepChoice', 'Resolve Trigger: Upkeep') }
                                { possibleAction('ArrivesChoice', 'Resolve Trigger: Arrives') }
                                { possibleAction('DestroyChoice', 'Resolve Trigger: Destroy') }
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </PhaseContext.Consumer>
    );
}

/*
export const Patroller: React.FunctionComponent<{ whoControlsThis: WhoControlsThis, patrollerSlot: string, updater: Updater, cardObject: StringMap }> 
                                            = ({ whoControlsThis, patrollerSlot, updater, cardObject }) => {
    return (
        <div>
            <h3>{patrollerSlot}: <Card whoControlsThis={whoControlsThis} updater={updater} listName={"Patrollers"} cardObject={cardObject} /></h3>
        </div>
    );
}*/

export const CardList: React.FunctionComponent<{ whoControlsThis: WhoControlsThis, updater: Updater, listName: string, cardObjects: StringMap[] }> 
                                            = ({ whoControlsThis, updater, listName, cardObjects }) => {
    
    
    function cards(cardObjects: StringMap[]) {
        return cardObjects.map(cardObj => <Card key={cardObj.cardId} whoControlsThis={whoControlsThis} updater={updater} listName={listName} cardObject={cardObj} />);
    }

    return (<div><h2>{listName}:</h2> { cards(cardObjects) }</div>);
}

const PhaseContext = React.createContext(
    { 
        validActions: [],
        idsToResolve: []
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
                    <h1>Player {gameState.activePlayer}, Turn {playerBoard.turnCount}</h1>
                    <h1>Opponent Board</h1>
                    <h3>Gold: {opponentBoard.gold}, Workers: {opponentBoard.numWorkers}, 
                        Hand: {opponentBoard.hand.length}, Discard: {opponentBoard.discard.length}</h3>
                    <CardList whoControlsThis="opponent" listName="In Play" updater={handleUpdate} cardObjects={opponentBoard.inPlay} />
                    <h1>Your Board</h1>
                    <h3>Gold: {playerBoard.gold}, Workers: {playerBoard.numWorkers}</h3>
                    <CardList whoControlsThis="player" listName="Hand" updater={handleUpdate} cardObjects={playerBoard.hand} />
                    <CardList whoControlsThis="player" listName="In Play" updater={handleUpdate} cardObjects={playerBoard.inPlay} />
                </PhaseProvider>
             </div>
        </div>   
    } </>;
}

type Updater = (payload: StringMap) => void;
type WhoControlsThis = ('player' | 'opponent');

export default CodexGame;
