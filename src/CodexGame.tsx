import React, { createContext, useState, useEffect, FunctionComponent } from 'react';

import './CodexGame.css';

import { PossibleAction } from './PossibleAction';
import { BoardArea } from './BoardArea';
import { Events } from './Events';

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
    extraState: PrimitiveMap = {};
}

export class Phase {
    actions: Action[] = [];
    static getAction(phase: Phase, actionName: string): Action {
        let action = phase.actions.find((action: Action) => action.name == actionName);
        if (action == undefined) return new Action();
        else return action;
    }
}

export class BoardData {
    [k: string]: any;
    canWorker: boolean = false;
    patrolZone: PrimitiveMap = {};
    gold: number = 1;
    numWorkers: number = 1;
    heroZone: CardData[] = [];
    hand: CardData[] = [];
    inPlay: CardData[] = [];
    playStagingArea: CardData[] = [];
    deck: CardData[] = [];
    discard: CardData[] = [];
}

export class CardData {
    cardId: string = '';
    name: string = '';
    allAttack: number = 1;
    allHealth: number = 1;
    costAfterAlterations: number = 1;
    cardType: string = '';
    canPlay: boolean = false;
    canAttack: boolean = false;
    canPatrol: boolean = false;
    canSideline: boolean = false;
    baseAttributes: AttributeData = {};
    attributeModifiers: AttributeData = {};
    canUseAbilities: boolean[] = [];
    canUseStagingAbilities: boolean[] = [];
    stagingAbilities: string[] = [];
    abilities: string[] = [];
    level: number = 1;
    maxLevel: number = 1;
}

export class AttributeData {
    [k: string]: number;
}

export class GameState {
    opponentBoard: BoardData = new BoardData();
    playerBoard: BoardData = new BoardData();
    phaseStack: Phase[] = [];
    phase: Phase = new Phase();
    events: EventDescriptor[] = [];
}

export class EventDescriptor {
    eventType: string = '';
    description: string = '';
    context: ObjectMap = {};
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
