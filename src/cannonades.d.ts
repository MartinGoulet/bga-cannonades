interface Cannonades extends ebg.core.gamegui {}

interface CannonadesPlayerData extends BgaPlayer {}

interface CannonadesPlayerInfo {
    board: CannonadesCard[];
    hand: CannonadesCard[];    
}

interface CannonadesGamedatas extends BgaGamedatas {
    ship_types: Record<number, ShipType>;
    cannonade_types: Record<number, CannonadeType>;

    players: Record<string, CannonadesPlayerData>;
    players_info: Record<number, CannonadesPlayerInfo>;
    players_order: number[];

    deck_count: number;
    discard: CannonadesCard[];

    is_standoff: boolean;
}

type ShipType = {
    color: string;
    captain: number;
    count: number;
    img: number;
}

type CannonadeType = {
    colors: string[];
    count: number;
    img: number;
}

interface CannonadesCard {
    id: string;
    type: string;
    type_arg: string;
    location: string;
    location_arg: string;
}

interface StateHandler {
    onEnteringState(args: any): void;
    onLeavingState(): void;
    onUpdateActionButtons(args: any): void;
}
