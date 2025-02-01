const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "stop",
    description: "Stop the player and leaves the voice channel",
    voiceChannel: true,

    async execute({interaction}) {
        const queue = useQueue(interaction.guild);

        let defaultEmbed = new EmbedBuilder().setColor(config.embeds.color);

        
        if (!queue) {
            defaultEmbed.setDescription("No music is currently playing");
            return interaction.editReply({embeds: [defaultEmbed]}).then(message => {
                message.react('❌');
            });
        }
        
        queue.delete();

        defaultEmbed.setDescription("Music stopped");
        const message = await interaction.editReply({embeds: [defaultEmbed]});
        message.react('⏹️');
    }
}