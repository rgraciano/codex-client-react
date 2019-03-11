import React, { createContext, useState, useEffect, FunctionComponent } from 'react';
import { CardList } from './CardList';
import { Building } from './Building';

import './CodexGame.css';

export class StringMap {
    [s: string]: string;
}
export class ObjectMap {
    [s: string]: object;
}

async function callServer(payload: StringMap) {
    let resp: Response;

    if (payload.actionName == 'NewGame') resp = await fetch('http://localhost:8080/newgame');
    else
        resp = await fetch('http://localhost:8080/action', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });

    return resp.json();
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

export class Phase {
    validActions: string[] = [];
    idsToResolve: string[] = [];
    extraState = { label: '' };
}

export const GameStateContext = createContext({
    opponentBoard: {},
    playerBoard: {
        canWorker: false
    },
    phase: new Phase()
});

export const CodexGame: FunctionComponent<{ payload: StringMap }> = ({ payload }) => {
    const [gameState, updateGameState] = useState();
    const [playerBoard, updatePlayerBoard] = useState();
    const [opponentBoard, updateOpponentBoard] = useState();

    const GameStateProvider = GameStateContext.Provider;

    useEffect(() => {
        handleUpdate(payload);
    }, [payload]);

    function handleUpdate(payload: StringMap) {
        payload.gameStateId = gameState ? gameState.gameStateId : '';

        callServer(payload).then(gameState => {
            updateGameState(gameState);

            if (gameState.activePlayer == 1) {
                updatePlayerBoard(gameState.player1Board);
                updateOpponentBoard(gameState.player2Board);
            } else {
                updatePlayerBoard(gameState.player2Board);
                updateOpponentBoard(gameState.player1Board);
            }
        });
    }

    if (!gameState || !playerBoard || !opponentBoard) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            {' '}
            {
                <div>
                    <GameStateProvider
                        value={{
                            opponentBoard: opponentBoard,
                            playerBoard: playerBoard,
                            phase: gameState.phaseStack.stack[gameState.phaseStack.stack.length - 1]
                        }}
                    >
                        <h1>
                            Player {gameState.activePlayer}, Turn {playerBoard.turnCount}
                        </h1>

                        <div className="boards">
                            <div className="playerBoard">
                                <h1>Your Board</h1>
                                <h3>
                                    Gold: {playerBoard.gold}, Workers: {playerBoard.numWorkers}
                                </h3>

                                <div className="playerBuildings">
                                    <Building buildingProp="base" board={playerBoard} whoControlsThis="player" updater={handleUpdate} />
                                </div>

                                <div className="patrollersAndHand">
                                    <div className="playerHand">
                                        <CardList
                                            whoControlsThis="player"
                                            listName="Hand"
                                            updater={handleUpdate}
                                            cardObjects={playerBoard.hand}
                                        />
                                    </div>
                                    <div className="playerPatrollers">
                                        <div>
                                            <h2>Patrollers:</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="playerInPlay">
                                    <CardList
                                        whoControlsThis="player"
                                        listName="In Play"
                                        updater={handleUpdate}
                                        cardObjects={playerBoard.inPlay}
                                    />
                                </div>
                            </div>

                            <div className="opponentBoard">
                                <h1>Opponent Board</h1>
                                <h3>
                                    Gold: {opponentBoard.gold}, Workers: {opponentBoard.numWorkers}, Hand: {opponentBoard.hand.length},
                                    Discard: {opponentBoard.discard.length}
                                </h3>
                                <CardList
                                    whoControlsThis="opponent"
                                    listName="In Play"
                                    updater={handleUpdate}
                                    cardObjects={opponentBoard.inPlay}
                                />
                            </div>
                        </div>
                    </GameStateProvider>
                </div>
            }{' '}
        </>
    );
};

export type Updater = (payload: StringMap) => void;
export type WhoControlsThis = 'player' | 'opponent';

export default CodexGame;
