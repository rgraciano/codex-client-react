import React, { FunctionComponent, useContext } from 'react';
import { WhoControlsThis, CardData, GameStateContext, Phase } from './CodexGame';
import { PossibleAction } from './PossibleAction';
import Popup from 'reactjs-popup';

export const Card: FunctionComponent<{
    whoControlsThis: WhoControlsThis;
    listName: string;
    cardObject: CardData;
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
                        idName="cardId"
                        idValue={cardObject.cardId}
                        validateCardOrBuildingId={false}
                        extraInfo={{ abilityName: abilities[i] }}
                    />
                );
        }

        return printingAbilities;
    }

    function attributes() {
        let elements: JSX.Element[] = [];

        elements.push(<li>Cost: {cardObject.costAfterAlterations}</li>);

        if (cardObject.cardType == 'Unit' || cardObject.cardType == 'Hero') elements.push(<li>Attack: {cardObject.allAttack}</li>);

        if (cardObject.cardType != 'Upgrade' && cardObject.cardType != 'Spell') elements.push(<li>Health: {cardObject.allHealth}</li>);

        for (let attrName in cardObject.baseAttributes) {
            let attrTotal = cardObject.baseAttributes[attrName] + cardObject.attributeModifiers[attrName];
            if (attrTotal > 0 && attrName != 'cost' && attrName != 'attack' && attrName != 'health') {
                elements.push(
                    <li>
                        {attrName.charAt(0).toLocaleUpperCase() + attrName.substring(1)}: {attrTotal}
                    </li>
                );
            }
        }

        return <ul>{elements}</ul>;
    }

    function playerActions() {
        if (whoControlsThis == 'player') {
            return (
                <>
                    {cardObject.canPlay && (
                        <PossibleAction
                            actionName="PlayCard"
                            actionTitle="Play"
                            idName="cardId"
                            idValue={cardObject.cardId}
                            validateCardOrBuildingId={false}
                        />
                    )}
                    {cardObject.canAttack && (
                        <PossibleAction
                            actionName="Attack"
                            actionTitle="Attack"
                            idName="cardId"
                            idValue={cardObject.cardId}
                            validateCardOrBuildingId={false}
                        />
                    )}
                    {cardObject.canPatrol && (
                        <PossibleAction
                            actionName="Patrol"
                            actionTitle="Patrol"
                            idName="cardId"
                            idValue={cardObject.cardId}
                            validateCardOrBuildingId={false}
                        />
                    )}
                    {cardObject.canSideline && (
                        <PossibleAction
                            actionName="Sideline"
                            actionTitle="Unpatrol"
                            idName="cardId"
                            idValue={cardObject.cardId}
                            validateCardOrBuildingId={false}
                        />
                    )}
                    {listName != 'Hand' && abilities()}
                    {listName == 'Playing' && abilities(true)}
                    {listName == 'Hand' && gameState.playerBoard && gameState.playerBoard.canWorker && (
                        <PossibleAction
                            actionName="Worker"
                            actionTitle="Worker"
                            idName="cardId"
                            idValue={cardObject.cardId}
                            validateCardOrBuildingId={false}
                        />
                    )}
                    {listName != 'HeroZone' &&
                        cardObject.cardType == 'Hero' &&
                        cardObject.level < cardObject.maxLevel &&
                        gameState.playerBoard.gold > 0 && (
                            <PossibleAction
                                actionName="HeroLevel"
                                actionTitle="+1 Lvl"
                                idName="cardId"
                                idValue={cardObject.cardId}
                                validateCardOrBuildingId={false}
                            />
                        )}
                </>
            );
        } else return null;
    }

    function cardLink() {
        return (
            <a href="#" className="card" key={cardObject.cardId} id={cardObject.cardId}>
                [{cardObject.name}]
            </a>
        );
    }

    return (
        <>
            <div className="cardOuterDiv">
                <Popup trigger={cardLink()} position="right center">
                    <div>{attributes()}</div>
                </Popup>
                <div className="cardInnerDiv">
                    <ul className="cardMenu">
                        {playerActions()}

                        <PossibleAction
                            actionName="AttackCardsChoice"
                            actionTitle="Choose: Defender"
                            idName="cardId"
                            idValue={cardObject.cardId}
                            validateCardOrBuildingId={true}
                        />

                        <PossibleAction
                            actionName="AttacksChoice"
                            actionTitle="Trigger: Attacks"
                            idName="cardId"
                            idValue={cardObject.cardId}
                            validateCardOrBuildingId={true}
                        />

                        <PossibleAction
                            actionName="DiesOrLeavesChoice"
                            actionTitle="Trigger: Dies/Leaves"
                            idName="cardId"
                            idValue={cardObject.cardId}
                            validateCardOrBuildingId={true}
                        />

                        <PossibleAction
                            actionName="UpkeepChoice"
                            actionTitle="Trigger: Upkeep"
                            idName="cardId"
                            idValue={cardObject.cardId}
                            validateCardOrBuildingId={true}
                        />

                        <PossibleAction
                            actionName="ArrivesChoice"
                            actionTitle="Trigger: Arrives"
                            idName="cardId"
                            idValue={cardObject.cardId}
                            validateCardOrBuildingId={true}
                        />

                        <PossibleAction
                            actionName="DestroyChoice"
                            actionTitle="Trigger: Destroy"
                            idName="cardId"
                            idValue={cardObject.cardId}
                            validateCardOrBuildingId={true}
                        />

                        <PossibleAction
                            actionName="AbilityChoice"
                            actionTitle={'Choose: ' + Phase.getAction(gameState.phase, 'AbilityChoice').extraState.label}
                            idName="cardId"
                            idValue={cardObject.cardId}
                            validateCardOrBuildingId={true}
                        />

                        <PossibleAction
                            actionName="TowerRevealChoice"
                            actionTitle={'Choose: Reveal'}
                            idName="cardId"
                            idValue={cardObject.cardId}
                            validateCardOrBuildingId={true}
                        />

                        <PossibleAction
                            actionName="HeroLevelChoice"
                            actionTitle={'Choose: +2 levels'}
                            idName="cardId"
                            idValue={cardObject.cardId}
                            validateCardOrBuildingId={true}
                        />

                        <PossibleAction
                            actionName="EndTurnChoice"
                            actionTitle={'Trigger: End of Turn'}
                            idName="cardId"
                            idValue={cardObject.cardId}
                            validateCardOrBuildingId={true}
                        />
                    </ul>
                </div>
            </div>
        </>
    );
};
