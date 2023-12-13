<?php

/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * WizardsGrimoire implementation : © Martin Goulet <martin.goulet@live.ca>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * gameoptions.inc.php
 *
 * WizardsGrimoire game options description
 * 
 * In this file, you can define your game options (= game variants).
 *   
 * Note: If your game has no variant, you don't have to modify this file.
 *
 * Note²: All options defined in this file should have a corresponding "game state labels"
 *        with the same ID (see "initGameStateLabels" in wizardsgrimoire.game.php)
 *
 * !! It is not a good idea to modify this file when a game is running !!
 *
 */

require_once("modules/php/constants.inc.php");

$game_options = [
    GAME_OPTION_VARIANT_ID => [
        'name' => totranslate('Max card in hand'),
        'default' => GAME_OPTION_VARIANT_NBR_PLAYERS_PLUS_1,
        'values' => [
            GAME_OPTION_VARIANT_NBR_PLAYERS_PLUS_1 => [
                'name' => totranslate('Number of remaining players + 1'),
                'tmdisplay' => totranslate('Nbr players + 1'),
                'description' => totranslate('You may have a maximum of number of remaining players + 1 cards in hand at the end of your turn')
            ],
            GAME_OPTION_VARIANT_FIX_5_CARDS => [
                'name' => totranslate('5 cards'),
                'tmdisplay' => totranslate('5 cards'),
                'description' => totranslate('You may have a maximum of 5 cards in hand at the end of your turn')
            ],
        ]
    ],
];
