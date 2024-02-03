class Cannonades implements ebg.core.gamegui {
   public stateManager: StateManager;
   public cardManager: CannonadesCardManager;
   public discardManager: CannonadesCardManager;
   public notifManager: NotificationManager;
   public playersTables: PlayerTable[];
   public tableCenter: TableCenter;
   public gamedatas: CannonadesGamedatas;

   public setup(gamedatas: CannonadesGamedatas) {
      const maintitlebar = document.getElementById("maintitlebar_content");
      maintitlebar.insertAdjacentHTML("beforeend", "<div id='customActions'></div>");
      maintitlebar.insertAdjacentHTML("beforeend", `<div id='standoff'>${_("Standoff")}</div>`);

      this.stateManager = new StateManager(this);
      this.cardManager = new CannonadesCardManager(this, "card");
      this.discardManager = new CannonadesCardManager(this, "discard-card");
      this.notifManager = new NotificationManager(this);
      this.tableCenter = new TableCenter(this);
      this.createPlayerTables(gamedatas);
      this.setupNotifications();
      this.addReloadButton();

      if (gamedatas.is_standoff) {
         this.displayStandoff();
      }
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

   private addReloadButton() {
      // add reload Css debug button
      const parent = document.querySelector('.debug_section');
      if (parent) {
         this.addActionButton('reload_css', _('Reload CSS'), () => reloadCss(), parent, null, 'gray');
      }
   }

   private createPlayerTables(gamedatas: CannonadesGamedatas) {
      this.playersTables = [];
      gamedatas.players_order.forEach((player_id, index) => {
         const player = gamedatas.players[Number(player_id)];
         const table = new PlayerTable(this, player, index === 0);
         this.playersTables.push(table);
         if (player.eliminated) {
            setTimeout(() => this.eliminatePlayer(Number(player_id)), 200);
         }
      });
   }

   public addPrimaryActionButton(id, text, callback, zone = "customActions"): void {
      if (!document.getElementById(id)) {
         this.addActionButton(id, text, callback, zone, false, "blue");
      }
   }

   public addSecondaryActionButton(id, text, callback, zone = "customActions"): void {
      if (!document.getElementById(id)) {
         this.addActionButton(id, text, callback, zone, false, "gray");
      }
   }

   public addDangerActionButton(id, text, callback, zone = "customActions"): void {
      if (!document.getElementById(id)) {
         this.addActionButton(id, text, callback, zone, false, "red");
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

   public displayStandoff() {
      document.getElementsByTagName("body")[0].dataset.standoff = "true";
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
      this.ajaxcall(`/cannonades/cannonades/${action}.html`, data, this, onSuccess, onComplete);
   }

   ///////////////////////////////////////////////////
   //// Logs

   /* @Override */
   format_string_recursive(log: string, args: any) {
      try {
         if (log && args && !args.processed) {
            args.processed = true;

            if (args.card_image !== undefined) {
               const img_pos = this.cardManager.getImgPos(args.card_image);
               args.card_image = `<div class="card card-log">
                  <div class="card-sides">
                     <div class="card-side front" data-img="${img_pos}"></div>
                  </div>
               </div>`;
            }
         }
      } catch (e) {
         console.error(log, args, "Exception thrown", e.stack);
      }

      return this.inherited(arguments);
   }
}

// this goes outside dojo class - before or after
function reloadCss() {
   const links = document.getElementsByTagName('link');
   for (var cl in links) {
      var link = links[cl];
      if (link.rel === 'stylesheet' && link.href.includes('99999')) {
         var index = link.href.indexOf('?timestamp=');
         var href = link.href;
         if (index >= 0) {
            href = href.substring(0, index);
         }

         link.href = href + '?timestamp=' + Date.now();

         console.log('reloading ' + link.href);
      }
   }
}