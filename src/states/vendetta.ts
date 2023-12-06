class VendettaState implements StateHandler {
   constructor(private game: Cannonades) {}
   onEnteringState(args: any): void {}
   onLeavingState(): void {}
   onUpdateActionButtons(args: VendettaArgs): void {
      console.log(args);
      this.addButtonDraw();
      this.addButtonDiscard(args);
      this.addButtonFlip(args);
   }

   private addButtonDraw() {
      const handleDraw = () => this.game.takeAction("vendettaDrawCard");
      this.game.addPrimaryActionButton("btn_draw", _("Draw a card"), handleDraw);
   }

   private addButtonDiscard({ player_name, player_hand_count }: VendettaArgs) {
      const handleDiscard = () => this.game.takeAction("vendettaDiscardCard");

      this.game.addPrimaryActionButton(
         "btn_discard",
         _("${player_name} discard a card").replace("${player_name}", player_name),
         handleDiscard
      );
      this.game.toggleButton("btn_discard", player_hand_count > 0);
   }

   private addButtonFlip({ player_id, player_name, hidden_ships }: VendettaArgs) {
      const handleFlip = () => {
         if (hidden_ships.length === 1) {
            this.game.takeAction("vendettaFlipShip", { ship_id: hidden_ships[0] });
         } else {
            this.game.setClientState("vendettaFlip", {
               descriptionmyturn: _("Select a ship to flip"),
               args: {
                  player_id,
                  hidden_ships,
               },
            });
         }
      };

      this.game.addPrimaryActionButton(
         "btn_flip",
         _("${player_name} turn a ship face up").replace("${player_name}", player_name),
         handleFlip
      );

      this.game.toggleButton("btn_flip", hidden_ships.length > 0);
   }
}

interface VendettaArgs {
   player_id: number;
   player_name: string;
   player_hand_count: number;
   hidden_ships: string[];
}
