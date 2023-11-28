class StateManager {
    private readonly states: Record<string, StateHandler>;

    constructor(private game: Cannonades) {
        this.states = {
            playerTurn: new PlayerTurnState(game),
        };
    }

    onEnteringState(stateName: string, args: any): void {
        console.log(`Entering state: ${stateName}`);
        if (this.states[stateName] !== undefined) {
            this.states[stateName].onEnteringState(args.args);
        }
    }

    onLeavingState(stateName: string): void {
        console.log(`Leaving state: ${stateName}`);
        if (this.states[stateName] !== undefined) {
            this.states[stateName].onLeavingState();
        }
    }

    onUpdateActionButtons(stateName: string, args: any): void {
        console.log(`Update action buttons: ${stateName}`);
        if (this.game.isCurrentPlayerActive()) {
            this.states[stateName].onUpdateActionButtons(args);
        }
    }
}
