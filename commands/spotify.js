const extractUrlType = require("../spotify/extractUrlType");
const getSpotifyToken = require("../spotify/getSpotifyToken");
const getSpotifyTracks = require("../spotify/getSpotifyTracks");
const getPlaylistName = require("../spotify/getPlaylistName");

const { useMainPlayer, QueryType } = require("discord-player");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "spotify",
    description: "Load a playlist or an album from spotify",
    voiceChannel: true,
    options: [
        {
            name: "url",
            description: ("The url of the playlist or of the album"),
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    async execute({interaction}) {
        const url = interaction.options.getString("url");
        const type = extractUrlType(url);

        let defaultEmbed = new EmbedBuilder().setColor(config.embeds.color);
        if (!type) {
            defaultEmbed.setDescription("Invalid URL. Please try again")
            return interaction.editReply({ embeds: [defaultEmbed] }).then(message => {
                message.react('❌');
                return message;
            });
        }

        let results, playlistName;
        try {
            const token = await getSpotifyToken();
            results = await getSpotifyTracks(url, type, token);
            playlistName = await getPlaylistName(url, type, token);

        } catch (error) {
            console.log(error);
            defaultEmbed.setDescription("There was an error loading the Spotify content. Maybe the link is not valid");
            return interaction.editReply({ embeds: [defaultEmbed] }).then(message => {
                message.react('❌');
                return message;
            });
        } 

        let tracksDetails;
        if (type === "playlist") {
            tracksDetails = results.map(track => {
                const title = track.track.name;
                const artists = track.track.artists.map(artist => " " + artist.name);
                return `${title} by${artists}`;
            });
        }
        else {
            tracksDetails = results.map(track => {
                const title = track.name;
                const artists = track.artists.map(artist => " " + artist.name);
                return `${title} by${artists}`
            });
        }

        const player = useMainPlayer();
        let message;
        for (let i = 0; i < tracksDetails.length; i++) {
            let song = tracksDetails[i];
            const result = await player.search(song, {
                requestedBy: interaction.user.id,
                searchEngine: QueryType.AUTO
            });
            const track = result.tracks[0];

            try {
                await player.play(interaction.member.voice.channel, track, {
                    nodeOptions: {
                        metadata: {
                            channel: interaction.channel,
                        },  
                        volume: client.config.opt.volume,
                        leaveOnEmpty: client.config.opt.leaveOnEmpty,
                        leaveOnEmptyCooldown: client.config.opt.leaveOnEmptyCooldown,
                        leaveOnEnd: client.config.opt.leaveOnEnd,
                        leaveOnEndCooldown: client.config.opt.leaveOnEndCooldown,
                    }
                });
            } catch (error) {
                defaultEmbed.setDescription("You are not connected to a voice channel");
                return interaction.editReply({ embeds: [defaultEmbed] }).then(message => {
                    message.react('❌');
                    return message;
                });
            }

            const progressBar = createProgressBar(playlistName, i+1, tracksDetails.length);
            message = await interaction.editReply({ content: `${progressBar}`, embeds: [] });
        }

        defaultEmbed.setDescription("All tracks were loaded successfully");
        message = await interaction.editReply({ content: "", embeds: [defaultEmbed] });
        setTimeout(() => message.delete(), config.embeds.loadingTracksTimeout);
    } 
}

function createProgressBar(playlistName, current, total, barLength = 20) {
    const progress = Math.round((current / total) * barLength);
    const emptyProgress = barLength - progress;

    const progressText = '🟩'.repeat(progress);
    const emptyProgressText = '⬜'.repeat(emptyProgress);
    const percentageText = Math.round((current / total) * 100) + '%';

    const animatedDots = ".".repeat(current % 4);
    return `Loading tracks from \`${playlistName}\`${animatedDots}\n\`| ${progressText}${emptyProgressText} | ${percentageText}     ${current}/${total} (tracks)\``;
}