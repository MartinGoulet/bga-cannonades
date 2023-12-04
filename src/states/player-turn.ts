class PlayerTurnState implements StateHandler {
   private can_add_ship: boolean;
   private can_shoot_cannonades: boolean;

   constructor(private game: Cannonades) {}
   onEnteringState({ can_add_ship, can_shoot_cannonades }: PlayerTurnArgs): void {
      if (!this.game.isCurrentPlayerActive()) return;
      this.can_add_ship = can_add_ship;
      this.can_shoot_cannonades = can_shoot_cannonades;

      this.setupBoard();
      this.setupHand();
      this.checkButtons();
   }
   onLeavingState(): void {
      const { hand, board } = this.game.getCurrentPlayerTable();
      board.setSelectionMode("none");
      board.onSelectionChange = undefined;
      hand.setSelectionMode("none");
      hand.onSelectionChange = undefined;
   }
   onUpdateActionButtons({ can_shoot_cannonades }: PlayerTurnArgs): void {
      const handleAdd = () => {
         const selection = this.game.getCurrentPlayerTable().hand.getSelection();
         if (selection.length !== 1) return;
         this.game.takeAction("addShip", { card_id: selection[0].id });
      };
      const handleShoot = () => {
         this.game.setClientState("playerTurnShoot", {
            descriptionmyturn: _("Select an opponent ship"),
            args: {
               card: this.game.getCurrentPlayerTable().hand.getSelection()[0],
            },
         });
      };
      const handleDiscard = () => {
         const selection = this.game.getCurrentPlayerTable().hand.getSelection();
         if (selection.length !== 1) return;
         this.game.takeAction("discardCard", { card_id: selection[0].id });
      };
      const handleBoard = () => {
         this.game.setClientState("playerTurnBoard", {
            descriptionmyturn: _(""),
            args: {},
         });
      };
      const handlePass = () => {
         this.game.takeAction("pass");
      };

      this.game.addPrimaryActionButton("btn_add", _("Add a new ship"), handleAdd);
      if (can_shoot_cannonades) {
         this.game.addPrimaryActionButton("btn_shoot", _("Shoot an opponent's ship"), handleShoot);
      }
      this.game.addPrimaryActionButton("btn_draw", _("Discard a card to draw"), handleDiscard);
      if (can_shoot_cannonades) {
         this.game.addPrimaryActionButton("btn_board", _("Board a ship"), handleBoard);
      }
      this.game.addDangerActionButton("btn_pass", _("Pass"), handlePass);
   }

   private setupBoard() {
      const { hand, board } = this.game.getCurrentPlayerTable();

      const handleSelectBoard = (selection: CannonadesCard[]) => {
         if (selection.length == 1) {
            hand.unselectAll();
         }
         this.checkButtons();
      };

      const selectableCardsBoard = board.getCards().filter((card) => "type_arg" in card);
      board.setSelectionMode("single");
      board.setSelectableCards(selectableCardsBoard);
      board.onSelectionChange = handleSelectBoard;
   }

   private setupHand() {
      const { hand, board } = this.game.getCurrentPlayerTable();

      const handleSelectHand = (selection: CannonadesCard[]) => {
         if (selection.length == 1) {
            board.unselectAll();
         }
         this.checkButtons();
      };

      hand.setSelectionMode("single");
      hand.onSelectionChange = handleSelectHand;
   }

   private checkButtons() {
      const { hand, board } = this.game.getCurrentPlayerTable();
      const [cardBoard, ...otherBoard] = board.getSelection();
      const [cardHand, ...otherHand] = hand.getSelection();

      const canAdd = this.can_add_ship && cardHand && this.game.cardManager.isShip(cardHand);
      const canShoot = this.can_shoot_cannonades && cardHand && this.game.cardManager.isCannonade(cardHand);

      this.game.toggleButton("btn_add", canAdd);
      this.game.toggleButton("btn_shoot", canShoot);
      this.game.toggleButton("btn_draw", cardHand !== undefined);
      this.game.toggleButton("btn_board", cardBoard !== undefined);
   }
}

interface PlayerTurnArgs {
   can_add_ship: boolean;
   can_shoot_cannonades: boolean;
   actions_remaining: number;
}
