import React, { useState, FunctionComponent, useEffect, useContext } from 'react';
import { WhoControlsThis, StringMap, GameStateContext, Phase } from './CodexGame';
import { PossibleAction } from './PossibleAction';

export const Card: FunctionComponent<{
    whoControlsThis: WhoControlsThis;
    listName: string;
    cardObject: StringMap;
}> = ({ whoControlsThis, listName, cardObject }) => {
    const gameState = useContext(GameStateContext);

    function abilities(staging: boolean = false) {
        let abilities = staging ? cardObject.stagingAbilities : cardObject.abilities;
        let canUseAbilities = staging ? cardObject.canUseStagingAbilities : cardObject.canUseAbilities;

        if (!abilities) return null;

        let printingAbilities = [];

        for (let i = 0; i < abilities.length; i++) {
            if (canUseAbilities[i])
                printingAbilities.push(
                    <PossibleAction
                        actionName={staging ? 'StagingAbility' : 'Ability'}
                        actionTitle={abilities[i]}
                        cardId={cardObject.cardId}
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
                            cardId={cardObject.cardId}
                            validateCardOrBuildingId={false}
                        />
                    )}
                    {cardObject.canAttack && (
                        <PossibleAction
                            actionName="Attack"
                            actionTitle="Attack"
                            cardId={cardObject.cardId}
                            validateCardOrBuildingId={false}
                        />
                    )}
                    {cardObject.canAttack && (
                        <PossibleAction
                            actionName="Patrol"
                            actionTitle="Patrol"
                            cardId={cardObject.cardId}
                            validateCardOrBuildingId={false}
                        />
                    )}
                    {listName != 'Hand' && abilities()}
                    {listName == 'Playing' && abilities(true)}
                    {listName == 'Hand' && gameState.playerBoard && gameState.playerBoard.canWorker && (
                        <PossibleAction
                            actionName="Worker"
                            actionTitle="Worker"
                            cardId={cardObject.cardId}
                            validateCardOrBuildingId={false}
                        />
                    )}
                </>
            );
        } else return null;
    }

    return (
        <>
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
                            cardId={cardObject.cardId}
                            validateCardOrBuildingId={true}
                        />

                        <PossibleAction
                            actionName="AttacksChoice"
                            actionTitle="Trigger: Attacks"
                            cardId={cardObject.cardId}
                            validateCardOrBuildingId={true}
                        />

                        <PossibleAction
                            actionName="DiesOrLeavesChoice"
                            actionTitle="Trigger: Dies/Leaves"
                            cardId={cardObject.cardId}
                            validateCardOrBuildingId={true}
                        />

                        <PossibleAction
                            actionName="UpkeepChoice"
                            actionTitle="Trigger: Upkeep"
                            cardId={cardObject.cardId}
                            validateCardOrBuildingId={true}
                        />

                        <PossibleAction
                            actionName="ArrivesChoice"
                            actionTitle="Trigger: Arrives"
                            cardId={cardObject.cardId}
                            validateCardOrBuildingId={true}
                        />

                        <PossibleAction
                            actionName="DestroyChoice"
                            actionTitle="Trigger: Destroy"
                            cardId={cardObject.cardId}
                            validateCardOrBuildingId={true}
                        />

                        <PossibleAction
                            actionName="AbilityChoice"
                            actionTitle={'Choose: ' + gameState.phase.extraState.label}
                            cardId={cardObject.cardId}
                            validateCardOrBuildingId={true}
                        />

                        <PossibleAction
                            actionName="TowerRevealChoice"
                            actionTitle={'Choose: Reveal'}
                            cardId={cardObject.cardId}
                            validateCardOrBuildingId={true}
                        />
                    </ul>
                </div>
            </div>
        </>
    );
};
