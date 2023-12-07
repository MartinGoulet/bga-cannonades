class StockDiscard<T> extends Deck<T> {
   public onAddCard: (card: T) => void;
   public onRemoveCard: (card: T) => void;

   constructor(manager: CardManager<T>, element: HTMLElement) {
      super(manager, element, {
         cardNumber: 0,
         counter: {
            hideWhenEmpty: false,
         },
         autoRemovePreviousCards: false,
      });
   }

   public addCard(card: T, animation?: CardAnimation<T>, settings?: AddCardToDeckSettings): Promise<boolean> {
      this.onAddCard({ ...card });
      return super.addCard(card, animation, settings);
   }

   public removeCard(card: T, settings?: RemoveCardSettings): Promise<boolean> {
      this.onRemoveCard({ ...card });
      return super.removeCard(card, settings);
   }
}
