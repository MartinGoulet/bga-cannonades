<?php

namespace Cannonades\Traits;

use Cannonades\Core\Game;

trait Args {

    //////////////////////////////////////////////////////////////////////////////
    //////////// Game state arguments
    ////////////

    /*
        Here, you can create methods defined as "game state arguments" (see "args" property in states.inc.php).
        These methods function is to return some additional information that is specific to the current
        game state.
    */

    function argPlayerTurn() {
        $player_id = intval(Game::get()->getActivePlayerId());
        return [
            'can_add_ship' => false,
        ];
    }
}
