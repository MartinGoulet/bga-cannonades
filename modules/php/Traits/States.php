<?php

namespace Cannonades\Traits;

use Cannonades\Core\Card;
use Cannonades\Core\Game;
use Cannonades\Core\Globals;
use Cannonades\Core\Notifications;

trait States {

    //////////////////////////////////////////////////////////////////////////////
    //////////// Game state actions
    ////////////

    function stDraw() {
        $player_id = intval(Game::get()->getActivePlayerId());
        Globals::setActionsRemaining(4);
        Game::get()->incStat(1, STAT_TURN_NUMBER);
        Game::get()->incStat(1, STAT_TURN_NUMBER, $player_id);

        if (Game::get()->getStat(STAT_TURN_NUMBER, $player_id) > 1) {
            // Draw 5 - number of ship on his board
            $nbr = 5 - Card::countShipOnBoard($player_id);
            $cards = Card::draw($player_id, $nbr);
            Notifications::onDrawCards($player_id, $cards);
        }


        Game::get()->gamestate->nextState();
    }

    function stPlayerNext() {
        Game::get()->giveExtraTime(Game::get()->getActivePlayerId());
        Game::get()->activeNextPlayer();
        Game::get()->gamestate->nextState();
    }
}
