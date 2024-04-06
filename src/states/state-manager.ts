class StateManager {
   private readonly states: Record<string, StateHandler>;

   constructor(private game: Cannonades) {
      this.states = {
         vendettaDiscardCard: new VendettaDiscardCardState(game),
         playerTurn: new PlayerTurnState(game),
         playerTurnShoot: new PlayerTurnShootState(game),
         playerTurnBoard: new PlayerTurnShootState(game),
         playerTurnDiscard: new PlayerTurnDiscardState(game),
         playerTurnStandoff: new PlayerTurnStandoffState(game),
         vendetta: new VendettaState(game),
         vendettaFlip: new VendettaFlipState(game),
         vendedtaDiscardCard: new VendettaDiscardCardState(game),
         endGameDebug: new EndGameDebugState(game),
      };
   }

   onEnteringState(stateName: string, args: any): void {
      // console.log(`Entering state: ${stateName}`);
      // console.log(`|- args :`, args?.args);
      if (this.states[stateName] !== undefined) {
         this.states[stateName].onEnteringState(args.args);
      }
   }

   onLeavingState(stateName: string): void {
      // console.log(`Leaving state: ${stateName}`);
      if (this.states[stateName] !== undefined) {
         document.getElementById("customActions").innerHTML = "";
         this.states[stateName].onLeavingState();
      }
      document.querySelectorAll(".c-card-selected").forEach((div) => div.classList.remove("c-card-selected"));
   }

   onUpdateActionButtons(stateName: string, args: any): void {
      // console.log(`Update action buttons: ${stateName}`);
      if (this.states[stateName] !== undefined && this.game.isCurrentPlayerActive()) {
         this.states[stateName].onUpdateActionButtons(args);
      }
   }
}
