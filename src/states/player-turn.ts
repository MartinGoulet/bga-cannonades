class PlayerTurnState implements StateHandler {
   constructor(private game: Cannonades) {}
   onEnteringState(args: any): void {}
   onLeavingState(): void {}
   onUpdateActionButtons({ can_add_ship }: PlayerTurnArgs): void {
      const handleAdd = () => {
         this.game.setClientState("playerTurnAdd", {
            description: _(""),
            args: {},
         });
      };
      const handleShoot = () => {
         this.game.setClientState("playerTurnShoot", {
            description: _(""),
            args: {},
         });
      };
      const handleDraw = () => {
         this.game.setClientState("playerTurnDraw", {
            description: _(""),
            args: {},
         });
      };
      const handleBoard = () => {
         this.game.setClientState("playerTurnBoard", {
            description: _(""),
            args: {},
         });
      };

      this.game.addPrimaryActionButton("btn_add", _("Add a new ship"), handleAdd);
      this.game.addPrimaryActionButton("btn_shoot", _("Shoot an opponent's ship"), handleShoot);
      this.game.addPrimaryActionButton("btn_draw", _("Discard a ship to draw"), handleDraw);
      this.game.addPrimaryActionButton("btn_board", _("Board a ship"), handleBoard);

      this.game.toggleButton("btn_add", can_add_ship);
   }
}

interface PlayerTurnArgs {
   can_add_ship: boolean;
}
