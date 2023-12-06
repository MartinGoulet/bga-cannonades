<?php

/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * cannonadesmg implementation : © <Your name here> <Your email address here>
 * 
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * material.inc.php
 *
 * cannonadesmg game material description
 *
 * Here, you can describe the material of your game with PHP variables.
 *   
 * This file is loaded in your game logic class constructor, ie these variables
 * are available everywhere in your game logic code.
 *
 */


$this->ship_types = [
   1 => ['color' => BLUE, 'captain' => 0, 'count' => 3, 'sail' => 'left', 'img' => 20],
   2 => ['color' => BLUE, 'captain' => 1, 'count' => 2, 'sail' => 'left', 'img' => 19],
   3 => ['color' => BLUE, 'captain' => 2, 'count' => 1, 'sail' => 'left', 'img' => 16],

   11 => ['color' => GREEN, 'captain' => 0, 'count' => 3, 'sail' => 'left', 'img' => 18],
   12 => ['color' => GREEN, 'captain' => 1, 'count' => 2, 'sail' => 'left', 'img' => 15],
   13 => ['color' => GREEN, 'captain' => 2, 'count' => 1, 'sail' => 'left', 'img' => 21],

   21 => ['color' => ORANGE, 'captain' => 0, 'count' => 2, 'sail' => 'right', 'img' => 17],
   22 => ['color' => ORANGE, 'captain' => 1, 'count' => 1, 'sail' => 'right', 'img' => 13],

   31 => ['color' => PURPLE, 'captain' => 0, 'count' => 2, 'sail' => 'left', 'img' => 12],
   32 => ['color' => PURPLE, 'captain' => 1, 'count' => 2, 'sail' => 'left', 'img' => 11],

   41 => ['color' => RED, 'captain' => 0, 'count' => 2, 'sail' => 'right', 'img' => 14],
   43 => ['color' => RED, 'captain' => 2, 'count' => 1, 'sail' => 'right', 'img' => 9],

   41 => ['color' => YELLOW, 'captain' => 0, 'count' => 2, 'sail' => 'right', 'img' => 10],
   42 => ['color' => YELLOW, 'captain' => 1, 'count' => 2, 'sail' => 'right', 'img' => 8],
];

$this->cannonade_types = [
   101 => ['colors' => [BLUE, GREEN], 'count' => 6, 'img' => 2],
   102 => ['colors' => [YELLOW, PURPLE], 'count' => 4, 'img' => 3],
   103 => ['colors' => [ORANGE, RED, YELLOW], 'count' => 3, 'img' => 4],
   104 => ['colors' => [RED, ORANGE, YELLOW], 'count' => 3, 'img' => 5],
   105 => ['colors' => [PURPLE, YELLOW], 'count' => 4, 'img' => 6],
   105 => ['colors' => [GREEN, BLUE], 'count' => 6, 'img' => 7],
];
