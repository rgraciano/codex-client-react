import React, { FunctionComponent, Component } from 'react';
import { WhoControlsThis, Board } from './CodexGame';
import { CardList } from './CardList';
import { PatrolZone } from './PatrolZone';
import { BuildingList } from './BuildingList';

export const BoardArea: FunctionComponent<{
    board: Board;
    whoControlsThis: WhoControlsThis;
}> = ({ board, whoControlsThis }) => {
    function outputHand() {
        if (whoControlsThis == 'player') {
            return (
                <div className="playerHand">
                    <CardList whoControlsThis={whoControlsThis} listName="Hand" cardObjects={board.hand} />
                </div>
            );
        } else return null;
    }

    return (
        <div className="playerBoard">
            <h1>{whoControlsThis == 'player' ? 'Your Board' : 'Opponent Board'} </h1>
            <h3>
                Gold: {board.gold}, Workers: {board.numWorkers}
            </h3>

            <BuildingList board={board} whoControlsThis={whoControlsThis} />

            <div className="heroes">
                <CardList whoControlsThis={whoControlsThis} listName="HeroZone" cardObjects={board.heroZone} />
            </div>

            <div className="patrollersAndHand">
                {outputHand()}
                <div className="playerPatrollers">
                    <PatrolZone whoControlsThis={whoControlsThis} />
                </div>
            </div>
            <div className="playerInPlay">
                <CardList whoControlsThis={whoControlsThis} listName="In Play" cardObjects={board.inPlay} />
            </div>
            {board.playStagingArea.length > 0 && (
                <div className="playerPlaying">
                    <CardList whoControlsThis={whoControlsThis} listName="Playing" cardObjects={board.playStagingArea} />
                </div>
            )}
        </div>
    );
};
