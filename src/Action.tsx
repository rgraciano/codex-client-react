import React, { useState, FunctionComponent } from 'react';
import { StringMap, GameStateContext, Phase, UpdateContext } from './CodexGame';

export const Action: FunctionComponent<{
    actionName: string;
    actionTitle: string;
    cardOrBuildingId: string;
    extraInfo?: StringMap;
}> = ({ actionName, actionTitle, cardOrBuildingId, extraInfo }) => {
    let callApiAction = (updater: (payload: StringMap) => void, actionName: string, cardId: string, extraInfo?: StringMap) => (
        e: React.MouseEvent<HTMLElement>
    ) => {
        e.preventDefault();

        let payload: StringMap = {};
        payload.actionName = actionName;
        payload.cardId = cardId;

        if (extraInfo) Object.assign(payload, extraInfo);

        updater(payload);
    };

    return (
        <UpdateContext.Consumer>
            {({ handleUpdate }) => (
                <>
                    <li className="cardLI">
                        <a href="#" onClick={callApiAction(handleUpdate, actionName, cardOrBuildingId, extraInfo)}>
                            {actionTitle}
                        </a>
                    </li>
                </>
            )}
        </UpdateContext.Consumer>
    );
};
