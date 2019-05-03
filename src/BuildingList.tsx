import React, { FunctionComponent } from 'react';
import { WhoControlsThis } from './CodexGame';
import { BoardData } from './DataTypes';
import { Building } from './Building';

export const BuildingList: FunctionComponent<{
    board: BoardData;
    whoControlsThis: WhoControlsThis;
}> = ({ board, whoControlsThis }) => {
    return (
        <div className="playerBuildings">
            <Building buildingProp="base" board={board} whoControlsThis={whoControlsThis} />
            <Building buildingProp="tech1" board={board} whoControlsThis={whoControlsThis} />
            <Building buildingProp="tech2" board={board} whoControlsThis={whoControlsThis} />
            <Building buildingProp="tech3" board={board} whoControlsThis={whoControlsThis} />
            <Building buildingProp="addOn" board={board} whoControlsThis={whoControlsThis} />
        </div>
    );
};
