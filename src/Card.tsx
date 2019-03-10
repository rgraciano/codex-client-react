import React, { useState, FunctionComponent } from 'react';
import { WhoControlsThis, Updater, StringMap, GameStateContext } from './CodexGame';

export const Card: FunctionComponent<{
    whoControlsThis: WhoControlsThis;
    updater: Updater;
    listName: string;
    cardObject: StringMap;
}> = ({ whoControlsThis, updater, listName, cardObject }) => {
    const [validActions, updateValidActions] = useState(['NewGame']);
    const [validIds, updateValidIds] = useState(['none']);
    const [extraState, updateExtraState] = useState({ label: undefined });
    const [playerBoard, updatePlayerBoard] = useState({ canWorker: true });

    // will need a sub-menu...
    function patrol(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
    }

    let callApiAction = (actionName: string) => (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        let payload: StringMap = {};
        payload.actionName = actionName;
        payload.cardId = cardObject.cardId;

        updater(payload);
    };

    function isValidId(id: string) {
        return validIds && validIds.findIndex(tid => tid === id) > -1;
    }

    function isValidAction(actionName: string): boolean {
        return validActions && validActions.findIndex(nm => nm === actionName) > -1;
    }

    /**
     * Lists this action if it's in the back-end supplied list of valid actions,
     * and if this card is in the back-end list of valid cards for this action.
     *
     * Some actions don't use the list of valid IDs - they use an attribute on the card instead -
     * so we allow those actions to skip the validIdCheck here.
     */
    function possibleAction(actionName: string, actionTitle?: string, skipValidIdCheck = false) {
        switch (actionName) {
            case 'PlayCard':
                if (!cardObject.canPlay) return null;
                break;
            case 'Attack':
                if (!cardObject.canAttack) return null;
                break;
        }
        return (
            (skipValidIdCheck || isValidId(cardObject.cardId)) &&
            isValidAction(actionName) && (
                <li className="cardLI">
                    <a href="#" onClick={callApiAction(actionName)}>
                        {actionTitle ? actionTitle : extraState.label}
                    </a>
                </li>
            )
        );
    }

    function playerActions() {
        if (whoControlsThis == 'player') {
            return (
                <>
                    {cardObject.canPlay && possibleAction('PlayCard', 'Play', true)}
                    {cardObject.canAttack && possibleAction('Attack', 'Attack', true)}
                    {cardObject.canUseAbility && possibleAction('Ability', 'Use Ability', true)}
                    {listName == 'Hand' && playerBoard && playerBoard.canWorker && possibleAction('Worker', 'Worker', true)}
                </>
            );
        } else return null;
    }

    return (
        <GameStateContext.Consumer>
            {({ opponentBoard, playerBoard, phase }) => (
                <>
                    {updateValidActions(phase.validActions)}
                    {updateValidIds(phase.idsToResolve)}
                    {updateExtraState(phase.extraState)}
                    {updatePlayerBoard(playerBoard)}
                    <div className="cardOuterDiv">
                        <a href="#" className="card" key={cardObject.cardId} id={cardObject.cardId}>
                            [{cardObject.name}]
                        </a>
                        <div className="cardInnerDiv">
                            <ul className="cardMenu">
                                {playerActions()}

                                {possibleAction('AttackCardsChoice', 'Choose Defender')}
                                {possibleAction('AttacksChoice', 'Trigger: Attacks')}
                                {possibleAction('DiesOrLeavesChoice', 'Trigger: Dies')}
                                {possibleAction('DiesOrLeavesChoice', 'Trigger: Leaves')}
                                {possibleAction('UpkeepChoice', 'Trigger: Upkeep')}
                                {possibleAction('ArrivesChoice', 'Trigger: Arrives')}
                                {possibleAction('DestroyChoice', 'Trigger: Destroy')}
                                {possibleAction('AbilityChoice')}
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </GameStateContext.Consumer>
    );
};
