class Cannonades implements ebg.core.gamegui {
   public stateManager: StateManager;
   public playersTables: PlayerTable[];

   public setup(gamedatas: CannonadesGamedatas) {
      this.stateManager = new StateManager(this);
      this.createPlayerTables(gamedatas);
      this.setupNotifications();
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
   public setupNotifications() {}

   private createPlayerTables(gamedatas: CannonadesGamedatas) {
      this.playersTables = [];
      gamedatas.playerorder.forEach((player_id) => {
         const player = gamedatas.players[Number(player_id)];
         const table = new PlayerTable(this, player);
         this.playersTables.push(table);
      });
   }

   public addPrimaryActionButton(id, text, callback): void {
      if (!document.getElementById(id)) {
         this.addActionButton(id, text, callback, null, false, "blue");
      }
   }

   public addSecondaryActionButton(id, text, callback): void {
      if (!document.getElementById(id)) {
         this.addActionButton(id, text, callback, null, false, "gray");
      }
   }

   public addDangerActionButton(id, text, callback): void {
      if (!document.getElementById(id)) {
         this.addActionButton(id, text, callback, null, false, "red");
      }
   }

   public toggleButton(id: string, enabled: boolean): void {
      document.getElementById(id)?.classList.toggle('disabled', !enabled);
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
