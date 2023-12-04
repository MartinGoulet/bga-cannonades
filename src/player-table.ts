class PlayerTable {
   public player_id: number;

   public board: LineStock<CannonadesCard>;
   public hand: HandStock<CannonadesCard>;

   constructor(public game: Cannonades, player: CannonadesPlayerData) {
      this.player_id = Number(player.id);

      const html = `
        <div id="player-table-${player.id}" class="player-table whiteblock" style="--player-color: #${player.color}">
            <div class="c-title">${player.name}</div>
            <div id="player-table-${player.id}-board"></div>
            <div id="player-table-${player.id}-hand"></div>
        </div>`;

      const pos = this.player_id === game.getPlayerId() ? "afterbegin" : "beforeend";
      document.getElementById("tables").insertAdjacentHTML(pos, html);

      this.setupBoard(game);
      this.setupHand(game);
   }

   private setupBoard(game: Cannonades) {
      this.board = new LineStock<CannonadesCard>(
         this.game.cardManager,
         document.getElementById(`player-table-${this.player_id}-board`),
         {}
      );
      this.board.addCards(game.gamedatas.players_info[this.player_id].board);
   }

   private setupHand(game: Cannonades) {
      this.hand = new HandStock<CannonadesCard>(
         this.game.cardManager,
         document.getElementById(`player-table-${this.player_id}-hand`),
         { cardOverlap: "10px", cardShift: "6px", inclination: 6, sort: sortFunction("type", "type_arg") }
      );
      this.hand.addCards(game.gamedatas.players_info[this.player_id].hand);
   }
}
