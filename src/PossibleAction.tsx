import React, { useState, FunctionComponent } from 'react';
import { Updater, StringMap, GameStateContext } from './CodexGame';
import { Action } from './Action';

export const PossibleAction: FunctionComponent<{
    updater: Updater;
    actionName: string;
    actionTitle: string;
    cardOrBuildingId: string;
    validateCardOrBuildingId: boolean;
    extraInfo?: StringMap;
}> = ({ updater, actionName, actionTitle, cardOrBuildingId, validateCardOrBuildingId, extraInfo }) => {
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
        if (validateCardOrBuildingId && !isValidId(cardOrBuildingId)) return null;

        return (
            isValidAction(actionName) && (
                <Action
                    updater={updater}
                    actionName={actionName}
                    actionTitle={actionTitle}
                    cardOrBuildingId={cardOrBuildingId}
                    extraInfo={extraInfo}
                />
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
