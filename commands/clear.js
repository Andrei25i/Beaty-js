const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "clear",
    description: "Clears the queue",
    voiceChannel: true,
    
    async execute({interaction}) {
        const queue = useQueue(interaction.guild);
        let defaultEmbed = new EmbedBuilder().setColor(config.embeds.color);

        if (!queue?.isPlaying()) {
            defaultEmbed.setDescription("There is currently no queue")
            return interaction.editReply({embeds: [defaultEmbed]}).then(message => {
                message.react('❌');
            });
        }

        if (!queue.tracks.size) {
            defaultEmbed.setDescription("There is nothing in the queue")
            return interaction.editReply({embeds: [defaultEmbed]}).then(message => {
                message.react('❌');
            });
        }

        queue.tracks.clear();
        
        defaultEmbed.setDescription("Cleared the queue");
        const message = await interaction.editReply({ embeds: [defaultEmbed] });
        message.react('🗑️');
    }
}