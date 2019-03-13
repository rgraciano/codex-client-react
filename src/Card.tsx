import React, { useState, FunctionComponent, useEffect } from 'react';
import { WhoControlsThis, StringMap, GameStateContext, Phase } from './CodexGame';
import { PossibleAction } from './PossibleAction';

export const Card: FunctionComponent<{
    whoControlsThis: WhoControlsThis;
    listName: string;
    cardObject: StringMap;
}> = ({ whoControlsThis, listName, cardObject }) => {
    const [phase, updatePhase] = useState();
    const [extraState, updateExtraState] = useState({ label: '' });
    const [playerBoard, updatePlayerBoard] = useState({ canWorker: true });

    function abilities() {
        let abilities = cardObject.abilities;
        let canUseAbilities = cardObject.canUseAbilities;

        if (!abilities) return null;

        let printingAbilities = [];

        for (let i = 0; i < abilities.length; i++) {
            if (canUseAbilities[i])
                printingAbilities.push(
                    <PossibleAction
                        actionName="Ability"
                        actionTitle={abilities[i]}
                        cardOrBuildingId={cardObject.cardId}
                        validateCardOrBuildingId={false}
                        extraInfo={{ abilityName: abilities[i] }}
                    />
                );
        }

        return printingAbilities;
    }

    function playerActions() {
        if (whoControlsThis == 'player') {
            return (
                <>
                    {cardObject.canPlay && (
                        <PossibleAction
                            actionName="PlayCard"
                            actionTitle="Play"
                            cardOrBuildingId={cardObject.cardId}
                            validateCardOrBuildingId={false}
                        />
                    )}
                    {cardObject.canAttack && (
                        <PossibleAction
                            actionName="Attack"
                            actionTitle="Attack"
                            cardOrBuildingId={cardObject.cardId}
                            validateCardOrBuildingId={false}
                        />
                    )}
                    {listName != 'Hand' && abilities()}
                    {listName == 'Hand' && playerBoard && playerBoard.canWorker && (
                        <PossibleAction
                            actionName="Worker"
                            actionTitle="Worker"
                            cardOrBuildingId={cardObject.cardId}
                            validateCardOrBuildingId={false}
                        />
                    )}
                </>
            );
        } else return null;
    }

    return (
        <GameStateContext.Consumer>
            {({ playerBoard, phase }) => (
                <>
                    {updatePhase(phase)}
                    {updateExtraState(phase.extraState)}
                    {updatePlayerBoard(playerBoard)}
                    <div className="cardOuterDiv">
                        <a href="#" className="card" key={cardObject.cardId} id={cardObject.cardId}>
                            [{cardObject.name}]
                        </a>
                        <div className="cardInnerDiv">
                            <ul className="cardMenu">
                                {playerActions()}

                                <PossibleAction
                                    actionName="AttackCardsChoice"
                                    actionTitle="Choose: Defender"
                                    cardOrBuildingId={cardObject.cardId}
                                    validateCardOrBuildingId={true}
                                />

                                <PossibleAction
                                    actionName="AttacksChoice"
                                    actionTitle="Trigger: Attacks"
                                    cardOrBuildingId={cardObject.cardId}
                                    validateCardOrBuildingId={true}
                                />

                                <PossibleAction
                                    actionName="DiesOrLeavesChoice"
                                    actionTitle="Trigger: Dies/Leaves"
                                    cardOrBuildingId={cardObject.cardId}
                                    validateCardOrBuildingId={true}
                                />

                                <PossibleAction
                                    actionName="UpkeepChoice"
                                    actionTitle="Trigger: Upkeep"
                                    cardOrBuildingId={cardObject.cardId}
                                    validateCardOrBuildingId={true}
                                />

                                <PossibleAction
                                    actionName="ArrivesChoice"
                                    actionTitle="Trigger: Arrives"
                                    cardOrBuildingId={cardObject.cardId}
                                    validateCardOrBuildingId={true}
                                />

                                <PossibleAction
                                    actionName="DestroyChoice"
                                    actionTitle="Trigger: Destroy"
                                    cardOrBuildingId={cardObject.cardId}
                                    validateCardOrBuildingId={true}
                                />

                                <PossibleAction
                                    actionName="AbilityChoice"
                                    actionTitle={'Choose: ' + extraState.label}
                                    cardOrBuildingId={cardObject.cardId}
                                    validateCardOrBuildingId={true}
                                />
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </GameStateContext.Consumer>
    );
};
