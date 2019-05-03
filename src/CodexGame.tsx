import React, { createContext, useState, useEffect, FunctionComponent } from 'react';
import { StringMap, GameState } from './DataTypes';

import './CodexGame.css';

import { PossibleAction } from './PossibleAction';
import { BoardArea } from './BoardArea';
import { Events } from './Events';

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
                                <Events eventDescriptors={gameState.events} />
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
