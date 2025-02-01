const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "shuffle",
    description: "Shuffles the queue",
    voiceChannel: true,
    
    async execute({interaction}) {
        const queue = useQueue(interaction.guild);
        let defaultEmbed = new EmbedBuilder().setColor(config.embeds.color);

        if (!queue?.isPlaying()) {
            defaultEmbed.setDescription("There is currently no queue")
            interaction.editReply({ embeds: [defaultEmbed] });
            return;
        }

        queue.tracks.shuffle();
        
        defaultEmbed.setDescription("Shuffled the queue");
        const message = await interaction.editReply({ embeds: [defaultEmbed] });
        message.react('🔀');
    }
}