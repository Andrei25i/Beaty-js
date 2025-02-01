const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "repeat",
    description: "Replays the current song from the start",
    voiceChannel: true,

    async execute({interaction}) {
        const queue = useQueue(interaction.guild);

        let defaultEmbed = new EmbedBuilder().setColor(config.embeds.color);
        if (!queue?.isPlaying()) {
            defaultEmbed.setDescription("No music is currently playing");
            return interaction.editReply({embeds: [defaultEmbed]}).then(message => {
                message.react('❌');
            });
        }

        queue.insertTrack(queue.currentTrack, 0);
        queue.node.skipTo(0)
        if (queue.node.isPaused()) queue.node.resume();

        defaultEmbed.setDescription("Replaying the current song");
        const message = await interaction.editReply({embeds: [defaultEmbed]});
        message.react('🔁');
    }
}