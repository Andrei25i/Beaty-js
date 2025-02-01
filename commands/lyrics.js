const { useQueue, useMainPlayer } = require("discord-player");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "lyrics",
    description: ("Show the lyrics of the current song"),
    voiceChannel: true,

    async execute({interaction}) {
        const player = useMainPlayer()
        const queue = useQueue(interaction.guild);

        let defaultEmbed = new EmbedBuilder().setColor(config.embeds.color);

        if (!queue?.isPlaying()) {
            defaultEmbed.setDescription("No music is currently playing")
            return interaction.editReply({embeds: [defaultEmbed]}).then(message => {
                message.react('❌');
            });
        }

        const results = await player.lyrics
            .search({q: queue.currentTrack.title})
            .catch(async (e) => {
                console.log(e);
                defaultEmbed.setDescription("Something went wrong...");
                return interaction.editReply({embeds: [defaultEmbed]}).then(message => {
                    message.react('❌');
                });
            })

        const lyrics = results?.[0];
        if (!lyrics?.plainLyrics) {
            defaultEmbed.setDescription(`No lyrics found for **[${queue.currentTrack.title}](${queue.currentTrack.url})**`);
            const message = await interaction.editReply({embeds: [defaultEmbed]});
            message.react('❌');
            return;
        }

        const lyricsText = lyrics.plainLyrics;

        if (lyricsText.length >= 4000) {
            const lyricsBuffer = Buffer.from(lyricsText, 'utf-8');
            const lyricsFile = new AttachmentBuilder(lyricsBuffer, { name: `${queue.currentTrack.cleanTitle}.txt` });

            return interaction.editReply({files: [lyricsFile]});
        }

        defaultEmbed
            .setTitle(`Lyrics - ${queue.currentTrack.cleanTitle}`)
            .setDescription(lyricsText);
        
        interaction.editReply({ embeds: [defaultEmbed] });    
    }
}
