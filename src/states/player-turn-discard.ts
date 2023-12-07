class PlayerTurnDiscardState implements StateHandler {
   
   constructor(private game: Cannonades) {}

   onEnteringState({ nbr }: PlayerTurnDiscardArgs): void {
      if (!this.game.isCurrentPlayerActive()) return;

      const { hand } = this.game.getCurrentPlayerTable();

      const handleSelectionChange = (selection: CannonadesCard[]) => {
         this.game.toggleButton("btn_confirm", selection.length === nbr);
      };

      hand.setSelectionMode("multiple");
      hand.onSelectionChange = handleSelectionChange;
   }

   onLeavingState(): void {
      const { hand } = this.game.getCurrentPlayerTable();
      hand.setSelectionMode("none");
      hand.onSelectionChange = undefined;
   }

   onUpdateActionButtons({ nbr }: PlayerTurnDiscardArgs): void {
      const handleConfirm = () => {
         const { hand } = this.game.getCurrentPlayerTable();
         const cards = hand.getSelection();
         if (cards.length !== nbr) return;

         const card_ids = cards.map((card) => card.id).join(";");

         this.game.takeAction("discard", { card_ids });
      };
      this.game.addPrimaryActionButton("btn_confirm", _("Confirm"), handleConfirm);
      this.game.toggleButton("btn_confirm", false);
   }
}

interface PlayerTurnDiscardArgs {
   nbr: number;
}
