<?php

namespace Cannonades\Core;

use BgaUserException;
use Cannonades\Core\Game;

class Card {

    public static function addCardToHand(int $card_id, int $player_id) {
        $deck = Game::get()->deck;
        $deck->moveCard($card_id, 'hand', $player_id);
        return $deck->getCard($card_id);
    }

    public static function addShipToBoard(int $player_id, int $card_id) {
        $deck = Game::get()->deck;
        $card = $deck->getCard($card_id);
        if ($card['location'] !== 'hand' || intval($card['location_arg']) !== $player_id) {
            var_dump($card);
            throw new BgaUserException("The card is not in your hand");
        }
        $deck->moveCard($card_id, 'board', $player_id);
    }

    public static function anonymizeCards($cards, bool $anonymize = true) {
        if (!$anonymize) return $cards;
        return array_map(fn ($card) => self::anonymize($card), $cards);
    }

    public static function anonymize($card) {
        unset($card['type']);
        unset($card['type_arg']);
        return $card;
    }

    static function countShipOnBoard(int $player_id) {
        $deck = Game::get()->deck;
        return $deck->countCardInLocation('board', $player_id);
    }

    static function countCardInDeck() {
        $deck = Game::get()->deck;
        return $deck->countCardInLocation('deck');
    }

    static function countCardInHand(int $player_id) {
        $deck = Game::get()->deck;
        return $deck->countCardInLocation('hand', $player_id);
    }

    static function discard($card_id) {
        $deck = Game::get()->deck;
        $deck->playCard($card_id);
    }

    static function discardCards($cards) {
        $deck = Game::get()->deck;
        foreach ($cards as $card_id => $card) {
            $deck->playCard($card['id']);
        }
    }

    static function draw(int $player_id, int $count) {
        $deck = Game::get()->deck;
        return $deck->pickCards($count, 'deck', $player_id) ?? [];
    }

    static function get($card_id) {
        $deck = Game::get()->deck;
        return $deck->getCard($card_id);
    }

    static function getBoard($player_id) {
        $deck = Game::get()->deck;
        $cards = $deck->getCardsInLocation('board', $player_id, 'card_id');

        $damaged_ships = Globals::getDamagedShips();
        $cards = array_map(function ($card) use ($damaged_ships) {
            return in_array($card['id'], $damaged_ships) ? $card : self::anonymize($card);
        }, $cards);

        return $cards;
    }

    static function getCards($card_ids) {
        $deck = Game::get()->deck;
        return $deck->getCards($card_ids);
    }

    static function getHand($player_id, $is_current_player) {
        $deck = Game::get()->deck;
        $cards = $deck->getCardsInLocation('hand', $player_id, 'card_type_arg');
        $cards = self::anonymizeCards($cards, !$is_current_player);
        return $cards;
    }

    static function setupDeck() {
        $deck = Game::get()->deck;

        $ships = [];
        foreach (Game::get()->ship_types as $type_arg => $info) {
            $ships[] = ['type' => CARD_TYPE_SHIP, 'type_arg' => $type_arg, 'nbr' => $info['count']];
        }
        $deck->createCards($ships, 'ships');
        $deck->shuffle('ships');

        $cannonades = [];
        foreach (Game::get()->cannonade_types as $type_arg => $info) {
            $cannonades[] = ['type' => CARD_TYPE_CANNONADE, 'type_arg' => $type_arg, 'nbr' => $info['count']];
        }
        $deck->createCards($cannonades, 'cannonades');
        $deck->shuffle('cannonades');
    }

    static function setupPlayersHand() {
        $players = Game::get()->loadPlayersBasicInfos();
        $deck = Game::get()->deck;

        foreach ($players as $player_id => $player) {
            $deck->pickCards(2, 'ships', $player_id);
        }

        $deck->moveAllCardsInLocation('ships', 'deck');
        $deck->moveAllCardsInLocation('cannonades', 'deck');
        $deck->shuffle('deck');

        foreach ($players as $player_id => $player) {
            $deck->pickCards(3, 'deck', $player_id);
        }
    }
}
