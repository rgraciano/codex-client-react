import React, { useState, FunctionComponent } from 'react';
import { StringMap, GameStateContext, Phase, UpdateContext } from './CodexGame';

export const Action: FunctionComponent<{
    actionName: string;
    actionTitle: string;
    idValue?: string;
    idName?: string;
    extraInfo?: StringMap;
}> = ({ actionName, actionTitle, idValue, idName, extraInfo }) => {
    let callApiAction = (
        updater: (payload: StringMap) => void,
        actionName: string,
        idValue?: string,
        idName?: string,
        extraInfo?: StringMap
    ) => (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        let payload: StringMap = {};
        payload.actionName = actionName;

        if (idName && idValue) payload[idName] = idValue;

        if (extraInfo) Object.assign(payload, extraInfo);

        updater(payload);
    };

    return (
        <UpdateContext.Consumer>
            {({ handleUpdate }) => (
                <>
                    <li className="cardLI">
                        <a href="#" onClick={callApiAction(handleUpdate, actionName, idValue, idName, extraInfo)}>
                            {actionTitle}
                        </a>
                    </li>
                </>
            )}
        </UpdateContext.Consumer>
    );
};
