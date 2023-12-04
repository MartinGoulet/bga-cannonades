class Cannonades implements ebg.core.gamegui {
   public stateManager: StateManager;
   public cardManager: CannonadesCardManager;
   public notifManager: NotificationManager;
   public playersTables: PlayerTable[];
   public tableCenter: TableCenter;
   public gamedatas: CannonadesGamedatas;

   public setup(gamedatas: CannonadesGamedatas) {
      this.stateManager = new StateManager(this);
      this.cardManager = new CannonadesCardManager(this);
      this.notifManager = new NotificationManager(this);
      this.tableCenter = new TableCenter(this);
      this.createPlayerTables(gamedatas);
      this.setupNotifications();
      document.getElementById("maintitlebar_content").insertAdjacentHTML("beforeend", "<div id='customActions'></div>");
   }
   public onEnteringState(stateName: string, args: any) {
      this.stateManager.onEnteringState(stateName, args);
   }
   public onLeavingState(stateName: string) {
      this.stateManager.onLeavingState(stateName);
   }
   public onUpdateActionButtons(stateName: string, args: any) {
      this.stateManager.onUpdateActionButtons(stateName, args);
   }
   public setupNotifications() {
      this.notifManager.setup();
   }

   private createPlayerTables(gamedatas: CannonadesGamedatas) {
      this.playersTables = [];
      gamedatas.playerorder.forEach((player_id) => {
         const player = gamedatas.players[Number(player_id)];
         const table = new PlayerTable(this, player);
         this.playersTables.push(table);
         if (player.eliminated) {
            setTimeout(() => this.eliminatePlayer(Number(player_id)), 200);
         }
      });
   }

   public addPrimaryActionButton(id, text, callback, zone = "customActions"): void {
      if (!document.getElementById(id)) {
         this.addActionButton(id, text, callback, null, false, "blue");
      }
   }

   public addSecondaryActionButton(id, text, callback, zone = "customActions"): void {
      if (!document.getElementById(id)) {
         this.addActionButton(id, text, callback, null, false, "gray");
      }
   }

   public addDangerActionButton(id, text, callback, zone = "customActions"): void {
      if (!document.getElementById(id)) {
         this.addActionButton(id, text, callback, null, false, "red");
      }
   }

   public addActionButtonClientCancel() {
      const handleCancel = (evt: any): void => {
         evt.stopPropagation();
         evt.preventDefault();
         this.restoreGameState();
      };
      this.addSecondaryActionButton("btnCancelAction", _("Cancel"), handleCancel);
   }

   public eliminatePlayer(player_id: number) {
      this.gamedatas.players[player_id].eliminated = 1;
      document.getElementById(`overall_player_board_${player_id}`).classList.add("eliminated-player");
      document.getElementById(`player-table-${player_id}`).classList.add("eliminated-player");
   }

   public getPlayerId(): number {
      return Number(this.player_id);
   }

   public getPlayerTable(playerId: number): PlayerTable {
      return this.playersTables.find((playerTable) => playerTable.player_id === playerId);
   }

   public getCurrentPlayerTable() {
      return this.getPlayerTable(this.getPlayerId());
   }

   public getOpponentsPlayerTable(): PlayerTable[] {
      const playerId = this.getPlayerId();
      return this.playersTables.filter((playerTable) => playerTable.player_id !== playerId);
   }

   private async restoreGameState() {
      this.restoreServerGameState();
   }

   public toggleButton(id: string, enabled: boolean): void {
      document.getElementById(id)?.classList.toggle("disabled", !enabled);
   }

   public takeAction(
      action: string,
      data?: any,
      onSuccess?: (result: any) => void,
      onComplete?: (is_error: boolean) => void
   ) {
      data = data || {};
      data.lock = true;
      onSuccess = onSuccess ?? function (result: any) {};
      onComplete = onComplete ?? function (is_error: boolean) {};
      this.ajaxcall(`/cannonadesmg/cannonadesmg/${action}.html`, data, this, onSuccess, onComplete);
   }
}
