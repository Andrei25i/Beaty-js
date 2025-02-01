const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "pause",
    description: "Pause the current song",
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

        if (queue.node.isPaused()) {
            defaultEmbed.setDescription("The player is already paused");
            return interaction.editReply({ embeds: [defaultEmbed]});
        }

        queue.node.pause();

        defaultEmbed.setDescription("The song is paused");
        const message = await interaction.editReply({ embeds: [defaultEmbed] });
        message.react('⏸');
    }
}