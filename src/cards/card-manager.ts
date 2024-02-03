class CannonadesCardManager extends CardManager<CannonadesCard> {
   constructor(public game: Cannonades, prefix: string) {
      super(game, {
         getId: (card) => `${prefix}-${card.id}`,
         setupDiv: (card, div: HTMLDivElement) => {
            div.dataset.type = card.type;
            div.dataset.typeArg = card.type_arg;
         },
         setupFrontDiv: (card, div: HTMLDivElement) => {
            div.dataset.img = "" + this.getImgPos(card);
            if('type' in card) {
               this.game.addTooltipHtml(this.getId(card), this.getTooltip(card), 1000);
            }
         },
         setupBackDiv: (card, div: HTMLDivElement) => {
            div.dataset.img = "0";
         },
         isCardVisible: (card: CannonadesCard) => "type_arg" in card,
         cardWidth: 100 * 1.3,
         cardHeight: 137 * 1.3,
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
   private getTooltip(card: CannonadesCard) {
      return this.isShip(card) ? this.getTooltipShip(card) : this.getTooltipCannonade(card);
   }
   private getTooltipShip(card: CannonadesCard) {
      const {color, captain, count} = this.game.gamedatas.ship_types[Number(card.type_arg)];
      return `<div class="card-tooltip">
         <div class="header">${_('Ship')}</div>
         <table>
            <tr><th>Color</th><td>${color}</td></tr>
            <tr><th>Captain's Grin</th><td>${captain}</td></tr>
            <tr><th>Count</th><td>${count}</td></tr>
            </table>
      </div>`;
   }
   private getTooltipCannonade(card: CannonadesCard) {
      const {colors, count} = this.game.gamedatas.cannonade_types[Number(card.type_arg)];
      return `<div class="card-tooltip">
         <div class="header">${_('Cannonade')}</div>
         <table>
            <tr><th>Colors</th><td>${colors.join(', ')}</td></tr>
            <tr><th>Count</th><td>${count}</td></tr>
         </table>
      </div>`;
   }
}
