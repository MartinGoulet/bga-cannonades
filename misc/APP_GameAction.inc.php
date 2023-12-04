<?php

abstract class APP_GameAction extends APP_Action
{
    /**
     * @var \cannonadesmg
     */
    protected $game;

    /**
     * @param \cannonadesmg $game
     */
    public function stubGame(\cannonadesmg $game)
    {
        $this->game = $game;
    }

    /**
     * @return \cannonadesmg
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