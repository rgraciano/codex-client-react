import React, { useState, FunctionComponent, useContext } from 'react';
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
    const gameState = useContext(GameStateContext);

    function buildingExists() {
        return board.hasOwnProperty(buildingProp) && board[buildingProp];
    }

    function possibleActionAddOn(addOnStr: string) {
        return (
            <PossibleAction
                actionName="Build"
                actionTitle={'Build ' + addOnStr}
                idName="buildingId"
                idValue={building.name}
                validateCardOrBuildingId={false}
                extraInfo={{ addOnType: addOnStr }}
            />
        );
    }

    function addOnActions() {
        if (building.name != 'AddOn') return null;

        let actions = [];

        if (building.canBuild) {
            if (building.canBuildTower) actions.push(possibleActionAddOn('Tower'));
            if (building.canBuildSurplus) actions.push(possibleActionAddOn('Surplus'));
            if (building.canBuildHeroesHall) actions.push(possibleActionAddOn('Heroes Hall'));
            if (building.canBuildTechLab) actions.push(possibleActionAddOn('Tech Lab'));
        }

        if (building.canReveal) {
            actions.push(
                <PossibleAction
                    actionName="Reveal"
                    actionTitle="Reveal Stealth/Invisible"
                    idName=""
                    idValue=""
                    validateCardOrBuildingId={false}
                />
            );
        }

        return actions;
    }

    function outputBuilding() {
        if (!buildingExists()) return null;

        if (building != board[buildingProp]) updateBuilding(board[buildingProp] as BuildingObj);

        if (!building || !gameState) return null;

        return (
            <>
                {(building.canBuild || building.built) && (
                    <div className="buidingRow">
                        {building.name == 'AddOn' && building.addOnType ? building.addOnType : building.name}:{' '}
                        {building.built ? '[' + building._health + ' HP]' : ''} {building.constructionInProgress ? '[constructing]' : ''}{' '}
                        {building.destroyed ? '[destroyed]' : ''} {building.disabled ? '[disabled]' : ''}{' '}
                        <ul className="cardMenu">
                            {building.canBuild && building.name != 'AddOn' && (
                                <PossibleAction
                                    actionName="Build"
                                    actionTitle="Build"
                                    idName="buildingId"
                                    idValue={building.name}
                                    validateCardOrBuildingId={false}
                                />
                            )}

                            {addOnActions()}

                            <PossibleAction
                                actionName="AbilityChoice"
                                actionTitle={'Choose: ' + gameState.phase.extraState.label}
                                idName="buildingId"
                                idValue={building.name}
                                validateCardOrBuildingId={true}
                            />
                            <PossibleAction
                                actionName="AttackCardsOrBuildingsChoice"
                                actionTitle="Choose: Defender"
                                idName="buildingId"
                                idValue={building.name}
                                validateCardOrBuildingId={true}
                            />
                        </ul>
                    </div>
                )}
            </>
        );
    }

    return <>{outputBuilding()}</>;
};
