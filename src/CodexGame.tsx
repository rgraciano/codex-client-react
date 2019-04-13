import React, { createContext, useState, useEffect, FunctionComponent } from 'react';

import './CodexGame.css';

import { CardList } from './CardList';
import { BuildingList } from './BuildingList';
import { PossibleAction } from './PossibleAction';
import { BoardArea } from './BoardArea';

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
    [k: string]: any;
    canWorker: boolean = false;
    patrolZone: PrimitiveMap = {};
    gold: number = 1;
    numWorkers: number = 1;
    heroZone: StringMap[] = [];
    hand: StringMap[] = [];
    inPlay: StringMap[] = [];
    playStagingArea: StringMap[] = [];
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
                            <div className="playerArea">
                                <h1>
                                    Player {gameState.activePlayer}, Turn {gameState.playerBoard.turnCount}
                                </h1>
                                <PossibleAction actionName="EndTurn" actionTitle="End Turn" validateCardOrBuildingId={false} />
                            </div>

                            <div className="boards">
                                <BoardArea board={gameState.playerBoard} whoControlsThis="player" />
                                <BoardArea board={gameState.opponentBoard} whoControlsThis="opponent" />
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
