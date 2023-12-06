class VendettaFlipState implements StateHandler {
   private player_id: number;

   constructor(private game: Cannonades) {}
   onEnteringState({ player_id, hidden_ships }: VendettaFlipArgs): void {
      this.player_id = player_id;

      const handleSelectionChange = (selection: CannonadesCard[]) => {
         this.game.toggleButton("btn_confirm", selection.length === 1);
      };

      const { board } = this.game.getPlayerTable(this.player_id);
      const selectable = board.getCards().filter((card) => hidden_ships.includes(card['id']));
      board.setSelectionMode("single");
      board.setSelectableCards(selectable);
      board.onSelectionChange = handleSelectionChange;
   }
   onLeavingState(): void {
      const { board } = this.game.getPlayerTable(this.player_id);
      board.setSelectionMode("none");
      board.onSelectionChange = undefined;
   }

   onUpdateActionButtons({ player_id }: VendettaFlipArgs): void {
      const handleConfirm = () => {
         const selection = this.game.getPlayerTable(player_id).board.getSelection();
         if (selection.length !== 1) return;
         this.game.takeAction("vendettaFlipShip", { ship_id: selection[0].id });
      };
      this.game.addPrimaryActionButton("btn_confirm", _("Confirm"), handleConfirm);
      this.game.addActionButtonClientCancel();
   }
}

interface VendettaFlipArgs {
   player_id: number;
   hidden_ships: string[];
}
