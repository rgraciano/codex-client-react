import React, { FunctionComponent } from 'react';
import { WhoControlsThis, StringMap } from './CodexGame';
import { Card } from './Card';
import { TransitionGroup, CSSTransition } from 'react-transition-group'; // https://github.com/reactjs/react-transition-group/blob/master/Migration.md

export const PatrolZone: FunctionComponent<{
    whoControlsThis: WhoControlsThis;
    listName: string;
    cardObjects: StringMap[];
}> = ({ whoControlsThis, listName, cardObjects }) => {
    return (
        <div className="playerPatrollers">
            <div>
                <h2>Patrollers:</h2>
            </div>
        </div>
    );
};
