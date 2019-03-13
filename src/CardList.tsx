import React, { FunctionComponent } from 'react';
import { WhoControlsThis, StringMap } from './CodexGame';
import { Card } from './Card';

export const CardList: FunctionComponent<{
    whoControlsThis: WhoControlsThis;
    listName: string;
    cardObjects: StringMap[];
}> = ({ whoControlsThis, listName, cardObjects }) => {
    function cards(cardObjects: StringMap[]) {
        return cardObjects.map(cardObj => (
            <Card key={cardObj.cardId} whoControlsThis={whoControlsThis} listName={listName} cardObject={cardObj} />
        ));
    }

    return (
        <div>
            <h2>{listName}:</h2> {cards(cardObjects)}
        </div>
    );
};
