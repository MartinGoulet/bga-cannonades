declare const g_gamethemeurl: string;

declare namespace ebg {
    /**
     * Control that allow to set/get numeric value from inner html of div/span, and provides animation on from/to value.
     */
    export class counter {
        /**
         * Associate counter with existing target dom element
         * @param target Id of the Html element
         */
        create(target: string): void;
        /**
         * Return current value
         */
        getValue(): number;
        /**
         * Increment value by "by" and animate from previous value
         * @param by Value to increment
         */
        incValue(by: number): void;
        /**
         * Set value no animation
         * @remark No animation
         */
        setValue(value: number): void;
        /**
         * Set value with animatino
         * @remark With animation
         */
        toValue(value: number): void;
        /**
         * Display - instead. 
         * @remark It just changes display value once, it does not actually disables it, i.e. if you set it again, it will be shown again
         */
        disable(): void;
    }

    namespace core {

        interface gamegui {
            /////////////////////////////////////////////////
            // General tips

            /**
             * ID of the player on whose browser the code is running
             */
            player_id: string;
            /**
             * Flag set to true if the user at the table is a spectator (not a player).
             * Note: If you want to hide an element from spectators, you should use CSS 'spectatorMode' class.
             */
            isSpectator: boolean;
            /**
             * Contains the initial set of data to init the game, created at game start or by game refresh (F5).
             * You can update it as needed to keep an up-to-date reference of the game on the client side if you need it. (Most of the time this is unnecessary).
             */
            // public gamedatas: BgaGamedatas;
            /**
             * Returns true if the player on whose browser the code is running is currently active (it's his turn to play).
             */
            isCurrentPlayerActive: () => boolean;
            /**
             * Return the ID of the active player, or null if we are not in an "activeplayer" type state.
             */
            getActivePlayerId: () => number;
            /**
             * Return an array with the IDs of players who are currently active (or an empty array if there are none).
             */
            getActivePlayers: () => string[];
            /**
             * Return true if the game is in realtime. 
             * Note that having a distinct behavior in realtime and turn-based should be exceptional.
             */
            bRealtime: boolean;
            /**
             * Returns true if the game is in archive mode after the game (the game has ended)
             */
            g_archive_mode: boolean;
            /**
             * Returns true during replay/archive mode if animations should be skipped. Only needed if you are doing custom animations. (The BGA-provided animation functions like this.slideToObject() automatically handle instantaneous mode.)
             * Technically, when you click "replay from move #20", the system replays the game from the very beginning with moves 0 - 19 happening in instantaneous mode and moves 20+ happening in normal mode.
             */
            instantaneousMode: boolean;

            ///////////////////////////////
            // Animations

            /**
             * Sliding element on the game area is the recommended and the most used way to animate your game interface. 
             * Using slides allow players to figure out what is happening on the game, as if they were playing with the real boardgame.
             * @param mobile_obj ID of the object to move. This object must be "relative" or "absolute" positioned.
             * @param target_obj ID of the target object. This object must be "relative" or "absolute" positioned.
             * @param duration Duration in millisecond of the slide. The default is 500 milliseconds.
             * @param delay If you defines a delay, the slide will start only after this delay
             * @note 
             * it is not mandatory that mobile_obj and target_obj have the same size. If their size are different, the system slides the center of mobile_obj to the center of target_obj.
             * @note
             * The method returns an dojo.fx animation, so you can combine it with other animation if you want to. It means that you have to call the "play()" method, otherwise the animation WON'T START.
             * @example
             * this.slideToObject( "some_token", "some_place_on_board" ).play();
             */
            slideToObject: (mobile_obj: string | HTMLElement, target_obj: string, duration?: number, delay?: number) => DojoFxAnimation;
            /**
             * This method does exactly the same as "slideToObject", except than you can specify some (x,y) coordinates. 
             * This way, "mobile_obj" will slide to the specified x,y position relatively to "target_obj".
             * @param mobile_obj ID of the object to move. This object must be "relative" or "absolute" positioned.
             * @param target_obj ID of the target object. This object must be "relative" or "absolute" positioned.
             * @param target_x Horizontal position in pixel on target_obj
             * @param target_y Vertical position in pixel on target_obj
             * @param duration Duration in millisecond of the slide. The default is 500 milliseconds.
             * @param delay If you defines a delay, the slide will start only after this delay
             * @note 
             * it is not mandatory that mobile_obj and target_obj have the same size. If their size are different, the system slides the center of mobile_obj to the center of target_obj.
             * @note
             * The method returns an dojo.fx animation, so you can combine it with other animation if you want to. It means that you have to call the "play()" method, otherwise the animation WON'T START.
             * @example
             * this.slideToObjectPos( "some_token", "some_place_on_board", 0, 10 ).play();
             */
            slideToObjectPos: (mobile_obj: string | HTMLElement, target_obj: string, target_x: number, target_y: number, duration?: number, delay?: number) => DojoFxAnimation;
            /**
             * This method is useful when you want to slide a temporary HTML object from one place to another. 
             * As this object does not exists before the animation and won't remain after, it could be complex to 
             * create this object (with dojo.place), to place it at its origin (with placeOnObject) to slide it (with slideToObject) 
             * and to make it disappear at the end.
             * @param mobile_obj_html Piece of HTML code that represent the object to slide
             * @param mobile_obj_parent ID of an HTML element of your interface that will be the parent of this temporary HTML object. 
             * @param from ID of the origin of the slide.
             * @param to ID of the target of the slide.
             * @param duration Duration in millisecond of the slide. The default is 500 milliseconds.
             * @param delay If you defines a delay, the slide will start only after this delay
             * 
             * @example
             * this.slideTemporaryObject( '<div class="token_icon"></div>', 'tokens', 'my_origin_div', 'my_target_div' ).play();
             */
            slideTemporaryObject: (mobile_obj_html: string | Element, mobile_obj_parent: string | Element, from: string | Element, to: string | Element, duration?: number, delay?: number) => DojoFxAnimation;

            /**
             * This method is a handy shortcut to slide an existing HTML object to some place then destroy it upon arrival. It can be used for example to move a victory token or a card from the board to the player panel to show that the player earns it, then destroy it when we don't need to keep it visible on the player panel.
             * @param node 
             * @param to 
             * @param duration Duration in millisecond of the slide. The default is 500 milliseconds.
             * @param delay If you defines a delay, the slide will start only after this delay
             * 
             * @note 
             * It works the same as this.slideToObject and takes the same arguments, but it starts the animation.
             * @example
             * this.slideToObjectAndDestroy( "some_token", "some_place_on_board", 1000, 0 );
             */
            slideToObjectAndDestroy: (node: string, to: string, duration?: number, delay?: number) => DojoFxAnimation;

            ///////////////////////////////
            // Moving Elements

            /**
             * It works exactly like "slideToObject", except that the effect is immediate.
             * @example
             * // Place the new token on current player board
             * this.placeOnObject( "my_new_token", "overall_player_board_" + this.player_id );
             * @note
             * This is not really an animation, but placeOnObject is frequently used before starting an animation.
             */
            placeOnObject: (mobile_obj: string, target_obj: string) => void
            /**
             * This method works exactly like placeOnObject, except than you can specify some (x,y) coordinates.
             */
            placeOnObjectPos: (mobile_obj: string, target_obj: string, target_x: number, target_y: number) => void;
            /**
             * With this method, you change the HTML parent of "mobile_obj" element. "target_obj" is the new parent of this element. The beauty of attachToNewParent is that the mobile_obj element DOES NOT MOVE during this process.
             * @note
             * What happens is that the method calculate a relative position of mobile_obj to make sure it does not move after the HTML parent changes.
             */
            attachToNewParent: (mobile_obj: string, target_obj: string) => void


            prefs: { [pref_id: number]: BgaGamePreference };

            format_block: (template: string, params: any) => string;

            removeTooltip: (nodeId: string) => void;
            /**
             * Add an HTML tooltip to the DOM node (for more elaborate content such as presenting a bigger version of a card).
             */
            addTooltipHtml: (nodeId: string, html: string, delay?: number) => void;
            /**
             * Add a simple text tooltip to all the DOM nodes set with this cssClass.
             * @param cssClass 
             * @param helpString Specify to display some information about "what is this game element?"
             * @param actionString Specify to display some information about "what happens when I click on this element?".
             * @param delay 
             * @note
             * All concerned nodes must have IDs to get tooltips.
             * @note
             * helpString and actionString : Usually, _() must be used for the text to be marked for translation.
             */
            addTooltipToClass: (cssClass, helpString: string, actionString: string, delay?: number) => void;
            addActionButton: (id: string, label: string, method: string | Function, destination?: string, blinking?: boolean, color?: BgaButtonColor) => void;
            connect: (element: HTMLElement, event: string, handler: string | Function) => any;

            connectClass: (cssClassName: string, event: string, handle: string | Function) => void;
            disconnect: (element: HTMLElement, event: string) => void;
            disconnectAll: () => void;

            restoreServerGameState: () => void;
            updatePageTitle() : void;

            checkPossibleActions: (action: string, nomessage?: string) => boolean;
            checkAction: (action: string, nomessage?: boolean) => boolean;
            ajaxcall: (url: string, parameters: any, obj_callback: any, callback: Function, callback_error: Function) => void;

            setClientState: (state_name: string, args: any) => void;

            scoreCtrl: { [player_id: string]: ebg.counter };

            notifqueue: INotificationQueue;

            inherited: (args: any) => any;

            confirmationDialog( message: string, yesHandler?: string | Function, noHandler?: string | Function ) : void;
        }

        /**
         * To allow Typescript to extends the interface without implementing it
         */
        class gamegui implements gamegui {}

    }

}

declare interface INotificationQueue {
    setSynchronous: (event: string, duration: number) => void;
    onSynchronousNotificationEnd: () => void;
    setIgnoreNotificationCheck: (event: string, condition: (event: any) => boolean) => void;
}

declare interface INotification<TArgs> {
    args: TArgs;
    log: string;
    move_id: number;
    table_id: string;
    time: number;
    type: string;
    uid: string;
}

declare interface BgaPlayer {
    beginner: boolean;
    color: string;
    color_back: any | null;
    eliminated: number;
    id: string;
    is_ai: string;
    name: string;
    score: string;
    zombie: number;
}

declare interface BgaGamestate {
    id: string;
    name: string;
    description: string;
    descriptionmyturn: string;
}

declare interface BgaGamedatas {
    current_player_id: string;
    decision: { decision_type: string };
    game_result_neutralized: string;
    gamestate: BgaGamestate;
    gamestates: { [gamestateId: number]: BgaGamestate };
    neutralized_player_id: string;
    notifications: { last_packet_id: string, move_nbr: string }
    playerorder: (string | number)[];
    tablespeed: string;
}

interface Dojo {
    /**
     * Modify the CSS property of any HTML element in your interface.
     * @example
     * dojo.style( 'my_element', 'display', 'none' );
     */
    style: (nodeId: string, property: string, value: string) => void;

    addClass: (nodeId: string, className: string) => void;
    removeClass: (nodeId: string, className?: string) => void;
    toggleClass: (nodeId: string, className: string, forceValue: boolean) => void;
    hasClass: (nodeId: string, className: string) => boolean;
    animateProperty: (info: any) => any;

    attr: (nodeId: string, property: string, value?: any) => any;

    place: (html: string, nodeId: string, action?: DojoPlaceAction) => void;
    /**
     * Remove all children of the node element
     * @example
     * dojo.empty('my_hand');
     */
    empty: (nodeId: string) => void;
    /**
     * Remove the element
     * @example
     * // this remove all subnode of class green from mynode
     * dojo.query(".green", mynode).forEach(dojo.destroy); 
     */
    destroy: (element: any) => void;
    /**
     * Create element
     * @example
     * // this creates div with class yellow_array and places it in "parent"
     * dojo.create("div", { class: "yellow_arrow" }, parent);
     */
    create: (element_type: string, classes?: any, parent?: any) => void;

    /**
     * Same as dojo.style(), but for all the nodes set with the specified cssClassName
     */
    addStyleToClass: (cssClassName: string, cssProperty: string, propertyValue: any) => void


    /**
     * Used to associate a player event with one of your notification methods.
     * @example
     * dojo.connect( $('my_element'), 'onclick', this, 'onClickOnMyElement' );
     */
    connect: (element: any, event: string, callback_obj: any, callback_method?: string | Function) => number;


    query: Function;
    hitch: Function;
    subscribe: Function;
    string: any;
    fx: any;
    marginBox: Function;
    fadeIn: Function;
    trim: Function;
    stopEvent: Function;
    position: Function;
}

interface DojoFxAnimation {
    play: () => void;
}

/**
 * Translate text
 */
declare const dojo: Dojo;
declare const _: (text: string) => string;