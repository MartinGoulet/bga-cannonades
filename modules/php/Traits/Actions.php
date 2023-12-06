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
        Game::get()->gamestate->nextState();
    }

    function discardCard(int $card_id) {
        $player_id = intval(Game::get()->getActivePlayerId());

        $card = Card::get($card_id);
        Card::discard($card_id);
        Notifications::discardCard($card);

        $nbr = 1;
        if ($card['type'] == "1") {
            $nbr += Game::get()->ship_types[intval($card['type_arg'])]['captain'];
        }
        $cards = Card::draw($player_id, $nbr);
        Notifications::onDrawCards($player_id, $cards);

        Game::get()->gamestate->nextState();
    }

    function shootCannonade(int $card_id, int $ship_id) {
        $ship = Card::get($ship_id);
        $cannonade = Card::get($card_id);

        $ship_type = Game::get()->ship_types[$ship['type_arg']];
        if ($cannonade['type'] == CARD_TYPE_CANNONADE) {
            $cannonade_type = Game::get()->cannonade_types[$cannonade['type_arg']];
        } else {
            $cannonade_type = Game::get()->ship_types[$cannonade['type_arg']];
        }

        Notifications::playCard($cannonade);
        if (!in_array($ship_id, Globals::getDamagedShips())) {
            Notifications::revealShip($ship);
        }

        $is_ship_sunk =
            (
                array_key_exists('colors', $cannonade_type) &&
                in_array($ship_type['color'], $cannonade_type['colors'])
            )
            ||
            (
                array_key_exists('color', $cannonade_type) &&
                $ship_type['color'] == $cannonade_type['color']
            );

        if ($is_ship_sunk) {
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
        $current_player_id = Game::get()->getCurrentPlayerId();
        if (Card::countShipOnBoard($player_id) == 0) {
            Game::eliminatePlayer($player_id);

            if (Player::getRemainingPlayers() > 1) {
                $cards = Card::draw($current_player_id, 1);
                Notifications::onDrawCards($current_player_id, $cards);
            }
        } else {
            for ($i = 0; $i < $ship_type['captain']; $i++) {
                Globals::addVendetta($player_id, $current_player_id);
            }
        }

        Game::get()->gamestate->nextState();
    }

    function boardShip(int $card_id, int $ship_id) {
        $this->shootCannonade($card_id, $ship_id);
    }

    function pass() {
        Globals::setActionsRemaining(0);
        Game::get()->gamestate->nextState();
    }

    function vendettaDrawCard() {
        $player_id = intval(Game::get()->getActivePlayerId());
        $cards = Card::draw($player_id, 1);
        Notifications::onDrawCards($player_id, $cards);
        Game::get()->gamestate->nextState();
    }

    function vendettaDiscardCard() {
        $vendettas = Globals::getVendetta();
        $vendetta = array_shift($vendettas);

        $cards = Card::getHand($vendetta['from_player_id'], true);
        shuffle($cards);
        $card = array_shift($cards);

        Card::discard($card['id']);
        Notifications::discardCard($card);
        Game::get()->gamestate->nextState();
    }

    function vendettaFlipShip(int $ship_id) {
        Globals::addDamagedShips($ship_id);
        $ship = Card::get($ship_id);
        Notifications::revealShip($ship);
        Game::get()->gamestate->nextState();
    }
}
