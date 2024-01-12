class VendettaDiscardCardState implements StateHandler {
   constructor(private game: Cannonades) {}

   onEnteringState(args: VendettaDiscardCardArgs): void {
      if (!this.game.isCurrentPlayerActive()) return;

      const { hand } = this.game.getCurrentPlayerTable();

      const handleSelectionChange = (selection: CannonadesCard[]) => {
         this.game.toggleButton("btn_confirm", selection.length === 1);
      };

      hand.setSelectionMode("single");
      hand.onSelectionChange = handleSelectionChange;
   }

   onLeavingState(): void {
      const { hand } = this.game.getCurrentPlayerTable();
      hand.setSelectionMode("none");
      hand.onSelectionChange = undefined;
   }

   onUpdateActionButtons(args: VendettaDiscardCardArgs): void {
      const { hand } = this.game.getCurrentPlayerTable();

      const handleConfirm = () => {
         const cards = hand.getSelection();
         if (cards.length !== 1) return;
         this.game.takeAction("discardCardForVendetta", { card_id: cards[0].id });
      };

      this.game.addPrimaryActionButton("btn_confirm", _("Confirm"), handleConfirm);
      this.game.toggleButton('btn_confirm', false);
   }
}

interface VendettaDiscardCardArgs {}
