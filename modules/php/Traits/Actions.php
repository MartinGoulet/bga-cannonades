<?php

namespace Cannonades\Traits;

use BgaUserException;
use Cannonades\Core\Card;
use Cannonades\Core\Game;
use Cannonades\Core\Globals;
use Cannonades\Core\Notifications;
use Cannonades\Core\Player;

trait Actions {

    //////////////////////////////////////////////////////////////////////////////
    //////////// Player actions
    ////////////

    /*
        Each time a player is doing some game action, one of the methods below is called.
        (note: each method below must match an input method in cannonadesmg.action.php)
    */

    function addShip(int $card_id) {
        $player_id = intval(Game::get()->getActivePlayerId());
        Card::addShipToBoard($player_id, $card_id);
        Notifications::addShip($player_id, $card_id);
        $this->nextAction();
    }

    function discardCard(int $card_id) {
        $player_id = intval(Game::get()->getActivePlayerId());
        
        $card = Card::get($card_id);
        Card::discard($card_id);
        Notifications::discardCard($card);
        
        $nbr = 1;
        if($card['type'] == "1") {
            $nbr += Game::get()->ship_types[intval($card['type_arg'])]['captain'];
        }
        $cards = Card::draw($player_id, $nbr);
        Notifications::onDrawCards($player_id, $cards);

        $this->nextAction();
    }

    function shootCannonade(int $card_id, int $ship_id) {
        $ship = Card::get($ship_id);
        $cannonade = Card::get($card_id);

        $ship_type = Game::get()->ship_types[$ship['type_arg']];
        $cannonade_type = Game::get()->cannonade_types[$cannonade['type_arg']];

        Notifications::playCard($cannonade);
        if (!in_array($ship_id, Globals::getDamagedShips())) {
            Notifications::revealShip($ship);
        }

        if (in_array($ship_type['color'], $cannonade_type['colors'])) {
            // Sunk ship
            Card::discard($ship_id);
            Notifications::discardCard($ship);
        } else {
            // Damage ship
            Globals::addDamagedShips($ship_id);
        }

        Card::discard($card_id);
        Notifications::discardCard($cannonade);

        $player_id = intval($ship['location_arg']);
        if(Card::countShipOnBoard($player_id) == 0) {
            $cards = Card::getHand($player_id, false);
            Card::discardCards($cards);
            Notifications::discardHand($player_id, $cards);
            Game::get()->eliminatePlayer($player_id);
        }

        $this->nextAction();
    }

    function pass() {
        Globals::setActionsRemaining(0);
        $this->nextAction();
    }

    private function nextAction() {
        $player_id = intval(Game::get()->getActivePlayerId());
        $count_actions = Globals::getActionsRemaining();

        if ($count_actions > 1) {
            Globals::setActionsRemaining($count_actions - 1);
            Game::get()->gamestate->nextState('next');
        } else if (Card::countCardInHand($player_id) > Player::getRemainingPlayers() + 1) {
            Game::get()->gamestate->nextState('discard');
        } else {
            Game::get()->gamestate->nextState('next_player');
        }
    }
}
