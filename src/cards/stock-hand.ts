class StockHand<T> extends HandStock<T> {
   constructor(manager: CardManager<T>, element: HTMLElement) {
      super(manager, element, {
         cardOverlap: "30px",
         cardShift: "6px",
         inclination: 6,
         sort: sortFunction("type", "type_arg", "id"),
      });
   }

   public addCard(card: T, animation?: CardAnimation<T>, settings?: AddCardSettings): Promise<boolean> {
      const copy: T = { ...card };

      return new Promise<boolean>((resolve) => {
         super
            .addCard(copy, animation, settings)
            .then(() => {
               const count = this.getCards().length;
               this.element.dataset.count = count.toString();
            })
            .then(() => resolve(true));
      });
   }

   public async removeCard(card: T, settings?: RemoveCardSettings): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
         super
            .removeCard(card, settings)
            .then(() => {
               const count = this.getCards().length;
               this.element.dataset.count = count.toString();
            })
            .then(() => resolve(true));
      });
   }
}
