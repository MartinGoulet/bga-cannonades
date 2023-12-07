class PlayerTurnState implements StateHandler {
   private can_add_ship: boolean;
   private can_shoot_cannonades: boolean;

   constructor(private game: Cannonades) {}

   onEnteringState({ can_add_ship, can_shoot_cannonades }: PlayerTurnArgs): void {
      if (!this.game.isCurrentPlayerActive()) return;
      this.can_add_ship = can_add_ship;
      this.can_shoot_cannonades = can_shoot_cannonades;

      this.setupBoard();
      this.setupHand(can_shoot_cannonades);
      this.checkButtons();
   }

   onLeavingState(): void {
      const { hand, board } = this.game.getCurrentPlayerTable();
      board.setSelectionMode("none");
      board.onSelectionChange = undefined;
      hand.setSelectionMode("none");
      hand.onSelectionChange = undefined;
   }

   onUpdateActionButtons(args: PlayerTurnArgs): void {
      this.addButtonAdd();
      this.addButtonShoot(args);
      this.addButtonDiscard(args);
      this.addButtonBoard(args);
      this.addButtonPass(args);
   }

   private addButtonAdd() {
      const handleAdd = () => {
         const selection = this.game.getCurrentPlayerTable().hand.getSelection();
         if (selection.length !== 1) return;
         this.game.takeAction("addShip", { card_id: selection[0].id });
      };

      this.game.addPrimaryActionButton("btn_add", _("Add a new ship"), handleAdd);
   }

   private addButtonBoard({ can_shoot_cannonades }: PlayerTurnArgs) {
      if (!can_shoot_cannonades) return;

      const handleBoardDanger = () => {
         this.game.confirmationDialog(
            "You will be eliminated from this game since it's your last ship. Do you want to continue?",
            () => handleBoard()
         );
      };

      const handleBoard = () => {
         this.game.setClientState("playerTurnBoard", {
            descriptionmyturn: _("Select an opponent ship"),
            args: {
               card: this.game.getCurrentPlayerTable().board.getSelection()[0],
               action: "boardShip",
            } as PlayerTurnShootArgs,
         });
      };

      if (this.game.getCurrentPlayerTable().board.getCards().length === 1) {
         this.game.addDangerActionButton("btn_board", _("Board a ship"), handleBoardDanger);
      } else {
         this.game.addPrimaryActionButton("btn_board", _("Board a ship"), handleBoard);
      }
   }

   private addButtonDiscard({ can_shoot_cannonades, actions_remaining }: PlayerTurnArgs) {
      const handleDiscardVerification = () => {
         const willLoseGame =
            !can_shoot_cannonades &&
            actions_remaining == 1 &&
            this.game.getCurrentPlayerTable().board.getCards().length == 0;
         if (willLoseGame) {
            this.game.confirmationDialog(_("You will be eliminated if you don't add a ship on your board."), () =>
               handleDiscard()
            );
         } else {
            handleDiscard();
         }
      };
      const handleDiscard = () => {
         const selection = this.game.getCurrentPlayerTable().hand.getSelection();
         if (selection.length !== 1) return;
         this.game.takeAction("discardCard", { card_id: selection[0].id });
      };

      this.game.addPrimaryActionButton("btn_draw", _("Discard a card to draw"), handleDiscardVerification);
   }

   private addButtonPass({ can_shoot_cannonades }: PlayerTurnArgs) {
      const {board} = this.game.getCurrentPlayerTable();

      const handlePass = () => {
         if (!can_shoot_cannonades && board.getCards().length == 0) {
            this.game.confirmationDialog(_("You will be eliminated if you don't add a ship on your board."), () =>
               this.game.takeAction("pass")
            );
         } else {
            this.game.takeAction("pass");
         }
      };
      this.game.addDangerActionButton("btn_pass", _("Pass"), handlePass);
   }

   private addButtonShoot({ can_shoot_cannonades }: PlayerTurnArgs) {
      if (!can_shoot_cannonades) return;

      const handleShoot = () => {
         this.game.setClientState("playerTurnShoot", {
            descriptionmyturn: _("Select an opponent ship"),
            args: {
               card: this.game.getCurrentPlayerTable().hand.getSelection()[0],
               action: "shootCannonade",
            } as PlayerTurnShootArgs,
         });
      };

      if (can_shoot_cannonades) {
         this.game.addPrimaryActionButton("btn_shoot", _("Shoot an opponent's ship"), handleShoot);
      }
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
