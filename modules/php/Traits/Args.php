<?php

namespace Cannonades\Traits;

use Cannonades\Core\Card;
use Cannonades\Core\Game;
use Cannonades\Core\Globals;

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
            'can_add_ship' => Card::countShipOnBoard($player_id) < 4,
            'can_shoot_cannonades' => Game::get()->getStat(STAT_TURN_NUMBER, $player_id) > 1,
            'actions_remaining' => Globals::getActionsRemaining(),
        ];
    }

    function argVendetta() {
        $vendettas = Globals::getVendetta();
        $vendetta = array_shift($vendettas);

        $player_id = intval($vendetta['from_player_id']);
        $ships = array_values(Card::getBoard($player_id));
        $ships = array_filter($ships, fn($card) => !array_key_exists('type_arg', $card));
        return [
            'player_id' => $player_id,
            'player_name' => Game::get()->getPlayerNameById($player_id),
            'player_hand_count' => Card::countCardInHand($player_id),
            'hidden_ships' => array_column($ships, 'id'),
            'ships' => $ships,
        ];
    }
}
