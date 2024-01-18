<?php

/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * cannonades implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 * 
 * states.inc.php
 *
 * cannonades game states description
 *
 */

/*
   Game state machine is a tool used to facilitate game developpement by doing common stuff that can be set up
   in a very easy way from this configuration file.

   Please check the BGA Studio presentation about game state to understand this, and associated documentation.

   Summary:

   States types:
   _ activeplayer: in this type of state, we expect some action from the active player.
   _ multipleactiveplayer: in this type of state, we expect some action from multiple players (the active players)
   _ game: this is an intermediary state where we don't expect any actions from players. Your game logic must decide what is the next game state.
   _ manager: special type for initial and final state

   Arguments of game states:
   _ name: the name of the GameState, in order you can recognize it on your own code.
   _ description: the description of the current game state is always displayed in the action status bar on
                  the top of the game. Most of the time this is useless for game state with "game" type.
   _ descriptionmyturn: the description of the current game state when it's your turn.
   _ type: defines the type of game states (activeplayer / multipleactiveplayer / game / manager)
   _ action: name of the method to call when this game state become the current game state. Usually, the
             action method is prefixed by "st" (ex: "stMyGameStateName").
   _ possibleactions: array that specify possible player actions on this step. It allows you to use "checkAction"
                      method on both client side (Javacript: this.checkAction) and server side (PHP: self::checkAction).
   _ transitions: the transitions are the possible paths to go from a game state to another. You must name
                  transitions in order to use transition names in "nextState" PHP method, and use IDs to
                  specify the next game state for each transition.
   _ args: name of the method to call to retrieve arguments for this gamestate. Arguments are sent to the
           client side to be used on "onEnteringState" or to set arguments in the gamestate description.
   _ updateGameProgression: when specified, the game progression is updated (=> call to your getGameProgression
                            method).
*/

//    !! It is not a good idea to modify this file when a game is running !!

$basicGameStates = [

    // The initial state. Please do not modify.
    ST_BGA_GAME_SETUP => [
        "name" => "gameSetup",
        "description" => clienttranslate("Game setup"),
        "type" => "manager",
        "action" => "stGameSetup",
        "transitions" => ["" => ST_TURN_DRAW]
    ],

    // Final state.
    // Please do not modify.
    ST_BGA_GAME_END => [
        "name" => "gameEnd",
        "description" => clienttranslate("End of game"),
        "type" => "manager",
        "action" => "stGameEnd",
        "args" => "argGameEnd",
    ],
];

$gameEngineState = [
    ST_TURN_DRAW => [
        "name" => "draw",
        "type" => "game",
        "action" => "stDraw",
        "transitions" => [
            "next" => ST_PLAYER_TURN,
            "standoff" => ST_PLAYER_STANDOFF,
        ],
    ],

    ST_PLAYER_TURN => [
        "name" => "playerTurn",
        "description" => clienttranslate('${actplayer} must take an action or pass (${actions_remaining} action(s) remaining)'),
        "descriptionmyturn" => clienttranslate('${you} must take an action or pass (${actions_remaining} action(s) remaining)'),
        "args" => "argPlayerTurn",
        "type" => "activeplayer",
        "possibleactions" => [
            "addShip",
            "shootCannonade",
            "discardCard",
            "boardShip",
            "pass"
        ],
        "transitions" => [
            "next" => ST_PLAYER_NEXT_ACTION,
            "standoff" => ST_PLAYER_STANDOFF,
        ],
    ],

    ST_PLAYER_NEXT_ACTION => [
        "name" => "playerNextAction",
        "type" => "game",
        "action" => "stPlayerNextAction",
        "transitions" => [
            "end" => ST_FINAL_SCORING,
            "next" => ST_PLAYER_TURN,
            "discard" => ST_PLAYER_TURN_DISCARD,
            "next_player" => ST_PLAYER_TURN_NEXT,
            "vendetta" => ST_VENDETTA_SWITCH,
        ],
    ],

    ST_PLAYER_TURN_DISCARD => [
        "name" => "playerTurnDiscard",
        "description" => clienttranslate('${actplayer} must discard ${nbr} card(s)'),
        "descriptionmyturn" => clienttranslate('${you} must discard ${nbr} card(s)'),
        "args" => "argPlayerTurnDiscard",
        "type" => "activeplayer",
        "possibleactions" => ["discard"],
        "transitions" => [
            "" => ST_PLAYER_TURN_NEXT,
        ],
    ],

    ST_PLAYER_TURN_NEXT => [
        "name" => "playerNext",
        "type" => "game",
        "action" => "stPlayerNext",
        "transitions" => [
            "" => ST_TURN_DRAW,
        ],
    ],
];

$vendettaStates = [

    ST_VENDETTA_SWITCH => [
        "name" => "vendettaSwitch",
        "type" => "game",
        "action" => "stVendettaSwitch",
        "transitions" => [
            "" => ST_VENDETTA,
        ],
    ],

    ST_VENDETTA => [
        "name" => "vendetta",
        "description" => clienttranslate('VENDETTA : ${actplayer} must take an action or pass'),
        "descriptionmyturn" => clienttranslate('VENDETTA : ${you} must take an action or pass'),
        "args" => "argVendetta",
        "type" => "activeplayer",
        "possibleactions" => [
            "vendettaDrawCard",
            "vendettaDiscardCard",
            "vendettaFlipShip",
        ],
        "transitions" => [
            "next" => ST_VENDETTA_NEXT,
            "standoff" => ST_PLAYER_STANDOFF,
            "discard" => ST_PRE_VENDETTA_DISCARD_CARD,
        ],
    ],

    ST_VENDETTA_NEXT => [
        "name" => "vendettaNext",
        "type" => "game",
        "action" => "stVendettaNext",
        "transitions" => [
            "next" => ST_VENDETTA,
            "end" => ST_PLAYER_NEXT_ACTION,
        ],
    ],

    ST_PRE_VENDETTA_DISCARD_CARD => [
        "name" => "preVendettaDiscardCard",
        "type" => "game",
        "action" => "stPreVendettaDiscardCard",
        "transitions" => [
            '' => ST_VENDETTA_DISCARD_CARD,
        ],
    ],

    ST_VENDETTA_DISCARD_CARD => [
        "name" => "vendettaDiscardCard",
        "description" => clienttranslate('${actplayer} must select a card to discard'),
        "descriptionmyturn" => clienttranslate('${you} must select a card to discard'),
        "type" => "activeplayer",
        "possibleactions" => ['discardCardForVendetta'],
        "transitions" => [
            '' => ST_VENDETTA_NEXT,
        ],
    ],
];

$standoffStates = [
    ST_PLAYER_STANDOFF => [
        "name" => "playerTurnStandoff",
        "description" => clienttranslate('${actplayer} must pick a cannonade from the discard'),
        "descriptionmyturn" => clienttranslate('${you} must pick a cannonade from the discard'),
        "type" => "activeplayer",
        "possibleactions" => [
            "standoff",
        ],
        "transitions" => [
            "current" => ST_PLAYER_TURN,
            "next" => ST_PLAYER_TURN_NEXT,
        ],
    ],
];

$scoringStates = [
    ST_FINAL_SCORING => [
        "name" => "finalScoring",
        "type" => "game",
        "action" => "stFinalScoring",
        "transitions" => [
            "end" => ST_BGA_GAME_END,
            "debug" => ST_END_GAME_DEBUG,
        ],
    ],
];

$machinestates = $basicGameStates + $gameEngineState + $vendettaStates + $standoffStates + $scoringStates + [
    
    ST_END_GAME_DEBUG => [
        "name" => "endGameDebug",
        "description" => clienttranslate('End Game'),
        "descriptionmyturn" => clienttranslate('End Game'),
        "type" => "activeplayer",
        "possibleactions" => [],
        "transitions" => [
            '' => ST_BGA_GAME_END,
        ],
    ],
    
];
