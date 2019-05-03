import React, { FunctionComponent } from 'react';
import { EventDescriptor } from './DataTypes';
import { TransitionGroup, CSSTransition } from 'react-transition-group'; // https://github.com/reactjs/react-transition-group/blob/master/Migration.md

export const Events: FunctionComponent<{
    eventDescriptors: EventDescriptor[];
}> = ({ eventDescriptors }) => {
    function events() {
        if (!eventDescriptors || eventDescriptors.length < 1) return null;

        let eventObjs = eventDescriptors.map(ed => (
            <CSSTransition classNames="cardAnimation" timeout={{ enter: 300, exit: 300 }}>
                <div>{ed.description}</div>
            </CSSTransition>
        ));

        return (
            <TransitionGroup appear={true} enter={true}>
                {eventObjs}
            </TransitionGroup>
        );
    }

    return <div className="eventDescriptors">{events()}</div>;
};
