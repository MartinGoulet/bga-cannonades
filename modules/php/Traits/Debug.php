<?php

namespace Cannonades\Traits;

use Cannonades\Core\Game;
use Cannonades\Core\Globals;

trait Debug {
    static function setActionsCount($nbr) {
        Globals::setActionsRemaining(intval($nbr));
    }

    static function discardDeck() {
        Game::get()->deck->moveAllCardsInLocation('deck', 'discard');
    }

    static function discardTopCard($nbr) {
        $cards = Game::get()->deck->pickCardsForLocation($nbr, 'deck', 'discard');
    }
}