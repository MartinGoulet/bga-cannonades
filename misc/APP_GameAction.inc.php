<?php

abstract class APP_GameAction extends APP_Action
{
    /**
     * @var \cannonades
     */
    protected $game;

    /**
     * @param \cannonades $game
     */
    public function stubGame(\cannonades $game)
    {
        $this->game = $game;
    }

    /**
     * @return \cannonades
     */
    public function getGame()
    {
        return $this->game;
    }

    /**
     * @param int $activePlayerId
     * @return self
     */
    public function stubActivePlayerId($activePlayerId)
    {
        return $this;
    }

    protected static function ajaxResponse($dummy = '')
    {
        if ($dummy != '') {
            throw new InvalidArgumentException("Game action cannot return any data");
        }
    }
}