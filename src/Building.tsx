import React, { useState, FunctionComponent } from 'react';
import { WhoControlsThis, Updater, ObjectMap, GameStateContext } from './CodexGame';
import { PossibleAction } from './PossibleAction';

export type BuildingObj = {
    _health: number;
    name: string;
};

export const Building: FunctionComponent<{
    buildingProp: string;
    board: ObjectMap;
    whoControlsThis: WhoControlsThis;
    updater: Updater;
}> = ({ board, buildingProp, whoControlsThis, updater }) => {
    const [building, updateBuilding] = useState();
    const [extraState, updateExtraState] = useState();

    function buildingExists() {
        return board.hasOwnProperty(buildingProp) && board[buildingProp];
    }

    function outputBuilding() {
        if (!buildingExists()) return null;

        updateBuilding(board[buildingProp] as BuildingObj);

        if (!building) return null;

        return (
            <>
                <h3>
                    {building.name}: {building._health}HP {building.constructionInProgress ? '[constructing]' : ''}{' '}
                    {building.destroyed ? '[destroyed]' : ''}{' '}
                    <ul className="cardMenu">
                        <PossibleAction
                            updater={updater}
                            actionName="AbilityChoice"
                            actionTitle={'Choose: ' + extraState.label}
                            cardOrBuildingId={building.name}
                            validateCardOrBuildingId={true}
                        />
                        <PossibleAction
                            updater={updater}
                            actionName="AttackCardsOrBuildingsChoice"
                            actionTitle="Choose: Defender"
                            cardOrBuildingId={building.name}
                            validateCardOrBuildingId={true}
                        />
                    </ul>
                </h3>
            </>
        );
    }

    return (
        <GameStateContext.Consumer>
            {({ phase }) => (
                <>
                    {' '}
                    {updateExtraState(phase.extraState)} {outputBuilding()}{' '}
                </>
            )}
        </GameStateContext.Consumer>
    );
};
