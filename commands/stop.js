const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "stop",
    description: "Stops the player and leaves the voice channel",
    voiceChannel: true,

    async execute({interaction}) {
        const queue = useQueue(interaction.guild);

        let defaultEmbed = new EmbedBuilder().setColor(config.embeds.color);

        defaultEmbed.setDescription("No music is currently playing right now");
        if (!queue) return interaction.editReply({ embeds: [defaultEmbed]});
        queue.delete();

        defaultEmbed.setDescription("Music stopped");
        const message = await interaction.editReply({embeds: [defaultEmbed]});
        message.react('⏹️');
    }
}