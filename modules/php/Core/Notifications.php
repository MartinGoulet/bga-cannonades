<?php

namespace Cannonades\Core;

use BgaUserException;

class Notifications extends \APP_DbObject {

    public static function actionsRemaining($player_id, $count) {
        $message = clienttranslate('${player_name} has ${count} actions remaining');
        self::message($message, [
            'player_id' => $player_id,
            'player_name' => self::getPlayerName($player_id),
            'count' => $count,
        ]);
    }

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
        $message = clienttranslate('${player_name} discards a card ${card_image}');
        self::notifyAll("onDiscardCard", $message, [
            'player_id' => $player_id,
            'player_name' => self::getPlayerName($player_id),
            'card' => $card,
            'card_image' => $card,
        ]);
    }

    public static function discardCards(int $player_id, array $cards) {
        $message = clienttranslate('${player_name} discards ${nbr} card(s)');
        self::notifyAll("onDiscardHand", $message, [
            'player_id' => $player_id,
            'player_name' => self::getPlayerName($player_id),
            'cards' => $cards,
            'nbr' => count($cards),
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

    public static function onDrawCards(int $player_id, array $cards, bool $discard = false) {
        $args = [
            'player_id' => $player_id,
            'player_name' => self::getPlayerName($player_id),
            'nbr_cards' => count($cards),
            'cards' => array_values($cards),
            'discard' => $discard,
        ];
        $message = clienttranslate('${player_name} draws ${nbr_cards}');
        self::notify($player_id, 'onDrawCards', $message, $args);

        $args['cards'] = Card::anonymizeCards($cards);
        self::notifyAll('onDrawCards', $message, $args, $player_id);
    }

    public static function pass($player_id) {
        $message = clienttranslate('${player_name} decides to pass');
        self::message($message, [
            'player_id' => $player_id,
            'player_name' => self::getPlayerName($player_id),
        ]);
    }

    public static function playCard(array $card) {
        $player_id = intval($card['location_arg']);
        $message = clienttranslate('${player_name} plays a card ${card_image}');
        self::notifyAll("onPlayCard", $message, [
            'player_id' => $player_id,
            'player_name' => self::getPlayerName($player_id),
            'card' => $card,
            'card_image' => $card,
        ]);
    }

    static function revealShip($ship) {
        $player_id = intval($ship['location_arg']);
        $message = clienttranslate('${player_name} reveals a ship ${card_image}');
        self::notifyAll("onRevealShip", $message, [
            'player_id' => $player_id,
            'player_name' => self::getPlayerName($player_id),
            'card' => $ship,
            'card_image' => $ship,
        ]);
    }

    static function startTurn($player_id) {
        $message = clienttranslate('${player_name} starts is turn');
        self::message($message, [
            'player_id' => $player_id,
            'player_name' => self::getPlayerName($player_id),
        ]);
    }

    static function startVendetta($player_id, $player_id2) {
        $message = clienttranslate('${player_name} starts a vendetta agains\'t ${player_name2}');
        self::message($message, [
            'player_id' => $player_id,
            'player_name' => self::getPlayerName($player_id),
            'player_id2' => $player_id2,
            'player_name2' => self::getPlayerName($player_id2),
        ]);
    }

    static function updateScore(int $player_id, int $score) {
        self::notifyAll("onUpdateScore", '', [
            'player_id' => $player_id,
            'player_score' => $score,
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
        $player_name = Game::get()->getPlayerNameById($player_id);
        if($player_name == "" || $player_name == null) {
            throw new BgaUserException("Null player name");
        }
        return $player_name;
    }
}
