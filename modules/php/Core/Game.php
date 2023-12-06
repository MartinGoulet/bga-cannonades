<?php

namespace Cannonades\Core;

class Game {
    public static function get() {
        return \cannonadesmg::get();
    }

    public static function eliminatePlayer($player_id) {
        self::get()->eliminatePlayer($player_id);
        $cards = Card::getHand($player_id, true);
        Card::discardCards($cards);
        Notifications::discardHand($player_id, $cards);
    }
}