import React, { FunctionComponent, Component } from 'react';
import { WhoControlsThis, CardData } from './CodexGame';
import { Card } from './Card';
import { TransitionGroup, CSSTransition } from 'react-transition-group'; // https://github.com/reactjs/react-transition-group/blob/master/Migration.md

export const CardList: FunctionComponent<{
    whoControlsThis: WhoControlsThis;
    listName: string;
    listDisplayObj?: React.ReactElement;
    cardObjects: CardData[];
}> = ({ whoControlsThis, listName, listDisplayObj, cardObjects }) => {
    function cards(cardObjects: CardData[]) {
        let objs = cardObjects.map(cardObj => (
            <CSSTransition key={cardObj.cardId} classNames="cardAnimation" timeout={{ enter: 300, exit: 300 }}>
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
            {listDisplayObj || <h2>{listName}: </h2>} {cards(cardObjects)}
        </div>
    );
};
