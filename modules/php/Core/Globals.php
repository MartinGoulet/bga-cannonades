<?php

namespace Cannonades\Core;

class Globals extends \APP_DbObject {

    public static function getActionsRemaining() {
        return self::get('actions') ?? 0;
    }

    public static function setActionsRemaining(int $value) {
        self::set('actions', $value);
    }

    public static function addDamagedShips(int $card_id) {
        $ships = self::getDamagedShips();
        $ships[] = $card_id;
        self::setDamagedShips($ships);
    }

    public static function getDamagedShips() {
        return self::get('damaged_ships', true) ?? [];
    }

    public static function removeDamagedShips(int $card_id) {
        $ships = self::getDamagedShips();
        $ships[] = $card_id;
        self::setDamagedShips($ships);
    }

    protected static function setDamagedShips($value) {
        return self::set('damaged_ships', $value);
    }

    /*************************
     **** GENERIC METHODS ****
     *************************/

    private static function set(string $name, /*object|array*/ $obj) {
        $jsonObj = json_encode($obj);
        self::DbQuery("INSERT INTO `global_variables`(`name`, `value`)  VALUES ('$name', '$jsonObj') ON DUPLICATE KEY UPDATE `value` = '$jsonObj'");
    }

    public static function get(string $name, $asArray = null) {
        /** @var string */
        $json_obj = self::getUniqueValueFromDB("SELECT `value` FROM `global_variables` where `name` = '$name'");
        if ($json_obj) {
            $object = json_decode($json_obj, $asArray);
            return $object;
        } else {
            return null;
        }
    }
}