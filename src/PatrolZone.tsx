import React, { FunctionComponent, useContext } from 'react';
import { WhoControlsThis, StringMap, GameStateContext } from './CodexGame';
import { PossibleAction } from './PossibleAction';
import { CardList } from './CardList';

export const PatrolZone: FunctionComponent<{
    whoControlsThis: WhoControlsThis;
}> = ({ whoControlsThis }) => {
    const gameState = useContext(GameStateContext);

    function cardOrOpenSlot(slotName: string, displayName: string) {
        let board = whoControlsThis == 'player' ? gameState.playerBoard : gameState.opponentBoard;

        if (board.patrolZone && board.patrolZone[slotName]) {
            return (
                <div className="patrolSlot">
                    <h4 className="patrollerName">{displayName}: </h4>
                    <CardList
                        whoControlsThis={whoControlsThis}
                        listName={displayName}
                        cardObjects={[board.patrolZone[slotName] as StringMap]}
                    />
                </div>
            );
        } else if (whoControlsThis == 'player') {
            return (
                <div className="patrolSlot">
                    <h4 className="patrollerName">{displayName}: </h4>
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
