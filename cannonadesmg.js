var PlayerTable = (function () {
    function PlayerTable(game, player) {
        this.game = game;
        this.player_id = Number(player.id);
        var html = "<div id=\"player-table-".concat(player.id, "\" class=\"player-table whiteblock\" style=\"--player-color: #").concat(player.color, "\">\n            <h3>").concat(player.name, "</h3>\n        </div>");
        document.getElementById("tables").insertAdjacentHTML("beforeend", html);
    }
    return PlayerTable;
}());
var TableCenter = (function () {
    function TableCenter(game) {
        this.game = game;
    }
    return TableCenter;
}());
var StateManager = (function () {
    function StateManager(game) {
        this.game = game;
        this.states = {
            playerTurn: new PlayerTurnState(game),
        };
    }
    StateManager.prototype.onEnteringState = function (stateName, args) {
        console.log("Entering state: ".concat(stateName));
        if (this.states[stateName] !== undefined) {
            this.states[stateName].onEnteringState(args.args);
        }
    };
    StateManager.prototype.onLeavingState = function (stateName) {
        console.log("Leaving state: ".concat(stateName));
        if (this.states[stateName] !== undefined) {
            this.states[stateName].onLeavingState();
        }
    };
    StateManager.prototype.onUpdateActionButtons = function (stateName, args) {
        console.log("Update action buttons: ".concat(stateName));
        if (this.game.isCurrentPlayerActive()) {
            this.states[stateName].onUpdateActionButtons(args);
        }
    };
    return StateManager;
}());
var PlayerTurnState = (function () {
    function PlayerTurnState(game) {
        this.game = game;
    }
    PlayerTurnState.prototype.onEnteringState = function (args) { };
    PlayerTurnState.prototype.onLeavingState = function () { };
    PlayerTurnState.prototype.onUpdateActionButtons = function (_a) {
        var _this = this;
        var can_add_ship = _a.can_add_ship;
        var handleAdd = function () {
            _this.game.setClientState("playerTurnAdd", {
                description: _(""),
                args: {},
            });
        };
        var handleShoot = function () {
            _this.game.setClientState("playerTurnShoot", {
                description: _(""),
                args: {},
            });
        };
        var handleDraw = function () {
            _this.game.setClientState("playerTurnDraw", {
                description: _(""),
                args: {},
            });
        };
        var handleBoard = function () {
            _this.game.setClientState("playerTurnBoard", {
                description: _(""),
                args: {},
            });
        };
        this.game.addPrimaryActionButton("btn_add", _("Add a new ship"), handleAdd);
        this.game.addPrimaryActionButton("btn_shoot", _("Shoot an opponent's ship"), handleShoot);
        this.game.addPrimaryActionButton("btn_draw", _("Discard a ship to draw"), handleDraw);
        this.game.addPrimaryActionButton("btn_board", _("Board a ship"), handleBoard);
        this.game.toggleButton("btn_add", can_add_ship);
    };
    return PlayerTurnState;
}());
var Cannonades = (function () {
    function Cannonades() {
    }
    Cannonades.prototype.setup = function (gamedatas) {
        this.stateManager = new StateManager(this);
        this.createPlayerTables(gamedatas);
        this.setupNotifications();
    };
    Cannonades.prototype.onEnteringState = function (stateName, args) {
        this.stateManager.onEnteringState(stateName, args);
    };
    Cannonades.prototype.onLeavingState = function (stateName) {
        this.stateManager.onLeavingState(stateName);
    };
    Cannonades.prototype.onUpdateActionButtons = function (stateName, args) {
        this.stateManager.onUpdateActionButtons(stateName, args);
    };
    Cannonades.prototype.setupNotifications = function () { };
    Cannonades.prototype.createPlayerTables = function (gamedatas) {
        var _this = this;
        this.playersTables = [];
        gamedatas.playerorder.forEach(function (player_id) {
            var player = gamedatas.players[Number(player_id)];
            var table = new PlayerTable(_this, player);
            _this.playersTables.push(table);
        });
    };
    Cannonades.prototype.addPrimaryActionButton = function (id, text, callback) {
        if (!document.getElementById(id)) {
            this.addActionButton(id, text, callback, null, false, "blue");
        }
    };
    Cannonades.prototype.addSecondaryActionButton = function (id, text, callback) {
        if (!document.getElementById(id)) {
            this.addActionButton(id, text, callback, null, false, "gray");
        }
    };
    Cannonades.prototype.addDangerActionButton = function (id, text, callback) {
        if (!document.getElementById(id)) {
            this.addActionButton(id, text, callback, null, false, "red");
        }
    };
    Cannonades.prototype.toggleButton = function (id, enabled) {
        var _a;
        (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.classList.toggle('disabled', !enabled);
    };
    Cannonades.prototype.takeAction = function (action, data, onSuccess, onComplete) {
        data = data || {};
        data.lock = true;
        onSuccess = onSuccess !== null && onSuccess !== void 0 ? onSuccess : function (result) { };
        onComplete = onComplete !== null && onComplete !== void 0 ? onComplete : function (is_error) { };
        this.ajaxcall("/cannonadesmg/cannonadesmg/".concat(action, ".html"), data, this, onSuccess, onComplete);
    };
    return Cannonades;
}());
define([
    "dojo",
    "dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    "ebg/stock",
], function (dojo, declare) {
    return declare("bgagame.cannonadesmg", [ebg.core.gamegui], new Cannonades());
});
