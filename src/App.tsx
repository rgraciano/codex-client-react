import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

export class StringMap { [s: string]: string; }

class Card extends Component<{cardName: string, cardId: string}> {
    render() {
        return (
            <span className="Card" key={this.props.cardId}>[{this.props.cardName}]&nbsp;&nbsp;</span>
        );
    }
}

class Patroller extends Component<{patrollerSlot:string, cardName: string, cardId: string}> {
    render() {
        return (
            <div>
                <h3>{this.props.patrollerSlot}: <Card cardName={this.props.cardName} cardId={this.props.cardId} /></h3>
            </div>
        )
    }
}

export class CardList extends Component<{listName: string, cardObjects: StringMap[]}> {

    cards(cardObjects: StringMap[]) {
        return cardObjects.map(cardObj => <Card cardId={cardObj.cardId} cardName={cardObj.cardName}></Card>);
    }

    render() {
        return (
           <div>{this.props.listName}: { this.cards(this.props.cardObjects) }</div>
        );
    }
}

export class CodexGame extends Component {
    render() {
        return(
            <div>
                <div>
                    <h1>Opponent Board</h1>
                    <h2>Patrollers</h2>
                    <h3>Squad Leader: </h3>
                </div>
            </div>
        )
    };
}

export default CardList;
