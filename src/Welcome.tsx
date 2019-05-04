import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

export const Welcome: FunctionComponent<{}> = ({}) => {
    return (
        <div>
            <div>
                <Link to="/newgame">New Game</Link>
            </div>
        </div>
    );
};
