class TableCenter {
   public deck: Deck<CannonadesCard>;
   public discard: StockDiscard<CannonadesCard>;
   public discard_faceup: LineStock<CannonadesCard>;
   public played_card: LineStock<CannonadesCard>;

   constructor(private game: Cannonades) {
      this.setupDeck(game);
      this.setupDiscard(game);
      this.setupPlayedCard(game)
      const divTable = document.getElementById("table");
      divTable.dataset.nbrPlayers = this.game.gamedatas.players_order.length.toString();
   }

   public displayDiscard(visible: boolean) {
      const divTable = document.getElementById("table");
      divTable.dataset.display_discard = visible ? "true" : "false";
   }

   private setupDeck(game: Cannonades) {
      this.deck = new Deck<CannonadesCard>(game.cardManager, document.getElementById("deck"), {
         cardNumber: game.gamedatas.deck_count,
         topCard: { id: `deck-visible-fake-card` } as CannonadesCard,
         counter: {
            hideWhenEmpty: false,
         },
         fakeCardGenerator: (deckId) => ({ id: `${deckId}-visible-fake-card` } as CannonadesCard),
      });
   }

   private setupDiscard(game: Cannonades) {
      const html = `<div id="discard-display-wrapper" class="whiteblock">
         <div class="c-title">${_("Discard")}</div>
         <div id="discard-display"></div>
      </div>`;
      document.getElementById("zones").insertAdjacentHTML("beforeend", html);

      this.discard_faceup = new LineStock<CannonadesCard>(
         game.discardManager,
         document.getElementById("discard-display"),
         {
            gap: "2px",
            center: false,
         }
      );

      this.discard = new StockDiscard<CannonadesCard>(game.cardManager, document.getElementById("discard"));

      this.discard.onAddCard = (card: CannonadesCard) => {
         this.discard_faceup.addCard(card);
      };
      this.discard.onRemoveCard = (card: CannonadesCard) => {
         this.discard_faceup.removeCard(card);
      };

      this.discard.addCards(game.gamedatas.discard);

      document
         .getElementById("discard")
         .insertAdjacentHTML("afterbegin", `<div id="eye-icon-discard" class="eye-icon discard"></div>`);

      const tableElement = document.getElementById("table");
      document.getElementById("eye-icon-discard").addEventListener("click", () => {
         tableElement.dataset.display_discard = tableElement.dataset.display_discard == "false" ? "true" : "false";
      });
   }

   private setupPlayedCard(game: Cannonades) {
      this.played_card = new LineStock<CannonadesCard>(game.cardManager, document.getElementById("played-card"));
   }

}
