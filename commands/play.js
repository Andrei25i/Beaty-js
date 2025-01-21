const { QueryType, useMainPlayer } = require("discord-player");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "play",
    description: ("Plays a song"),
    voiceChannel: true,
    options: [
        {
            name: "song",
            description: ("The song you want to play (query or url)"),
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({client, interaction}) {
        const player = useMainPlayer();

        const song = interaction.options.getString("song");
        const result = await player.search(song, {
            requestedBy: interaction.user.id,
            searchEngine: QueryType.AUTO
        });

        let defaultEmbed = new EmbedBuilder().setColor(config.embeds.color);

        if (!result?.tracks.length) {
            defaultEmbed.setDescription("No results found... Try again...");
            return interaction.editReply({ embeds: [defaultEmbed] }).then(message => {
                message.react('❌');
                return message;
            });
        }

        // This line appears to resolve the "requestedBy = null" bug
        const track = result.tracks[0];

        try {
            // const {track} = 
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
            defaultEmbed.setDescription(`Added **[${track.title}](${track.url})** to the queue, requested by <@${track.requestedBy.id}>`)
            await interaction.editReply({ embeds: [defaultEmbed], withResponse: true})
        } catch (error) {
            defaultEmbed.setDescription("You are not connected to a voice channel");
            return interaction.editReply({ embeds: [defaultEmbed] }).then(message => {
                message.react('❌');
                return message;
            });
        }
    }
}