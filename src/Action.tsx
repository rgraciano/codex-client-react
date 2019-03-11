import React, { useState, FunctionComponent } from 'react';
import { Updater, StringMap, GameStateContext, Phase } from './CodexGame';

export const Action: FunctionComponent<{
    updater: Updater;
    actionName: string;
    actionTitle: string;
    cardOrBuildingId: string;
    extraInfo?: StringMap;
}> = ({ updater, actionName, actionTitle, cardOrBuildingId, extraInfo }) => {
    let callApiAction = (actionName: string, cardId: string, extraInfo?: StringMap) => (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        let payload: StringMap = {};
        payload.actionName = actionName;
        payload.cardId = cardId;

        if (extraInfo) Object.assign(payload, extraInfo);

        updater(payload);
    };

    return (
        <li className="cardLI">
            <a href="#" onClick={callApiAction(actionName, cardOrBuildingId, extraInfo)}>
                {actionTitle}
            </a>
        </li>
    );
};
