module.exports = {
    opt: {
        DJ: {
            enabled: false,
            roleName: '',
            commands: []
        },
        maxVol: 100,
        spotifyBridge: true,
        volume: 75,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 0, // ms
        leaveOnEnd: true,
        leaveOnEndCooldown: 60000,
        discordPlayer: {
            ytdlOptions: {
                quality: "highestaudio",
                highWatermark: 1 << 25
            }
        }
    },

    embeds: {
        color: "#5072FF",
        tracksPerPage: 10,
        songDetailsTimeout: 30000, // 30s
        queueTimeout: 60000, // 60s
        loadingTracksTimeout: 10000, // 10s
    }
};