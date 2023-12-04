class PlayerTurnShootState implements StateHandler {
   constructor(private game: Cannonades) {}
   onEnteringState({ card }: PlayerTurnShoot): void {
      this.game.cardManager.markAsSelected(card);

      const handleSelectionChange = (table: PlayerTable, selection: CannonadesCard[]) => {
         if (selection.length === 1) {
            this.unselectAllOthersBoards(table);
         }
         this.game.toggleButton("btn_confirm", selection.length === 1);
      };

      for (const player_table of this.game.getOpponentsPlayerTable()) {
         player_table.board.setSelectionMode("single");
         player_table.board.onSelectionChange = (selection: CannonadesCard[]) =>
            handleSelectionChange(player_table, selection);
      }
   }
   onLeavingState(): void {
      for (const player_table of this.game.getOpponentsPlayerTable()) {
         player_table.board.setSelectionMode("none");
         player_table.board.onSelectionChange = undefined;
      }
      this.game.getCurrentPlayerTable().hand.unselectAll();
   }
   onUpdateActionButtons({ card }: PlayerTurnShoot): void {
      const handleConfirm = () => {
         const cards = this.game
            .getOpponentsPlayerTable()
            .map((x) => x.board)
            .reduce((cards: CannonadesCard[], curr: CardStock<CannonadesCard>) => {
               curr.getSelection().forEach((c) => cards.push(c));
               return cards;
            }, []);

         if (cards.length !== 1) return;

         this.game.takeAction("shootCannonade", {
            card_id: card.id,
            ship_id: cards[0].id,
         });
      };
      this.game.addPrimaryActionButton("btn_confirm", _("Confirm"), handleConfirm);
      this.game.addActionButtonClientCancel();
   }

   unselectAllOthersBoards(excluded_table: PlayerTable) {
      for (const player_table of this.game.getOpponentsPlayerTable()) {
         if (excluded_table !== player_table) {
            player_table.board.unselectAll();
         }
      }
   }
}

interface PlayerTurnShoot {
   card: CannonadesCard;
}
