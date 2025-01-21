const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "resume",
    description: "Resumes the current song",
    voiceChannel: true,

    async execute({interaction}) {
        const queue = useQueue(interaction.guild);

        let defaultEmbed = new EmbedBuilder().setColor(config.embeds.color);

        if (!queue?.isPlaying()) {
            defaultEmbed.setDescription("No music is currently playing right now");
            return interaction.editReply({ embeds: [defaultEmbed]});
        }

        if (!queue.node.isPaused()) {
            defaultEmbed.setDescription("The player is not paused");
            return interaction.editReply({ embeds: [defaultEmbed]});
        }

        queue.node.resume();
        
        defaultEmbed.setDescription("The song resumed");
        const message = await interaction.editReply({ embeds: [defaultEmbed] });
        message.react('▶️');
    }
}