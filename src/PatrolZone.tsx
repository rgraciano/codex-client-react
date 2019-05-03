import React, { FunctionComponent, useContext } from 'react';
import { WhoControlsThis, GameStateContext } from './CodexGame';
import { CardData } from './DataTypes';
import { PossibleAction } from './PossibleAction';
import { CardList } from './CardList';

export const PatrolZone: FunctionComponent<{
    whoControlsThis: WhoControlsThis;
}> = ({ whoControlsThis }) => {
    const gameState = useContext(GameStateContext);

    function cardOrOpenSlot(slotName: string, displayName: string) {
        let board = whoControlsThis == 'player' ? gameState.playerBoard : gameState.opponentBoard;

        let displayObj = <h4 className="patrollerName">{displayName}: </h4>;

        if (board.patrolZone && board.patrolZone[slotName]) {
            return (
                <div className="patrolSlot">
                    <CardList
                        whoControlsThis={whoControlsThis}
                        listDisplayObj={displayObj}
                        listName={displayName}
                        cardObjects={[board.patrolZone[slotName] as CardData]}
                    />
                </div>
            );
        } else if (whoControlsThis == 'player') {
            return (
                <div className="patrolSlot">
                    {displayObj}
                    <PossibleAction
                        actionName="PatrolChoice"
                        actionTitle="Choose"
                        idName="patrolSlot"
                        idValue={slotName}
                        validateCardOrBuildingId={false}
                    />
                </div>
            );
        }
    }

    return (
        <div>
            <h2>Patrollers:</h2>
            {cardOrOpenSlot('squadLeader', 'Squad Leader')}
            {cardOrOpenSlot('elite', 'Elite')}
            {cardOrOpenSlot('scavenger', 'Scavenger')}
            {cardOrOpenSlot('technician', 'Technician')}
            {cardOrOpenSlot('lookout', 'Lookout')}
        </div>
    );
};
