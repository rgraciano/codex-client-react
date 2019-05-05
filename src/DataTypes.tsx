export type PrimitiveMap = {
    [k: string]: string | number | boolean | object;
};

export class StringMap {
    [s: string]: string;
}
export class ObjectMap {
    [s: string]: object;
}

export class Action {
    name: string = '';
    idsToResolve: string[] = [];
    extraState: PrimitiveMap = {};
}

export class Phase {
    actions: Action[] = [];
    static getAction(phase: Phase, actionName: string): Action {
        let action = phase.actions.find((action: Action) => action.name == actionName);
        if (action == undefined) return new Action();
        else return action;
    }
}

export class BoardData {
    [k: string]: any;
    canWorker: boolean = false;
    patrolZone: PrimitiveMap = {};
    gold: number = 1;
    numWorkers: number = 1;
    heroZone: CardData[] = [];
    hand: CardData[] = [];
    inPlay: CardData[] = [];
    playStagingArea: CardData[] = [];
    deck: CardData[] = [];
    discard: CardData[] = [];
}

export class CardData {
    cardId: string = '';
    name: string = '';
    allAttack: number = 1;
    allHealth: number = 1;
    costAfterAlterations: number = 1;
    cardType: string = '';
    canPlay: boolean = false;
    canAttack: boolean = false;
    canPatrol: boolean = false;
    canSideline: boolean = false;
    baseAttributes: AttributeData = {};
    attributeModifiers: AttributeData = {};
    canUseAbilities: boolean[] = [];
    canUseStagingAbilities: boolean[] = [];
    stagingAbilities: string[] = [];
    abilities: string[] = [];
    level: number = 1;
    maxLevel: number = 1;
}

export class AttributeData {
    [k: string]: number;
}

export class GameState {
    opponentBoard: BoardData = new BoardData();
    playerBoard: BoardData = new BoardData();
    phaseStack: Phase[] = [];
    phase: Phase = new Phase();
    events: EventDescriptor[] = [];
    gameStateId: string = '';
}

export class EventDescriptor {
    eventType: string = '';
    description: string = '';
    context: ObjectMap = {};
}
