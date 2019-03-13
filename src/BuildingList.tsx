import React, { useState, FunctionComponent } from 'react';
import { WhoControlsThis, ObjectMap, GameStateContext } from './CodexGame';
import { Building } from './Building';

export const BuildingList: FunctionComponent<{
    board: ObjectMap;
    whoControlsThis: WhoControlsThis;
}> = ({ board, whoControlsThis }) => {
    return (
        <div className="playerBuildings">
            <Building buildingProp="base" board={board} whoControlsThis="player" />
            <Building buildingProp="tech1" board={board} whoControlsThis="player" />
            <Building buildingProp="tech2" board={board} whoControlsThis="player" />
            <Building buildingProp="tech3" board={board} whoControlsThis="player" />
            <Building buildingProp="addOn" board={board} whoControlsThis="player" />
        </div>
    );
};
