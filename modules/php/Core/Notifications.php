<?php

namespace Cannonades\Core;

class Notifications extends \APP_DbObject {

    /*************************
     **** GENERIC METHODS ****
     *************************/

    private static function notifyAll($name, $msg, $args = [], $exclude_player_id = null) {
        if ($exclude_player_id != null) {
            $args['excluded_player_id'] = $exclude_player_id;
        }
        Game::get()->notifyAllPlayers($name, $msg, $args);
    }

    private static function notify($player_id, $name, $msg, $args = []) {
        Game::get()->notifyPlayer($player_id, $name, $msg, $args);
    }

    private static function message($msg, $args = [], $exclude_player_id = null) {
        self::notifyAll('message', $msg, $args);
    }

    private static function messageTo($player_id, $msg, $args = []) {
        self::notify($player_id, 'message', $msg, $args);
    }

    private static function getPlayerName(int $player_id) {
        return Game::get()->getPlayerNameById($player_id);
    }

}