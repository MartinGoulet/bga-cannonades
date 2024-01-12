<?php

/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * cannonades implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on https://boardgamearena.com.
 * See http://en.doc.boardgamearena.com/Studio for more information.
 * -----
 * 
 * cannonades.action.php
 *
 * cannonades main action entry point
 *
 *
 * In this file, you are describing all the methods that can be called from your
 * user interface logic (javascript).
 *       
 * If you define a method "myAction" here, then you can call it from your javascript code with:
 * this.ajaxcall( "/cannonades/cannonades/myAction.html", ...)
 *
 */


class action_cannonades extends APP_GameAction {
  // Constructor: please do not modify
  public function __default() {
    if (self::isArg('notifwindow')) {
      $this->view = "common_notifwindow";
      $this->viewArgs['table'] = self::getArg("table", AT_posint, true);
    } else {
      $this->view = "cannonades_cannonades";
      self::trace("Complete reinitialization of board game");
    }
  }

  // TODO: defines your action entry points there
  public function discardCardForVendetta() {
    self::setAjaxMode();

    // Retrieve arguments
    $card_id = self::getArg("card_id", AT_int, true);

    // Then, call the appropriate method in your game logic
    $this->game->checkAction('discardCardForVendetta');
    $this->game->discardCardForVendetta($card_id);

    self::ajaxResponse();
  }


  public function addShip() {
    self::setAjaxMode();
    // Retrieve arguments
    $card_id = self::getArg("card_id", AT_posint, true);
    // Then, call the appropriate method in your game logic, like "playCard" or "myAction"
    $this->game->checkAction('addShip');
    $this->game->addShip($card_id);
    self::ajaxResponse();
  }

  public function discardCard() {
    self::setAjaxMode();
    // Retrieve arguments
    $card_id = self::getArg("card_id", AT_posint, true);
    // Then, call the appropriate method in your game logic, like "playCard" or "myAction"
    $this->game->checkAction('discardCard');
    $this->game->discardCard($card_id);
    self::ajaxResponse();
  }

  public function shootCannonade() {
    self::setAjaxMode();
    // Retrieve arguments
    $card_id = self::getArg("card_id", AT_posint, true);
    $ship_id = self::getArg("ship_id", AT_posint, true);
    // Then, call the appropriate method in your game logic, like "playCard" or "myAction"
    $this->game->checkAction('shootCannonade');
    $this->game->shootCannonade($card_id, $ship_id);
    self::ajaxResponse();
  }

  public function boardShip() {
    self::setAjaxMode();
    // Retrieve arguments
    $card_id = self::getArg("card_id", AT_posint, true);
    $ship_id = self::getArg("ship_id", AT_posint, true);
    // Then, call the appropriate method in your game logic, like "playCard" or "myAction"
    $this->game->checkAction('boardShip');
    $this->game->boardShip($card_id, $ship_id);
    self::ajaxResponse();
  }

  public function vendettaDrawCard() {
    self::setAjaxMode();
    $this->game->checkAction('vendettaDrawCard');
    $this->game->vendettaDrawCard();
    self::ajaxResponse();
  }

  public function vendettaDiscardCard() {
    self::setAjaxMode();
    $this->game->checkAction('vendettaDiscardCard');
    $this->game->vendettaDiscardCard();
    self::ajaxResponse();
  }

  public function vendettaFlipShip() {
    self::setAjaxMode();
    $ship_id = self::getArg("ship_id", AT_posint, true);
    $this->game->checkAction('vendettaFlipShip');
    $this->game->vendettaFlipShip($ship_id);
    self::ajaxResponse();
  }

  public function discard() {
    self::setAjaxMode();
    $card_ids = self::getArrayArgs("card_ids");
    $this->game->checkAction('discard');
    $this->game->discard($card_ids);
    self::ajaxResponse();
  }

  public function standoff() {
    self::setAjaxMode();
    $card_id = self::getArg("card_id", AT_posint, true);
    $this->game->checkAction('standoff');
    $this->game->standoff($card_id);
    self::ajaxResponse();
  }

  public function pass() {
    self::setAjaxMode();
    $this->game->checkAction('pass');
    $this->game->pass();
    self::ajaxResponse();
  }

  private function getArrayArgs(string $name) {
    $args = self::getArg($name, AT_numberlist, true);

    // Removing last ';' if exists
    if (substr($args, -1) == ';')
      $args = substr($args, 0, -1);

    if ($args == '')
      $args = array();
    else
      $args = explode(';', $args);

    return $args;
  }

  /*
    
    Example:
  	
    public function myAction()
    {
        self::setAjaxMode();     

        // Retrieve arguments
        // Note: these arguments correspond to what has been sent through the javascript "ajaxcall" method
        $arg1 = self::getArg( "myArgument1", AT_posint, true );
        $arg2 = self::getArg( "myArgument2", AT_posint, true );

        // Then, call the appropriate method in your game logic, like "playCard" or "myAction"
        $this->game->myAction( $arg1, $arg2 );

        self::ajaxResponse( );
    }
    
    */
}
