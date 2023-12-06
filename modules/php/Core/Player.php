<?php

namespace Cannonades\Core;

class Player extends \APP_DbObject  {
    static function getRemainingPlayers() {
        $sql = "SELECT count(*) FROM player WHERE player_eliminated = 0";
        return intval(self::getUniqueValueFromDB($sql));
    }

    static function updateScore(int $player_id, $score) {
        $sql = "UPDATE player SET score = 1, player_score_aux = $score WHERE player_id = $player_id";
        self::DbQuery($sql);
    }
}
