class TableCenter {
   public deck: Deck<CannonadesCard>;
   public discard: Deck<CannonadesCard>;
   public played_card: LineStock<CannonadesCard>;

   constructor(private game: Cannonades) {
      this.setupDeck(game);
      this.setupDiscard(game);
      this.setupPlayedCard(game);
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
      this.discard = new Deck<CannonadesCard>(game.cardManager, document.getElementById("discard"), {
         cardNumber: 0,
         counter: {
            hideWhenEmpty: false,
         },
         autoRemovePreviousCards: false,
      });

      this.discard.addCards(game.gamedatas.discard);
   }

   private setupPlayedCard(game: Cannonades) {
      this.played_card = new LineStock<CannonadesCard>(game.cardManager, document.getElementById("played-card"));
   }
}
