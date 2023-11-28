interface Cannonades extends ebg.core.gamegui {}

interface CannonadesPlayerData extends BgaPlayer {}

interface CannonadesGamedatas extends BgaGamedatas {
    // player_id: player
    players: Record<string, CannonadesPlayerData>;
}

interface StateHandler {
    onEnteringState(args: any): void;
    onLeavingState(): void;
    onUpdateActionButtons(args: any): void;
}
