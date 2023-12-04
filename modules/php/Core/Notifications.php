<?php

namespace Cannonades\Core;

class Notifications extends \APP_DbObject {

    public static function addShip(int $player_id, int $card_id) {
        $message = clienttranslate('${player_name} add a ship on his board');
        self::notifyAll("onAddShip", $message, [
            'player_id' => $player_id,
            'player_name' => self::getPlayerName($player_id),
            'card_id' => $card_id,
        ]);
    }

    public static function discardCard(array $card) {
        $player_id = intval($card['location_arg']);
        $message = clienttranslate('${player_name} discards a card');
        self::notifyAll("onDiscardCard", $message, [
            'player_id' => $player_id,
            'player_name' => self::getPlayerName($player_id),
            'card' => $card,
        ]);
    }

    public static function discardHand(int $player_id, array $cards) {
        $message = clienttranslate('${player_name} discards his hand');
        self::notifyAll("onDiscardHand", $message, [
            'player_id' => $player_id,
            'player_name' => self::getPlayerName($player_id),
            'cards' => $cards,
        ]);
    }

    public static function onDrawCards(int $player_id, array $cards) {
        $args = [
            'player_id' => $player_id,
            'player_name' => self::getPlayerName($player_id),
            'nbr_cards' => count($cards),
            'cards' => $cards,
        ];
        $message = clienttranslate('${player_name} draws ${nbr_cards}');
        self::notify($player_id, 'onDrawCards', $message, $args);
        
        $args['cards'] = Card::anonymizeCards($cards);
        self::notifyAll('onDrawCards', $message, $args, $player_id);
    }

    public static function playCard(array $card) {
        $player_id = intval($card['location_arg']);
        $message = clienttranslate('${player_name} plays a card');
        self::notifyAll("onPlayCard", $message, [
            'player_id' => $player_id,
            'player_name' => self::getPlayerName($player_id),
            'card' => $card,
        ]);
    }

    static function revealShip($ship) {
        $player_id = intval($ship['location_arg']);
        $message = clienttranslate('${player_name} reveals a ship');
        self::notifyAll("onRevealShip", $message, [
            'player_id' => $player_id,
            'player_name' => self::getPlayerName($player_id),
            'card' => $ship,
        ]);
    }

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
