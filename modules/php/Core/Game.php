<?php

namespace Cannonades\Core;

class Game {
    public static function get() {
        return \cannonadesmg::get();
    }

    public static function eliminatePlayer($player_id, $eliminate = true) {
        if($eliminate) {
            self::get()->eliminatePlayer($player_id);
        }
        $cards = Card::getHand($player_id, true);
        Card::discardCards($cards);
        Notifications::discardHand($player_id, $cards);
    }

    public static function isGameOptionFiveCardsMax() {
        return intval(self::get()->getGameStateValue(GAME_OPTION_VARIANT)) === GAME_OPTION_VARIANT_FIX_5_CARDS;
    }

    public static function getMaxNumberOfCardInHand() {
        if (self::isGameOptionFiveCardsMax()) {
            return 5;
        } else {
            return Player::getRemainingPlayers() + 1;
        }
    }
}
