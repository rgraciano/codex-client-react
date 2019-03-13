import React, { FunctionComponent } from 'react';
import { WhoControlsThis, StringMap } from './CodexGame';
import { Card } from './Card';
import { TransitionGroup, CSSTransition } from 'react-transition-group'; // https://github.com/reactjs/react-transition-group/blob/master/Migration.md

export const CardList: FunctionComponent<{
    whoControlsThis: WhoControlsThis;
    listName: string;
    cardObjects: StringMap[];
}> = ({ whoControlsThis, listName, cardObjects }) => {
    function cards(cardObjects: StringMap[]) {
        let objs = cardObjects.map(cardObj => (
            <CSSTransition key={cardObj.cardId} classNames="cardAnimation" timeout={{ enter: 1000, exit: 1000 }}>
                <Card key={cardObj.cardId + 'Card'} whoControlsThis={whoControlsThis} listName={listName} cardObject={cardObj} />
            </CSSTransition>
        ));

        return (
            <TransitionGroup appear={true} enter={true}>
                {objs}
            </TransitionGroup>
        );
    }

    return (
        <div>
            <h2>{listName}:</h2> {cards(cardObjects)}
        </div>
    );
};
