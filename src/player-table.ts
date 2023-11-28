class PlayerTable {
    public player_id: number;

    constructor(public game: Cannonades, player: CannonadesPlayerData) {
        this.player_id = Number(player.id);

        const html = `<div id="player-table-${player.id}" class="player-table whiteblock" style="--player-color: #${player.color}">
            <h3>${player.name}</h3>
        </div>`;

        document.getElementById("tables").insertAdjacentHTML("beforeend", html);
    }
}
