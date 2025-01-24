const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
    name: "back",
    description: "Plays the previous song",
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

        if (!queue.history.previousTrack) {
            defaultEmbed.setDescription("There was no music played before")
            return interaction.editReply({embeds: [defaultEmbed]}).then(message => {
                message.react('❌');
            });
        }
        
        await queue.history.back();

        defaultEmbed.setDescription("Playing the previous track");
        const message = await interaction.editReply({embeds: [defaultEmbed]});
        message.react('⏮️');
    }
}