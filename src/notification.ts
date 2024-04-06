class NotificationManager {
   constructor(private game: Cannonades) {}

   setup() {
      const notifs: [string, number?][] = [
         ["onAddShip", undefined],
         ["onDiscardCard", 750],
         ["onDiscardHand", 750],
         ["onDrawCards", undefined],
         ["onPlayCard", 750],
         ["onRevealShip", 750],
         ["onUpdateScore", 10],
         ["playerEliminated", 100],
      ];

      this.setupNotifications(notifs);

      ["message", "onDrawCards"].forEach((eventName) => {
         this.game.notifqueue.setIgnoreNotificationCheck(
            eventName,
            (notif) => notif.args.excluded_player_id && notif.args.excluded_player_id == this.game.player_id
         );
      });
   }

   private async notif_onAddShip({ card_id, player_id }: AddShipArgs) {
      await this.game.getPlayerTable(player_id).board.addCard({ id: card_id.toString() } as CannonadesCard);
   }

   private notif_onDiscardCard({ card, player_id }: DiscardCardArgs) {
      this.game.tableCenter.discard.addCard(card);
   }

   private notif_onDiscardHand({ cards, player_id }: DiscardHandArgs) {
      this.game.tableCenter.discard.addCards(cards);
   }

   private async notif_onDrawCards({ cards, player_id, discard }: DrawCardsArgs) {
      if(discard) {
         await this.game.getPlayerTable(player_id).hand.addCards(cards, { fromStock: this.game.tableCenter.discard });
      } else {
         await this.game.getPlayerTable(player_id).hand.addCards(cards, { fromStock: this.game.tableCenter.deck });
      }
   }

   private notif_onPlayCard({ card, player_id }: PlayCardArgs) {
      this.game.tableCenter.played_card.addCard(card, {});
   }

   private notif_onRevealShip({ card, player_id }: RevealShipArgs) {
      this.game.getPlayerTable(player_id).board.flipCard(card);
   }

   private notif_playerEliminated(args: NotifPlayerEliminatedArgs) {
      const player_id = Number(args.who_quits);
      this.game.eliminatePlayer(player_id);
   }

   private notif_onUpdateScore({player_id, player_score}: UpdateScoreArgs) {
      this.game.scoreCtrl[player_id].toValue(player_score);
   }

   private setupNotifications(notifs: any) {
      notifs.forEach(([eventName, duration]) => {
         dojo.subscribe(eventName, this, (notifDetails: INotification<any>) => {
            // console.log(`notif_${eventName}`, notifDetails.args);
            const promise = this[`notif_${eventName}`](notifDetails.args);
            // tell the UI notification ends, if the function returned a promise
            promise?.then(() => this.game.notifqueue.onSynchronousNotificationEnd());
         });
         this.game.notifqueue.setSynchronous(eventName, duration);
      });
   }
}

interface AddShipArgs {
   player_id: number;
   card_id: number;
}

interface DiscardCardArgs {
   player_id: number;
   card: CannonadesCard;
}

interface DiscardHandArgs {
   player_id: number;
   cards: CannonadesCard[];
}

interface DrawCardsArgs {
   player_id: number;
   cards: CannonadesCard[];
   discard: boolean;
}

interface PlayCardArgs {
   player_id: number;
   card: CannonadesCard;
}

interface RevealShipArgs {
   player_id: number;
   card: CannonadesCard;
}

interface UpdateScoreArgs {
   player_id: number;
   player_score: number;
}

interface NotifPlayerEliminatedArgs {
   who_quits: number;
   player_name: string;
}
