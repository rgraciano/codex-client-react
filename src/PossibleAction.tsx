import React, { useState, FunctionComponent } from 'react';
import { StringMap, GameStateContext } from './CodexGame';
import { Action } from './Action';

export const PossibleAction: FunctionComponent<{
    actionName: string;
    actionTitle: string;
    validateCardOrBuildingId: boolean;
    cardId?: string;
    buildingId?: string;
    extraInfo?: StringMap;
}> = ({ actionName, actionTitle, cardId, buildingId, validateCardOrBuildingId, extraInfo }) => {
    const [idsToResolve, updateIdsToResolve] = useState(['a']);
    const [validActions, updateValidActions] = useState(['a']);

    /**
     * Lists this action if it's in the back-end supplied list of valid actions,
     * and if this card is in the back-end list of valid cards for this action.
     *
     * Some actions don't use the list of valid IDs - they use an attribute on the card instead -
     * so we allow those actions to skip the validIdCheck here.
     */
    function possibleAction() {
        let idValue: string, idName: string;

        if (cardId) {
            idValue = cardId;
            idName = 'cardId';
        } else if (buildingId) {
            idValue = buildingId;
            idName = 'buildingId';
        } else return null;

        if (validateCardOrBuildingId && !isValidId(idValue)) return null;

        return (
            isValidAction(actionName) && (
                <Action actionName={actionName} actionTitle={actionTitle} idValue={idValue} idName={idName} extraInfo={extraInfo} />
            )
        );
    }

    function isValidId(id: string) {
        return idsToResolve && idsToResolve.findIndex(tid => tid === id) > -1;
    }

    function isValidAction(actionName: string): boolean {
        return validActions && validActions.findIndex(nm => nm === actionName) > -1;
    }

    return (
        <GameStateContext.Consumer>
            {({ phase }) => (
                <>
                    {updateIdsToResolve(phase.idsToResolve)}
                    {updateValidActions(phase.validActions)}
                    {possibleAction()}{' '}
                </>
            )}
        </GameStateContext.Consumer>
    );
};
