import React, { useState, FunctionComponent, useContext } from 'react';
import { StringMap, GameStateContext, Action } from './CodexGame';
import { ApiAction } from './ApiAction';

export const PossibleAction: FunctionComponent<{
    actionName: string;
    actionTitle: string;
    validateCardOrBuildingId: boolean;
    idValue?: string;
    idName?: string;
    extraInfo?: StringMap;
}> = ({ actionName, actionTitle, validateCardOrBuildingId, extraInfo, idValue = undefined, idName = undefined }) => {
    const gameState = useContext(GameStateContext);

    /**
     * Lists this action if it's in the back-end supplied list of valid actions,
     * and if this card is in the back-end list of valid cards for this action.
     *
     * Some actions don't use the list of valid IDs - they use an attribute on the card instead -
     * so we allow those actions to skip the validIdCheck here.
     */
    function possibleAction() {
        if (validateCardOrBuildingId && !isValidId(actionName, idValue)) return null;

        return (
            getAction(actionName) && (
                <ApiAction actionName={actionName} actionTitle={actionTitle} idValue={idValue} idName={idName} extraInfo={extraInfo} />
            )
        );
    }

    function getAction(actionName: string) {
        return gameState.phase.actions.find((action: Action) => action.name === actionName);
    }

    function isValidId(actionName: string, id: string | undefined) {
        if (!id) return true;
        let action = getAction(actionName);
        if (action) return action.idsToResolve.findIndex(tid => tid === id) > -1;
        else return false;
    }

    return <>{gameState && possibleAction()} </>;
};
