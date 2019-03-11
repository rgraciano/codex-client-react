import React, { FunctionComponent } from 'react';
import { WhoControlsThis, Updater, StringMap, GameStateContext } from './CodexGame';
import { Card } from './Card';

export const Building: FunctionComponent<{
    buildingName: string;
    board: StringMap;
    whoControlsThis: WhoControlsThis;
    updater: Updater;
}> = ({ buildingName, board, whoControlsThis, updater }) => {
    function buildingExists(buildingName: string) {
        return board.hasOwnProperty(buildingName) && board.buildingName;
    }

    function outputBuilding() {}

    return <GameStateContext.Consumer>{({ phase }) => <>{buildingExists(buildingName) && outputBuilding()}</>}</GameStateContext.Consumer>;
};
