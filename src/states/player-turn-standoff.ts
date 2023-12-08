class PlayerTurnStandoffState implements StateHandler {
   constructor(private game: Cannonades) {}

   onEnteringState(args: any): void {
      this.game.displayStandoff();
      if (!this.game.isCurrentPlayerActive()) return;

      const { discard_faceup: discard } = this.game.tableCenter;
      this.game.tableCenter.displayDiscard(true);

      const handleSelectionChange = (selection: CannonadesCard[]) => {
         this.game.toggleButton("btn_confirm", selection.length === 1);
      };

      discard.setSelectionMode("single");
      discard.setSelectableCards(discard.getCards().filter((card) => this.game.discardManager.isCannonade(card)));
      discard.onSelectionChange = handleSelectionChange;
   }

   onLeavingState(): void {
      this.game.tableCenter.displayDiscard(false);
      const { discard_faceup: discard } = this.game.tableCenter;
      discard.setSelectionMode("none");
      discard.onSelectionChange = undefined;
   }

   onUpdateActionButtons(args: any): void {
      const handleConfirm = () => {
         const { discard_faceup: discard } = this.game.tableCenter;
         const cards = discard.getSelection();
         if (cards.length !== 1) return;
         this.game.takeAction("standoff", { card_id: Number(cards[0].id) });
      };
      this.game.addPrimaryActionButton("btn_confirm", _("Confirm"), handleConfirm);
      this.game.toggleButton("btn_confirm", false);
   }
}
