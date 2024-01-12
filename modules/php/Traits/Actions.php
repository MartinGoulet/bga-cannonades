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
        (note: each method below must match an input method in cannonades.action.php)
    */

    function addShip(int $card_id) {
        $player_id = intval(Game::get()->getActivePlayerId());
        Card::addShipToBoard($player_id, $card_id);
        Notifications::addShip($player_id, $card_id);
        Game::get()->gamestate->nextState('next');
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

        if (Card::countCardInDeck() == 0) {
            Globals::setPlayerStandoff($player_id);
            Globals::setActionsRemaining(0);
            Globals::setVendetta([]);
            Game::get()->gamestate->nextState('standoff');
            return;
        }

        Game::get()->gamestate->nextState('next');
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
        $is_ship_revealed = in_array($ship_id, Globals::getDamagedShips());
        if (!$is_ship_revealed) {
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
        } else if ($ship_type['captain'] == 1) {
            if ($is_ship_sunk)  Globals::addVendetta($player_id, $current_player_id);
        } else if ($ship_type['captain'] == 2) {
            if ($is_ship_sunk)  Globals::addVendetta($player_id, $current_player_id);
            if (!$is_ship_revealed)  Globals::addVendetta($player_id, $current_player_id);
        }

        Game::get()->gamestate->nextState('next');
    }

    function boardShip(int $card_id, int $ship_id) {
        $this->shootCannonade($card_id, $ship_id);
    }

    function pass() {
        Globals::setActionsRemaining(0);
        Notifications::pass(Game::get()->getCurrentPlayerId());
        Game::get()->gamestate->nextState('next');
    }

    function vendettaDrawCard() {
        $player_id = intval(Game::get()->getActivePlayerId());
        $cards = Card::draw($player_id, 1);
        Notifications::onDrawCards($player_id, $cards);

        if (Card::countCardInDeck() == 0) {
            Globals::setPlayerStandoff($player_id);
            Globals::setActionsRemaining(0);
            Globals::setVendetta([]);
            Game::get()->gamestate->nextState('standoff');
            return;
        }

        Game::get()->gamestate->nextState('next');
    }

    function vendettaDiscardCard() {
        Game::get()->gamestate->nextstate('discard');
    }

    function vendettaFlipShip(int $ship_id) {
        Globals::addDamagedShips($ship_id);
        $ship = Card::get($ship_id);
        Notifications::revealShip($ship);

        $player_id = intval($ship['location_arg']);
        $current_player_id = Game::get()->getCurrentPlayerId();
        $ship_type = Game::get()->ship_types[$ship['type_arg']];
        if ($ship_type['captain'] == 2) {
            Globals::addVendetta($player_id, $current_player_id);
        }

        Game::get()->gamestate->nextState('next');
    }

    function discard(array $card_ids) {
        $player_id = Game::get()->getCurrentPlayerId();
        $cards = Card::getCards($card_ids);
        Card::discardCards($cards);
        Notifications::discardCards($player_id, array_values($cards));
        Game::get()->gamestate->nextState();
    }

    function standoff(int $card_id) {
        $player_id = Game::get()->getCurrentPlayerId();
        $card = Card::addCardToHand($card_id, $player_id);
        Notifications::onDrawCards($player_id, [$card]);

        $next_state = Globals::getActionsRemaining() == 0 ? "next" : "current";
        Game::get()->gamestate->nextState($next_state);
    }

    public function discardCardForVendetta(int $card_id) {
        $card = Card::get($card_id);
        Card::discard($card_id);
        Notifications::discardCard($card);
        // Move to next state
        $this->gamestate->nextState();
    }
}
