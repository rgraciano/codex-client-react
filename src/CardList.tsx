import React, { FunctionComponent } from 'react';
import { WhoControlsThis, Updater, StringMap } from './CodexGame';
import { Card } from './Card';

export const CardList: FunctionComponent<{
    whoControlsThis: WhoControlsThis;
    updater: Updater;
    listName: string;
    cardObjects: StringMap[];
}> = ({ whoControlsThis, updater, listName, cardObjects }) => {
    function cards(cardObjects: StringMap[]) {
        return cardObjects.map(cardObj => (
            <Card key={cardObj.cardId} whoControlsThis={whoControlsThis} updater={updater} listName={listName} cardObject={cardObj} />
        ));
    }

    return (
        <div>
            <h2>{listName}:</h2> {cards(cardObjects)}
        </div>
    );
};
