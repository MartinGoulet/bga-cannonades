<?php

namespace Cannonades\Traits;

use BgaUserException;
use Cannonades\Core\Card;
use Cannonades\Core\Game;
use Cannonades\Core\Globals;
use Cannonades\Core\Notifications;
use Cannonades\Core\Player;

trait States {

    //////////////////////////////////////////////////////////////////////////////
    //////////// Game state actions
    ////////////

    function stDraw() {
        $player_id = intval(Game::get()->getActivePlayerId());
        Notifications::startTurn($player_id);

        Globals::setActionsRemaining(4);
        Notifications::actionsRemaining($player_id, 4);
        Globals::setPlayerTurn($player_id);
        Globals::setVendetta([]);
        Game::get()->incStat(1, STAT_TURN_NUMBER);
        Game::get()->incStat(1, STAT_TURN_NUMBER, $player_id);

        if (Globals::getPlayerStandoff() == 0) {
            if (Game::get()->getStat(STAT_TURN_NUMBER, $player_id) > 1) {
                // Draw 5 - number of ship on his board
                $nbr = 5 - Card::countShipOnBoard($player_id);
                $cards = Card::draw($player_id, $nbr);
                Notifications::onDrawCards($player_id, $cards);

                if (Card::countCardInDeck() == 0) {
                    Globals::setPlayerStandoff($player_id);
                    Globals::setActionsRemaining(0);
                    Globals::setVendetta([]);
                    Game::get()->gamestate->nextState('standoff');
                    return;
                }
            }
            Game::get()->gamestate->nextState('next');
        } else {
            if ($player_id === Globals::getPlayerStandoff()) {
                Globals::setLastTurn(true);
                Game::get()->gamestate->nextState('next');
            } else {
                Game::get()->gamestate->nextState('standoff');
            }
        }
    }

    function stPlayerNextAction() {
        $count_actions = Globals::getActionsRemaining();

        if (globals::isLastTurn() && $count_actions <= 1) {
            Game::get()->gamestate->nextState('end');
            return;
        }

        $player_id = intval(Game::get()->getActivePlayerId());
        $count_vendetta = count(Globals::getVendetta());

        if (Card::countShipOnBoard($player_id) == 0 && $count_actions <= 1) {
            if (Player::getRemainingPlayers() > 2) {
                Game::get()->gamestate->nextState('next_player');
                Game::eliminatePlayer($player_id);
            } else {
                Game::eliminatePlayer($player_id, false);
                Game::get()->gamestate->nextState('end');
            }
        } else if (Player::getRemainingPlayers() <= 1) {
            Game::get()->gamestate->nextState('end');
        } else if ($count_vendetta > 0) {
            $vendetta = Globals::getVendetta();
            $info = array_shift($vendetta);
            Notifications::startVendetta($info['player_id'], $info['from_player_id']);
            Game::get()->gamestate->nextState('vendetta');
        } else if ($count_actions > 1) {
            Globals::setActionsRemaining($count_actions - 1);
            Notifications::actionsRemaining($player_id, $count_actions - 1);
            Game::get()->gamestate->nextState('next');
        } else if (Card::countCardInHand($player_id) > Game::getMaxNumberOfCardInHand()) {
            Game::get()->gamestate->nextState('discard');
        } else {
            Game::get()->gamestate->nextState('next_player');
        }
    }

    function stPlayerNext() {
        Game::get()->giveExtraTime(Game::get()->getActivePlayerId());
        $player_id = Game::get()->activeNextPlayer();
        while (Player::isEliminated($player_id)) {
            $player_id = Game::get()->activeNextPlayer();
        }
        Game::get()->gamestate->nextState();
    }

    function stVendettaSwitch() {
        $current_player_id = Game::get()->getCurrentPlayerId();
        Game::get()->giveExtraTime($current_player_id);

        $vendetta = Globals::getVendetta();
        $info = array_shift($vendetta);
        Game::get()->gamestate->changeActivePlayer($info['player_id']);
        Game::get()->gamestate->nextState();
    }

    function stVendettaNext() {
        $current_player_id = Game::get()->getCurrentPlayerId();
        $vendetta = Globals::getVendetta();
        array_shift($vendetta);
        Globals::setVendetta($vendetta);
        if (sizeof($vendetta) > 0) {
            $info = array_shift($vendetta);
            $next_player = $info['player_id'];
            if ($next_player !== $current_player_id) {
                Game::get()->giveExtraTime($current_player_id);
                Game::get()->gamestate->changeActivePlayer($next_player);
            }
            Notifications::startVendetta($info['player_id'], $info['from_player_id']);
            Game::get()->gamestate->nextState('next');
        } else {
            Game::get()->giveExtraTime($current_player_id);
            Game::get()->gamestate->changeActivePlayer(Globals::getPlayerTurn());
            Game::get()->gamestate->nextState('end');
        }
    }

    function stFinalScoring() {
        $players = Game::get()->loadPlayersBasicInfos();
        foreach ($players as $player_id => $player) {
            if ($player['player_eliminated'] == 0) {
                $ships = array_values(Card::getBoard($player_id));
                $ships = array_filter($ships, fn ($card) => !array_key_exists('type_arg', $card));

                foreach ($ships as $ship) {
                    Globals::addDamagedShips(intval($ship['id']));
                    $ship = Card::get($ship['id']);
                    Notifications::revealShip($ship);
                }

                $ships = array_values(Card::getBoard($player_id));

                $grims = array_sum(array_map(function ($ship) {
                    $ship_type = Game::get()->ship_types[$ship['type_arg']];
                    return $ship_type['captain'];
                }, $ships));

                $grims = $grims > 1 ? 1 : 0;

                $colors = count(array_unique(array_map(function ($ship) {
                    $ship_type = Game::get()->ship_types[$ship['type_arg']];
                    return $ship_type['color'];
                }, $ships)));

                $score_aux =
                    1000 * ($grims + $colors) +
                    100 *  $this->maxSails($ships) +
                    10 * Card::countCardInHand($player_id) +
                    1 * ($player_id == Globals::getPlayerStandoff() ? 1 : 0);

                Player::updateScore($player_id, count($ships), $score_aux);
                Notifications::updateScore($player_id, count($ships));
            }
        }
        $next_state = $this->getBgaEnvironment() == 'studio' ? 'debug' : 'end';
        Game::get()->gamestate->nextState($next_state);
    }

    private function countIcons(array $ships) {
        $ship_types = Game::get()->ship_types;
        $colors = array_map(function ($card) use ($ship_types) {
            return $ship_types[intval($card['type_arg'])]['color'];
        }, $ships);
        return count(array_unique($colors));
    }

    private function maxSails(array $ships) {
        $ship_types = Game::get()->ship_types;
        $sails = array_map(function ($card) use ($ship_types) {
            return $ship_types[intval($card['type_arg'])]['sail'];
        }, $ships);
        $counted = array_count_values($sails);
        arsort($counted);
        $occurences = reset($counted);
        return $occurences;
    }

    function stPreVendettaDiscardCard() {
        $vendettas = Globals::getVendetta();
        $vendetta = array_shift($vendettas);
        $player_id = intval($vendetta['from_player_id']);

        Game::get()->gamestate->changeActivePlayer($player_id);
        Game::get()->giveExtraTime($player_id);

        $this->gamestate->nextState();
    }
}
