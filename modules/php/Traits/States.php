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
        Globals::setActionsRemaining(4);
        Globals::setPlayerTurn($player_id);
        Globals::setVendetta([]);
        Game::get()->incStat(1, STAT_TURN_NUMBER);
        Game::get()->incStat(1, STAT_TURN_NUMBER, $player_id);

        if (Game::get()->getStat(STAT_TURN_NUMBER, $player_id) > 1) {
            // Draw 5 - number of ship on his board
            $nbr = 5 - Card::countShipOnBoard($player_id);
            $cards = Card::draw($player_id, $nbr);
            Notifications::onDrawCards($player_id, $cards);
        }

        Game::get()->gamestate->nextState();
    }

    function stPlayerNextAction() {
        $player_id = intval(Game::get()->getActivePlayerId());
        $count_actions = Globals::getActionsRemaining();
        $count_vendetta = count(Globals::getVendetta());

        if (Card::countShipOnBoard($player_id) == 0 && $count_actions <= 1) {
            if(Player::getRemainingPlayers() > 2) {
                Game::get()->gamestate->nextState('next_player');
                Game::eliminatePlayer($player_id);
            } else {
                Game::eliminatePlayer($player_id);
                Game::get()->gamestate->nextState('end');
            }
        } else if (Player::getRemainingPlayers() <= 1) {
            Game::get()->gamestate->nextState('end');
        } else if ($count_vendetta > 0) {
            Game::get()->gamestate->nextState('vendetta');
        } else if ($count_actions > 1) {
            Globals::setActionsRemaining($count_actions - 1);
            Game::get()->gamestate->nextState('next');
        } else if (Card::countCardInHand($player_id) > Player::getRemainingPlayers() + 1) {
            throw new BgaUserException("discard");
            Game::get()->gamestate->nextState('discard');
        } else {
            Game::get()->gamestate->nextState('next_player');
        }
    }

    function stPlayerNext() {
        Game::get()->giveExtraTime(Game::get()->getActivePlayerId());
        Game::get()->activeNextPlayer();
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
            Game::get()->gamestate->nextState('next');
        } else {
            Game::get()->giveExtraTime($current_player_id);
            Game::get()->gamestate->changeActivePlayer(Globals::getPlayerTurn());
            Game::get()->gamestate->nextState('end');
        }
    }

    function stFinalScoring() {
        $players = Game::get()->loadPlayersBasicInfos();
        foreach($players as $player_id => $player) {
            if($player['player_eliminated'] == 0) {
                $ships = array_values(Card::getBoard($player_id));
                $ships = array_filter($ships, fn($card) => !array_key_exists('type_arg', $card));

                foreach ($ships as $ship_id) {
                    Globals::addDamagedShips(intval($ship_id));
                    $ship = Card::get($ship_id);
                    Notifications::revealShip($ship);
                }

                $ships = array_values(Card::getBoard($player_id));

                $score = 
                    1000 * count($ships) +
                    100 * $this->countIcons($ships) +
                    10 * $this->maxSails($ships) +
                    1 * ($player_id == Globals::getPlayerStandoff() ? 1 : 0);

                Player::updateScore($player_id, $score);
            }
        }
        Game::get()->gamestate->nextState();
    }

    private function countIcons(array $ships) {
        $ship_types = Game::get()->ship_types;
        $colors = array_map(function($card) use ($ship_types) {
            return $ship_types[intval($card['type_arg'])]['color'];
        }, $ships);
        return count(array_unique($colors));
    }

    private function maxSails(array $ships) {
        $ship_types = Game::get()->ship_types;
        $sails = array_map(function($card) use ($ship_types) {
            return $ship_types[intval($card['type_arg'])]['sail'];
        }, $ships);
        $counted = array_count_values($sails);
        arsort($counted);
        $occurences = reset($counted);
        return $occurences;
    }
}
