declare const define;

define([
    "dojo",
    "dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    "ebg/stock",
], function (dojo, declare) {
    return declare("bgagame.cannonadesmg", [ebg.core.gamegui], new Cannonades());
});
