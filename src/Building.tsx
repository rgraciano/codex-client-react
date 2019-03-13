import React, { useState, FunctionComponent } from 'react';
import { WhoControlsThis, ObjectMap, GameStateContext } from './CodexGame';
import { PossibleAction } from './PossibleAction';

export type BuildingObj = {
    _health: number;
    name: string;
};

export const Building: FunctionComponent<{
    buildingProp: string;
    board: ObjectMap;
    whoControlsThis: WhoControlsThis;
}> = ({ board, buildingProp, whoControlsThis }) => {
    const [building, updateBuilding] = useState();
    const [extraState, updateExtraState] = useState();

    function buildingExists() {
        return board.hasOwnProperty(buildingProp) && board[buildingProp];
    }

    function possibleActionAddOn(addOnStr: string) {
        return (
            <PossibleAction
                actionName="Build"
                actionTitle={'Build ' + addOnStr}
                cardOrBuildingId={building.name}
                validateCardOrBuildingId={false}
                extraInfo={{ addOnType: addOnStr }}
            />
        );
    }

    function addOnBuildActions() {
        if (!building.canBuild || !(building.name == 'AddOn')) return null;

        let addOnBuilds = [];

        if (building.canBuildTower) addOnBuilds.push(possibleActionAddOn('Tower'));
        if (building.canBuildSurplus) addOnBuilds.push(possibleActionAddOn('Surplus'));
        if (building.canBuildHeroesHall) addOnBuilds.push(possibleActionAddOn('Heroes Hall'));
        if (building.canBuildTechLab) addOnBuilds.push(possibleActionAddOn('Tech Lab'));

        return addOnBuilds;
    }

    function outputBuilding() {
        if (!buildingExists()) return null;

        updateBuilding(board[buildingProp] as BuildingObj);

        if (!building) return null;

        return (
            <>
                {(building.canBuild || building.name == 'Base') && (
                    <div className="buidingRow">
                        {building.name}: {building.built ? '[' + building._health + ' HP]' : ''}{' '}
                        {building.constructionInProgress ? '[constructing]' : ''} {building.destroyed ? '[destroyed]' : ''}{' '}
                        {building.disabled ? '[disabled]' : ''}{' '}
                        <ul className="cardMenu">
                            {building.canBuild && building.name != 'AddOn' && (
                                <PossibleAction
                                    actionName="Build"
                                    actionTitle="Build"
                                    cardOrBuildingId={building.name}
                                    validateCardOrBuildingId={false}
                                />
                            )}

                            {addOnBuildActions()}

                            <PossibleAction
                                actionName="AbilityChoice"
                                actionTitle={'Choose: ' + extraState.label}
                                cardOrBuildingId={building.name}
                                validateCardOrBuildingId={true}
                            />
                            <PossibleAction
                                actionName="AttackCardsOrBuildingsChoice"
                                actionTitle="Choose: Defender"
                                cardOrBuildingId={building.name}
                                validateCardOrBuildingId={true}
                            />
                        </ul>
                    </div>
                )}
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
