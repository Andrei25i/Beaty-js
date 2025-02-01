const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "song",
    description: ("Show details about the current song"),
    voiceChannel: true,

    async execute({interaction}) {
        const queue = useQueue(interaction.guild);

        let defaultEmbed = new EmbedBuilder().setColor(config.embeds.color);

        if (!queue?.isPlaying()) {
            defaultEmbed.setDescription("No music is currently playing")
            return interaction.editReply({embeds: [defaultEmbed]}).then(message => {
                message.react('❌');
            });
        }

        const track = queue.currentTrack;
        const timestamp = track.duration;
        const trackDuration = timestamp.progress == "Infinity" ? "infinity (live)" : track.duration
        const trackStatus = queue.node.isPaused() ? "Paused" : "Playing";
        const progress = queue.node.createProgressBar();

        defaultEmbed
            .setTitle("Current track")
            .setDescription(`**[${track.title}](${track.url})**`)
            .addFields(
                { name: "Duration", value: `\`${trackDuration}\``, inline: true },
                { name: "Track Status", value: `\`${trackStatus}\``, inline: true },
                { name: "Requested by", value: `${track.requestedBy}`, inline: true },
                { name: "Progress", value: `${progress}`}
            );
        
        const message = await interaction.editReply({ embeds: [defaultEmbed] });
        setTimeout(() => message.delete(), config.embeds.songDetailsTimeout);
    }
}
