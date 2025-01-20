const { QueryType, useMainPlayer } = require("discord-player");
const { ApplicationCommandOptionType, EmbedBuilder, VoiceChannel } = require("discord.js");

module.exports = {
    name: "play",
    description: ("Plays a song"),
    voiceChannel: true,
    options: [
        {
            name: "song",
            description: ("The song you want to play"),
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

        let defaultEmbed = new EmbedBuilder().setColor("#5072FF");``

        if (!result?.tracks.length) {
            defaultEmbed.setAuthor({ name: await `No results found... Try again...`} );
            return interaction.reply({ embeds: [defaultEmbed] });
        }

        try {
            const {track} = await player.play(interaction.member.voice.channel, song, {
                nodeOptions: {
                    metadata: {
                        channel: interaction.channel
                    },  
                    volume: client.config.opt.volume,
                    leaveOnEmpty: client.config.opt.leaveOnEmpty,
                    leaveOnEmptyCooldown: client.config.opt.leaveOnEmptyCooldown,
                    leaveOnEnd: client.config.opt.leaveOnEnd,
                    leaveOnEndCooldown: client.config.opt.leaveOnEndCooldown,
                }
            });
            defaultEmbed.setDescription(`Se încarcă [${track.title}](${track.url}) în coadă... Cerut de <@${interaction.user.id}>`)
            await interaction.editReply({ embeds: [defaultEmbed] })
        } catch (error) {
            console.log(`Play error ${error}`);
            defaultEmbed.setAuthor({ name: `You are not in a voice channel... Try again...`});
            return interaction.editReply({ embeds: [defaultEmbed]} );
        }
    }
}