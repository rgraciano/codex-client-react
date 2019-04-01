import React, { createContext, useState, useEffect, FunctionComponent } from 'react';
import { CardList } from './CardList';
import { BuildingList } from './BuildingList';

import './CodexGame.css';
import { PatrolZone } from './PatrolZone';

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

export type PrimitiveMap = {
    [k: string]: string | number | boolean | object;
};

export class Action {
    name: string = '';
    idsToResolve: string[] = [];
}

export class Phase {
    actions: Action[] = [];
    extraState: PrimitiveMap = {};
}

export class Board {
    canWorker: boolean = false;
    patrolZone: PrimitiveMap = {};
}

export class GameState {
    opponentBoard: Board = new Board();
    playerBoard: Board = new Board();
    phaseStack: Phase[] = [];
    phase: Phase = new Phase();
}

export const GameStateContext = createContext<GameState>(new GameState());

export const UpdateContext = createContext({ handleUpdate: (payload: StringMap) => {} });

export const CodexGame: FunctionComponent<{ payload: StringMap }> = ({ payload }) => {
    const [gameState, updateGameState] = useState();

    const GameStateProvider = GameStateContext.Provider;
    const UpdateContextProvider = UpdateContext.Provider;

    useEffect(() => {
        handleUpdate(payload);
    }, [payload]);

    function handleUpdate(payload: StringMap) {
        if (payload === undefined) return;

        payload.gameStateId = gameState ? gameState.gameStateId : '';

        callServer(payload).then(newGameState => {
            if (newGameState.activePlayer == 1) {
                newGameState.playerBoard = newGameState.player1Board;
                newGameState.opponentBoard = newGameState.player2Board;
            } else {
                newGameState.playerBoard = newGameState.player2Board;
                newGameState.opponentBoard = newGameState.player1Board;
            }

            if (!newGameState.phaseStack || !newGameState.phaseStack.stack || newGameState.phaseStack.length < 1) return;

            newGameState.phase = newGameState.phaseStack.stack[newGameState.phaseStack.stack.length - 1];

            updateGameState(newGameState);
        });
    }

    if (!gameState || !gameState.playerBoard) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            {' '}
            {
                <div>
                    <UpdateContextProvider value={{ handleUpdate: handleUpdate }}>
                        <GameStateProvider value={gameState}>
                            <h1>
                                Player {gameState.activePlayer}, Turn {gameState.playerBoard.turnCount}
                            </h1>

                            <div className="boards">
                                <div className="playerBoard">
                                    <h1>Your Board</h1>
                                    <h3>
                                        Gold: {gameState.playerBoard.gold}, Workers: {gameState.playerBoard.numWorkers}
                                    </h3>

                                    <BuildingList board={gameState.playerBoard} whoControlsThis="player" />

                                    <div className="heroes">
                                        <CardList whoControlsThis="player" listName="Heroes" cardObjects={gameState.playerBoard.heroZone} />
                                    </div>

                                    <div className="patrollersAndHand">
                                        <div className="playerHand">
                                            <CardList whoControlsThis="player" listName="Hand" cardObjects={gameState.playerBoard.hand} />
                                        </div>
                                        <div className="playerPatrollers">
                                            <PatrolZone whoControlsThis="player" />
                                        </div>
                                    </div>
                                    <div className="playerInPlay">
                                        <CardList whoControlsThis="player" listName="In Play" cardObjects={gameState.playerBoard.inPlay} />
                                    </div>
                                    {gameState.playerBoard.playStagingArea.length > 0 && (
                                        <div className="playerPlaying">
                                            <CardList
                                                whoControlsThis="player"
                                                listName="Playing"
                                                cardObjects={gameState.playerBoard.playStagingArea}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="opponentBoard">
                                    <h1>Opponent Board</h1>
                                    <h3>
                                        Gold: {gameState.opponentBoard.gold}, Workers: {gameState.opponentBoard.numWorkers}, Hand:{' '}
                                        {gameState.opponentBoard.hand.length}, Discard: {gameState.opponentBoard.discard.length}
                                    </h3>

                                    <BuildingList board={gameState.opponentBoard} whoControlsThis="opponent" />

                                    <CardList whoControlsThis="opponent" listName="In Play" cardObjects={gameState.opponentBoard.inPlay} />
                                </div>
                            </div>
                        </GameStateProvider>
                    </UpdateContextProvider>
                </div>
            }{' '}
        </>
    );
};

export type WhoControlsThis = 'player' | 'opponent';

export default CodexGame;
