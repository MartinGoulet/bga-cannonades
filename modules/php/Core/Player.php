<?php

namespace Cannonades\Core;

class Player extends \APP_DbObject  {
    static function getRemainingPlayers() {
        $sql = "SELECT count(*) FROM player WHERE player_eliminated = 0";
        return intval(self::getUniqueValueFromDB($sql));
    }
}
