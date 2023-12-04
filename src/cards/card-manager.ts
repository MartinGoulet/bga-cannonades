class CannonadesCardManager extends CardManager<CannonadesCard> {
   constructor(public game: Cannonades) {
      super(game, {
         getId: (card) => `card-${card.id}`,
         setupDiv: (card, div: HTMLDivElement) => {
            div.dataset.type = card.type;
            div.dataset.typeArg = card.type_arg;
         },
         setupFrontDiv: (card, div: HTMLDivElement) => {
            div.dataset.img = "" + this.getImgPos(card);
         },
         setupBackDiv: (card, div: HTMLDivElement) => {
            div.dataset.img = "0";
         },
         isCardVisible: (card: CannonadesCard) => "type_arg" in card,
         cardWidth: 100,
         cardHeight: 140,
      });
   }
   getImgPos(card: CannonadesCard) {
      if (this.isShip(card)) {
         return this.game.gamedatas.ship_types[Number(card.type_arg)].img;
      }
      if (this.isCannonade(card)) {
         return this.game.gamedatas.cannonade_types[Number(card.type_arg)].img;
      }
      return 0;
   }
   isShip(card: CannonadesCard) {
      return card.type === "1";
   }
   isCannonade(card: CannonadesCard) {
      return card.type === "2";
   }
   markAsSelected(card: CannonadesCard) {
      this.getCardElement(card)?.classList.add('c-card-selected');
   }
}
