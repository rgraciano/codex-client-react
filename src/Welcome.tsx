import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { findDOMNode } from 'react-dom';

export const Welcome: FunctionComponent<{}> = ({}) => {
    function getSpecSelect() {
        return (
            <select>
                <option id="spec1" value="Bashing">
                    Bashing
                </option>
                <option id="spec2" value="Finesse">
                    Finesse
                </option>
            </select>
        );
    }

    return (
        <div>
            <div>
                <h1>Player 1 Spec:</h1>
                {getSpecSelect()}
                <h1>Player 2 Spec:</h1>
                {getSpecSelect()}
                <br />
                <br />
                <br />
                <br />
                <Link to="/newgame/">New Game</Link>
            </div>
        </div>
    );
};
