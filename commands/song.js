const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "song",
    description: ("Shows details about the current song"),
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
        const progress = queue.node.createProgressBar();
        
        const trackStatus = queue.node.isPaused() ? "Paused" : "Playing";

        defaultEmbed
            .setTitle("Current track")
            .setDescription(`
                **[${track.title}](${track.url})**\nDuration: ${trackDuration}\nTrack status: ${trackStatus}\nRequested by: ${track.requestedBy}\n
                Progress ${progress}
                `);
        
        const message = await interaction.editReply({ embeds: [defaultEmbed] });
        setTimeout(() => message.delete(), 30000); // 30s
    }
}
