<?php

namespace Cannonades\Core;

class Player extends \APP_DbObject  {
    static function getRemainingPlayers() {
        $sql = "SELECT count(*) FROM player WHERE player_eliminated = 0";
        return intval(self::getUniqueValueFromDB($sql));
    }

    static function hasPlayedStandoff(int $player_id) {
        $sql = "SELECT played_standoff FROM player WHERE player_id = $player_id";
        return intval(self::getUniqueValueFromDB($sql)) !== 0;
    }

    static function isEliminated($player_id) {
        $sql = "SELECT player_eliminated FROM player WHERE player_id = $player_id";
        return intval(self::getUniqueValueFromDB($sql)) !== 0;
    }

    static function setPlayedStandoff(int $player_id) {
        $sql = "UPDATE player SET played_standoff = 1 WHERE player_id = $player_id";
        self::DbQuery($sql);
    }

    static function updateScore(int $player_id,int $score, int $score_aux) {
        $sql = "UPDATE player SET player_score = $score, player_score_aux = $score_aux WHERE player_id = $player_id";
        self::DbQuery($sql);
    }
}
