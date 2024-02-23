class EndGameDebugState implements StateHandler {
   constructor(private game: Cannonades) {}

   onEnteringState(args: EndGameDebugArgs): void {
      if (!this.game.isCurrentPlayerActive()) return;
   }

   onLeavingState(): void {}

   onUpdateActionButtons(args: EndGameDebugArgs): void {
      const handle = () => this.game.takeAction("endGame");
      this.game.addDangerActionButton("btn_end", "End game", handle);
   }
}

interface EndGameDebugArgs {}
