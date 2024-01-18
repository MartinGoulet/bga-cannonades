<?php

/**
 * Game Options
 */

const GAME_OPTION_VARIANT_ID = 100;
const GAME_OPTION_VARIANT = 'gameOptionMaxCardHand';
const GAME_OPTION_VARIANT_NBR_PLAYERS_PLUS_1 = 1;
const GAME_OPTION_VARIANT_FIX_5_CARDS = 2;


/**
 * States
 */
const ST_BGA_GAME_SETUP = 1;
const ST_BGA_GAME_END = 99;
const ST_END_GAME_DEBUG = 199;

const ST_TURN_DRAW = 10;

const ST_PLAYER_TURN = 2;
const ST_PLAYER_TURN_NEXT = 3;
const ST_PLAYER_TURN_DISCARD = 4;
const ST_PLAYER_NEXT_ACTION = 5;


const ST_VENDETTA = 7;
const ST_VENDETTA_NEXT = 8;
const ST_VENDETTA_SWITCH = 9;
const ST_PRE_VENDETTA_DISCARD_CARD = 30;
const ST_VENDETTA_DISCARD_CARD = 31;

const ST_PLAYER_STANDOFF = 20;
const ST_PLAYER_STANDOFF_NEXT = 20;

const ST_FINAL_SCORING = 98;

/**
 * Card type
 */
const CARD_TYPE_SHIP = 1;
const CARD_TYPE_CANNONADE = 2;

/**
 * Ship Colors
 */
define('BLUE', clienttranslate('Blue'));
define('GREEN', clienttranslate('Green'));
define('PURPLE', clienttranslate('Purple'));
define('ORANGE', clienttranslate('Orange'));
define('RED', clienttranslate('Red'));
define('YELLOW', clienttranslate('Yellow'));

/**
 * Stats
 */
const STAT_TURN_NUMBER = 'turns_number';
