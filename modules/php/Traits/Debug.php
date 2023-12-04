<?php

namespace Cannonades\Traits;

use Cannonades\Core\Globals;

trait Debug {
    static function setActionsCount($nbr) {
        Globals::setActionsRemaining(intval($nbr));
    }
}